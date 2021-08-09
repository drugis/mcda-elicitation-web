import {OurError} from '@shared/interface/IError';
import IWeights from '@shared/interface/IWeights';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {TPataviCommands} from '@shared/types/PataviCommands';
import {TPataviResults} from '@shared/types/PataviResults';
import Axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import httpStatus from 'http-status-codes';
import _ from 'lodash';
import {client as WebSocketClient, connection, IMessage} from 'websocket';
import logger from './logger';

const {PATAVI_HOST, PATAVI_PORT, PATAVI_API_KEY} = process.env;
const protocol = process.env.SECURE_TRAFFIC === 'true' ? 'https' : 'http';
const pataviTaskUrl = `${protocol}://${PATAVI_HOST}:${PATAVI_PORT}/task?service=smaa_v2&ttl=PT5M`;

export default function createPataviTask(
  problem: IPataviProblem,
  callback: (error: OurError, location?: string) => void
): void {
  logger.debug('pataviTaskRepository.createPataviTask');
  const requestOptions: AxiosRequestConfig = {
    url: pataviTaskUrl,
    headers: {
      'Content-Type': 'application/json',
      'X-api-key': PATAVI_API_KEY,
      'X-client-name': 'MCDA-open'
    }
  };

  Axios.post(pataviTaskUrl, problem, requestOptions).then(
    (response: AxiosResponse): void => {
      logger.debug('patavi service task created');
      const {status, headers} = response;
      if (status === httpStatus.CREATED && headers.location) {
        callback(null, headers.location);
      } else {
        callback({
          status: status,
          message: 'Error queueing task: server returned code ' + status
        });
      }
    }
  );
}

export function postAndHandleResults(
  problem: TPataviCommands,
  callback: (error: OurError, result?: TPataviResults) => void
) {
  const requestOptions: AxiosRequestConfig = {
    url: pataviTaskUrl,
    headers: {
      'Content-Type': 'application/json',
      'X-api-key': PATAVI_API_KEY,
      'X-client-name': 'MCDA-open'
    }
  };
  Axios.post(pataviTaskUrl, problem, requestOptions)
    .then((pataviResponse: AxiosResponse) => {
      return handleUpdateResponse(pataviResponse, callback);
    })
    .then((updatesUrl) => {
      const client = new WebSocketClient();
      client.on('connectFailed', _.partial(failedConnectionCallback, callback));
      client.on('connect', _.partial(successfullConnectionCallback, callback));
      client.connect(updatesUrl);
    })
    .catch((error: AxiosError) => {
      errorHandler(error.message, callback);
    });
}

function handleUpdateResponse(
  pataviResponse: AxiosResponse,
  callback: (error: OurError, result?: IWeights | ISmaaResults) => void
) {
  if (
    pataviResponse.data &&
    pataviResponse.data._links &&
    pataviResponse.data._links.updates &&
    pataviResponse.data._links.updates.href &&
    pataviResponse.status === 201
  ) {
    return pataviResponse.data._links.updates.href;
  } else {
    errorHandler(pataviResponse.status, callback);
  }
}

function failedConnectionCallback(
  callback: (error: OurError) => void,
  error: OurError
) {
  errorHandler(
    `Websocket connection to Patavi failed with error: ${error.message}`,
    callback
  );
}

function successfullConnectionCallback(
  callback: (error: AxiosError, result?: IWeights | ISmaaResults) => void,
  connection: connection
) {
  connection.on('message', (message: IMessage) => {
    if (message.utf8Data) {
      const data = JSON.parse(message.utf8Data);
      handleMessage(connection, data, callback);
    } else {
      errorHandler('Malformed response from Patavi', callback);
    }
  });
}

function handleMessage(
  connection: connection,
  messageData: {eventType: string; eventData: {href: string}},
  callback: (error: AxiosError, result?: IWeights | ISmaaResults) => void
) {
  if (messageData.eventType === 'done') {
    connection.close();
    Axios.get(messageData.eventData.href).then((resultsResponse: any) => {
      callback(null, resultsResponse.data);
    });
  } else {
    errorHandler(
      `Patavi returned event type: ${messageData.eventType}`,
      callback
    );
  }
}

function errorHandler(
  message: string | number,
  callback: (error: any) => void
) {
  logger.error(`Patavi responded with: ${message}`);
  callback(message);
}
