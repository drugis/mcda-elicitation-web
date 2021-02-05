import {OurError} from '@shared/interface/IError';
import IWeights from '@shared/interface/IWeights';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {TPataviCommands} from '@shared/types/PataviCommands';
import {TPataviResults} from '@shared/types/PataviResults';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import fs from 'fs';
import {IncomingMessage} from 'http';
import httpStatus from 'http-status-codes';
import https from 'https';
import _ from 'lodash';
import {client as WebSocketClient, connection, IMessage} from 'websocket';
import logger from './logger';

const {
  PATAVI_HOST,
  PATAVI_PORT,
  PATAVI_CLIENT_KEY,
  PATAVI_CLIENT_CRT,
  PATAVI_CA
} = process.env;
const pataviTaskUrl = `https://${PATAVI_HOST}:${PATAVI_PORT}/task?service=smaa_v2&ttl=PT5M`;

let httpsOptionsNoCa = {
  hostname: PATAVI_HOST,
  port: Number.parseInt(PATAVI_PORT),
  cert: fs.readFileSync(PATAVI_CLIENT_CRT!),
  key: fs.readFileSync(PATAVI_CLIENT_KEY!)
};
let ca;
try {
  ca = fs.readFileSync(PATAVI_CA!);
} catch (exception) {
  logger.warn('Certificate autority file not found at: ' + PATAVI_CA);
}
const httpsOptions = ca ? {...httpsOptionsNoCa, ca: ca} : httpsOptionsNoCa;
const httpsAgent = new https.Agent({...httpsOptions, path: pataviTaskUrl});

export default function createPataviTask(
  problem: IPataviProblem,
  callback: (error: OurError, location?: string) => void
): void {
  logger.debug('pataviTaskRepository.createPataviTask');
  const requestOptions = {
    path: '/task?service=smaa_v2&ttl=PT5M',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const postRequest = https.request(
    _.extend(httpsOptions, requestOptions),
    (response: IncomingMessage): void => {
      logger.debug('patavi service task created');
      const {statusCode, headers} = response;
      if (statusCode === httpStatus.CREATED && headers.location) {
        callback(null, headers.location);
      } else {
        callback({
          status: statusCode,
          message: 'Error queueing task: server returned code ' + statusCode
        });
      }
    }
  );
  postRequest.write(JSON.stringify(problem));
  postRequest.end();
}

export function postAndHandleResults(
  problem: TPataviCommands,
  callback: (error: OurError, result?: TPataviResults) => void
) {
  Axios.post(pataviTaskUrl, problem, {httpsAgent})
    .then((pataviResponse: AxiosResponse) => {
      return handleUpdateResponse(pataviResponse, callback);
    })
    .then((updatesUrl) => {
      const client = new WebSocketClient({
        tlsOptions: {...httpsOptions, path: updatesUrl}
      });
      client.on('connectFailed', _.partial(failedConnectionCallback, callback));
      client.on(
        'connect',
        _.partial(successfullConnectionCallback, httpsAgent, callback)
      );
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
  httpsAgent: https.Agent,
  callback: (error: AxiosError, result?: IWeights | ISmaaResults) => void,
  connection: connection
) {
  connection.on('message', (message: IMessage) => {
    if (message.utf8Data) {
      const data = JSON.parse(message.utf8Data);
      handleMessage(connection, httpsAgent, data, callback);
    } else {
      errorHandler('Malformed response from Patavi', callback);
    }
  });
}

function handleMessage(
  connection: connection,
  httpsAgent: https.Agent,
  messageData: {eventType: string; eventData: {href: string}},
  callback: (error: AxiosError, result?: IWeights | ISmaaResults) => void
) {
  if (messageData.eventType === 'done') {
    connection.close();
    Axios.get(messageData.eventData.href, {httpsAgent}).then(
      (resultsResponse: any) => {
        callback(null, resultsResponse.data);
      }
    );
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
