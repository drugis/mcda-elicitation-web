'use strict';

import {Error} from '@shared/interface/IError';
import IProblem from '@shared/interface/Problem/IProblem';
import fs from 'fs';
import {IncomingMessage} from 'http';
import httpStatus from 'http-status-codes';
import https from 'https';
import _ from 'lodash';
import logger from './logger';

let httpsOptions = {
  hostname: process.env.PATAVI_HOST,
  port: process.env.PATAVI_PORT,
  key: fs.readFileSync(process.env.PATAVI_CLIENT_KEY),
  cert: fs.readFileSync(process.env.PATAVI_CLIENT_CRT),
  ca: undefined as Buffer
};

try {
  httpsOptions.ca = fs.readFileSync(process.env.PATAVI_CA);
} catch (error) {
  logger.debug(
    'Certificate autority file not found at: ' + process.env.PATAVI_CA
  );
}

export default function createPataviTask(
  problem: IProblem,
  callback: (error: Error, location?: string) => void
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
