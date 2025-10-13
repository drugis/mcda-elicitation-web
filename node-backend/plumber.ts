// Plumber API integration - simpler replacement for Patavi
import {OurError} from '@shared/interface/IError';
import IWeights from '@shared/interface/IWeights';
import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';
import {ISmaaResultsCommand} from '@shared/interface/Patavi/ISmaaResultsCommand';
import {TPataviCommands} from '@shared/types/PataviCommands';
import {TPataviResults} from '@shared/types/PataviResults';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import {promises as fsPromises} from 'fs';
import path from 'path';
import logger from './logger';

const PLUMBER_API_URL = process.env.PLUMBER_API_URL || 'http://plumber-api:8000';
const {PATAVI_API_KEY} = process.env;

logger.info(`Plumber API URL: ${PLUMBER_API_URL}`);

export function postAndHandleResults(
  problem: TPataviCommands,
  callback: (error: OurError, result?: TPataviResults) => void
) {
  logger.debug(`Posting to Plumber API: ${PLUMBER_API_URL}/smaa_v2`);
  
  // Make direct HTTP POST to Plumber API (canonical endpoint)
  Axios.post(`${PLUMBER_API_URL}/smaa_v2`, problem, {
    headers: {
      'Content-Type': 'application/json',
      'X-api-key': PATAVI_API_KEY || '',
    },
    timeout: 120000, // 2 minute timeout for long calculations
  })
    .then((response: AxiosResponse) => {
      logger.debug(`Plumber response status: ${response.status}`);
      
      // Plumber returns results directly in response.data.results
      // or just response.data depending on endpoint
      const results = (response.data.results || response.data) as TPataviResults;
      const sanitizedResults = results;
      
      if (response.data.metadata) {
        logger.info(`Calculation completed in ${response.data.metadata.execution_time_seconds}s`);
      }
      
      callback(null, sanitizedResults);
    })
    .catch((error: AxiosError) => {
      logger.error(`Plumber API error: ${error.message}`);
      if (error.response) {
        logger.error(`Response status: ${error.response.status}`);
        logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      errorHandler(error.message, callback);
    });
}

function errorHandler(
  message: string | number,
  callback: (error: any) => void
) {
  logger.error(`Plumber API responded with: ${message}`);
  callback(message);
}

// No need for getPataviTaskUrl with Plumber - it's just a direct URL
export function getPlumberApiUrl(): string {
  return PLUMBER_API_URL;
}


