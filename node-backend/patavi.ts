import {OurError} from '@shared/interface/IError';
import IWeights from '@shared/interface/IWeights';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {TPataviCommands} from '@shared/types/PataviCommands';
import {TPataviResults} from '@shared/types/PataviResults';
import Axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import _ from 'lodash';
import {
  client as WebSocketClient,
  connection,
  IUtf8Message,
  Message
} from 'websocket';
import logger from './logger';

const {PATAVI_API_KEY} = process.env;
const pataviTaskUrl = getPataviTaskUrl();

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
      logger.debug('connecting to websocket at ' + updatesUrl);
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
    pataviResponse?.data?._links?.updates?.href &&
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
  connection.on('message', (message: Message) => {
    if (isUtf8Message(message)) {
      const data = JSON.parse(message.utf8Data);
      handleMessage(connection, data, callback);
    } else {
      errorHandler('Malformed response from Patavi', callback);
    }
  });
}

function isUtf8Message(message: Message): message is IUtf8Message {
  return (message as IUtf8Message).utf8Data !== undefined;
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
  } else if (messageData.eventType.startsWith('progres')) {
    // ignore progress messages
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

export function getPataviTaskUrl(): string {
  const {PATAVI_HOST, PATAVI_PORT, SECURE_TRAFFIC} = process.env;
  const protocol = SECURE_TRAFFIC === 'true' ? 'https' : 'http';
  const portChunk = PATAVI_PORT ? `:${PATAVI_PORT}` : '';
  return `${protocol}://${PATAVI_HOST}${portChunk}/task?service=smaa_v2&ttl=PT5M`;
}
