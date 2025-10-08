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
const {PATAVI_API_KEY, PLUMBER_DUMP_DIR, PLUMBER_DUMP_IO} = process.env;

logger.info(`Plumber API URL: ${PLUMBER_API_URL}`);

export function postAndHandleResults(
  problem: TPataviCommands,
  callback: (error: OurError, result?: TPataviResults) => void
) {
  logger.debug(`Posting to Plumber API: ${PLUMBER_API_URL}/smaa`);
  dumpPlumberIo('request', problem);
  
  // Make direct HTTP POST to Plumber API
  Axios.post(`${PLUMBER_API_URL}/smaa`, problem, {
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
      const normalizedResults = normalizeResults(problem, results);
      const sanitizedResults = deepNormalizeNumericFields(normalizedResults) as TPataviResults;
      dumpPlumberIo('response', sanitizedResults);
      
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

export function normalizeResults(
  problem: TPataviCommands,
  results: TPataviResults
): TPataviResults {
  if (!results || typeof results !== 'object') {
    return results;
  }

  if ((problem as ISmaaResultsCommand)?.method !== 'smaa') {
    return results;
  }

  const smaaCommand = problem as ISmaaResultsCommand;
  const smaaResults = results as ISmaaResults;

  if (!smaaResults.weightsQuantiles) {
    return results;
  }

  const criteriaIds = Object.keys(smaaCommand.criteria || {});
  const normalizeEntry = (
    entry: Record<string, number> | Array<number | string> | undefined,
    fallbackSource?: Record<string, number>
  ): Record<string, number> => {
    const normalized: Record<string, number> = {};
    const asArray = Array.isArray(entry) ? entry : undefined;
    const asRecord = !Array.isArray(entry) ? entry : undefined;

    criteriaIds.forEach((criterionId, index) => {
      let value: number | string | undefined = undefined;

      if (asRecord && Object.prototype.hasOwnProperty.call(asRecord, criterionId)) {
        value = asRecord[criterionId];
      } else if (asArray) {
        value = asArray[index];
      }

      const numericValue = coerceNumeric(value);
      if (numericValue !== undefined) {
        normalized[criterionId] = numericValue;
      } else {
        const primaryFallback = fallbackSource?.[criterionId];
        const secondaryFallback = smaaCommand.weights?.mean?.[criterionId];
        const fallback = primaryFallback ?? secondaryFallback ?? 0;
        normalized[criterionId] = coerceNumeric(fallback) ?? 0;
      }
    });

    return normalized;
  };

  const quantiles = smaaResults.weightsQuantiles;
  const meanSource = (quantiles as any).mean || (quantiles as any)['50%'];

  const normalizedQuantiles: IWeights = {
    '2.5%': normalizeEntry(quantiles['2.5%'], smaaCommand.weights?.['2.5%']),
    mean: normalizeEntry(meanSource, smaaCommand.weights?.mean),
    '97.5%': normalizeEntry(quantiles['97.5%'], smaaCommand.weights?.['97.5%'])
  };

  const normalizeCentralWeights = (
    centralWeights: Record<string, any> | undefined
  ): Record<string, ICentralWeight> | undefined => {
    if (!centralWeights || typeof centralWeights !== 'object') {
      return undefined;
    }

    const normalized: Record<string, ICentralWeight> = {};

    Object.entries(centralWeights).forEach(([alternativeId, values]) => {
      if (!values || typeof values !== 'object') {
        return;
      }

      const cfSource = Array.isArray(values.cf) ? values.cf[0] : values.cf;
      const cf = coerceNumeric(cfSource) ?? 0;

      const weightSource = values.w;
      const normalizedWeights: Record<string, number> = {};

      criteriaIds.forEach((criterionId, index) => {
        let value: number | string | undefined = undefined;

        if (weightSource && typeof weightSource === 'object') {
          if (Array.isArray(weightSource)) {
            value = weightSource[index];
          } else if (Object.prototype.hasOwnProperty.call(weightSource, criterionId)) {
            value = weightSource[criterionId];
          }
        }

        const numericValue = coerceNumeric(value);
        normalizedWeights[criterionId] = numericValue ?? 0;
      });

      normalized[alternativeId] = {
        cf,
        w: normalizedWeights
      };
    });

    return normalized;
  };

  const normalizedCentralWeights = normalizeCentralWeights(smaaResults.cw);

  return {
    ...smaaResults,
    weightsQuantiles: normalizedQuantiles,
    cw: normalizedCentralWeights ?? smaaResults.cw
  } as TPataviResults;
}

export function coerceNumeric(value: number | string | undefined): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function deepNormalizeNumericFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepNormalizeNumericFields(item)) as unknown as T;
  }

  if (value && typeof value === 'object') {
    const normalized: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      normalized[key] = deepNormalizeNumericFields(entry);
    }
    return normalized as unknown as T;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();
    if (lower === 'na' || lower === 'nan') {
      return 0 as unknown as T;
    }

    const numeric = coerceNumeric(trimmed);
    if (numeric !== undefined) {
      return numeric as unknown as T;
    }

    return value;
  }

  if (typeof value === 'number') {
    const numeric = coerceNumeric(value);
    if (numeric !== undefined) {
      return numeric as unknown as T;
    }
  }

  return value;
}

type TDumpKind = 'request' | 'response';

function dumpPlumberIo(kind: TDumpKind, payload: unknown): void {
  if (PLUMBER_DUMP_IO !== 'true') {
    return;
  }

  const directory = PLUMBER_DUMP_DIR || '/tmp/plumber-dumps';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(directory, `${timestamp}-${kind}.json`);

  fsPromises
    .mkdir(directory, {recursive: true})
    .then(() =>
      fsPromises.writeFile(
        filePath,
        JSON.stringify({timestamp: new Date().toISOString(), kind, payload}, null, 2),
        'utf-8'
      )
    )
    .catch((error: Error) => {
      logger.warn(`Failed to dump Plumber ${kind} payload to ${filePath}: ${error.message}`);
    });
}
