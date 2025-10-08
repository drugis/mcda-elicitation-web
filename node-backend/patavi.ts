import {OurError} from '@shared/interface/IError';
import IWeights from '@shared/interface/IWeights';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {TPataviCommands} from '@shared/types/PataviCommands';
import {TPataviResults} from '@shared/types/PataviResults';
import Axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import _ from 'lodash';
import {MessageEvent, WebSocket} from 'ws';
import logger from './logger';
import https from 'https';
import fs from 'fs';

const {PATAVI_API_KEY, PATAVI_CA, PATAVI_CLIENT_KEY, PATAVI_CLIENT_CRT, SECURE_TRAFFIC} = process.env;
const pataviTaskUrl = getPataviTaskUrl();

// Configure HTTPS agent with client certificates if provided
let httpsAgent: https.Agent | undefined;
if (SECURE_TRAFFIC === 'true' && PATAVI_CA && PATAVI_CLIENT_KEY && PATAVI_CLIENT_CRT) {
  try {
    httpsAgent = new https.Agent({
      ca: fs.readFileSync(PATAVI_CA),
      cert: fs.readFileSync(PATAVI_CLIENT_CRT),
      key: fs.readFileSync(PATAVI_CLIENT_KEY),
      rejectUnauthorized: false,
      keepAlive: true,
      maxSockets: 50
    });
    logger.info('Patavi HTTPS agent configured with client certificates');
  } catch (error) {
    logger.error(`Failed to load Patavi certificates: ${error}`);
  }
}

export function postAndHandleResults(
  problem: TPataviCommands,
  callback: (error: OurError, result?: TPataviResults) => void
) {
  logger.debug(`Posting to Patavi with httpsAgent: ${!!httpsAgent}`);
  const requestOptions: AxiosRequestConfig = {
    url: pataviTaskUrl,
    headers: {
      'Content-Type': 'application/json',
      'X-api-key': PATAVI_API_KEY,
      'X-client-name': 'MCDA-open'
    },
    ...(httpsAgent && {httpsAgent})
  };
  logger.debug(`Request options: ${JSON.stringify({...requestOptions, httpsAgent: !!requestOptions.httpsAgent})}`);
  Axios.post(pataviTaskUrl, problem, requestOptions)
    .then((pataviResponse: AxiosResponse) => {
      logger.debug(`Patavi response status: ${pataviResponse.status}`);
      return handleUpdateResponse(pataviResponse, callback);
    })
    .then((updatesUrl) => {
      const options = {followRedirects: true};
      const client = new WebSocket(updatesUrl, ['ws'], options);
      client.on(
        'open',
        _.partial(successfullConnectionCallback, callback, client)
      );
      client.on('error', _.partial(failedConnectionCallback, callback));
      logger.debug('connecting to websocket at ' + updatesUrl);
    })
    .catch((error: AxiosError) => {
      logger.error(`Axios error details: ${JSON.stringify({
        message: error.message,
        code: error.code,
        response: error.response?.status,
        responseData: error.response?.data
      })}`);
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
    // Fix malformed URLs from patavi-server (https:undefined -> wss://patavi-server:3000)
    let updatesUrl = pataviResponse.data._links.updates.href;
    if (updatesUrl.includes('undefined')) {
      const {PATAVI_HOST, PATAVI_PORT} = process.env;
      const taskPath = updatesUrl.split('/task/')[1];
      updatesUrl = `wss://${PATAVI_HOST}:${PATAVI_PORT}/task/${taskPath}`;
      logger.info(`Fixed patavi URL from ${pataviResponse.data._links.updates.href} to ${updatesUrl}`);
    }
    return updatesUrl;
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
  client: WebSocket
) {
  client.on('message', (message: MessageEvent) => {
    handleMessage(client, message, callback);
  });
}

interface IPataviTask {
  eventType: string;
  eventData: {
    href: string;
  };
  taskId: string;
}
function handleMessage(
  client: WebSocket,
  message: MessageEvent,
  callback: (error: AxiosError, result?: IWeights | ISmaaResults) => void
) {
  const data: IPataviTask = JSON.parse(message.toString());
  if (data.eventType === 'done') {
    client.close();
    // Fix malformed URLs from patavi-server (https:undefined -> https://patavi-server:3000)
    let resultsUrl = data.eventData.href;
    if (resultsUrl.includes('undefined')) {
      const {PATAVI_HOST, PATAVI_PORT, SECURE_TRAFFIC} = process.env;
      const protocol = SECURE_TRAFFIC === 'true' ? 'https' : 'http';
      const taskPath = resultsUrl.split('/task/')[1];
      resultsUrl = `${protocol}://${PATAVI_HOST}:${PATAVI_PORT}/task/${taskPath}`;
      logger.info(`Fixed patavi results URL from ${data.eventData.href} to ${resultsUrl}`);
    }
    const getOptions = httpsAgent ? {httpsAgent} : {};
    Axios.get(resultsUrl, getOptions).then((resultsResponse: any) => {
      callback(null, resultsResponse.data);
    });
  } else if (data.eventType.startsWith('progres')) {
    // ignore progress messages
  } else {
    errorHandler(`Patavi returned event type: ${data.eventType}`, callback);
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
