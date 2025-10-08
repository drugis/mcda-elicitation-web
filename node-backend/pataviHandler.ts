import IWeights from '@shared/interface/IWeights';
import {IWeightsCommand} from '@shared/interface/Patavi/IWeightsCommand';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPataviCommands} from '@shared/types/PataviCommands';
import {TPataviResults} from '@shared/types/PataviResults';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import _ from 'lodash';
import IDB from './interface/IDB';
import logger from './logger';
import {postAndHandleResults as pataviPostAndHandleResults} from './patavi';
import {postAndHandleResults as plumberPostAndHandleResults} from './plumber';
import ScenarioRepository from './scenarioRepository';

// Choose which backend to use based on environment variable
const USE_PLUMBER = process.env.USE_PLUMBER === 'true';
const postAndHandleResults = USE_PLUMBER ? plumberPostAndHandleResults : pataviPostAndHandleResults;

if (USE_PLUMBER) {
  logger.info('Using Plumber API for SMAA calculations');
} else {
  logger.info('Using Patavi for SMAA calculations');
}

export default function PataviHandler(db: IDB) {
  const scenarioRepository = ScenarioRepository(db);

  function getWeights(
    request: Request<{}, {}, IWeightsCommand>,
    response: Response,
    next: any
  ): void {
    const problem = request.body.problem;
    const scenario = request.body.scenario;
    waterfall(
      [
        _.partial(postAndHandleResults, problem),
        _.partial(saveScenario, scenario)
      ],
      (error: Error, weights: IWeights) => {
        if (error) {
          logger.error(error);
          return next({
            message: error
          });
        } else {
          response.json(weights);
        }
      }
    );
  }

  function saveScenario(
    scenario: IMcdaScenario,
    weights: IWeights,
    callback: (error: Error, weights?: IWeights) => void
  ): void {
    scenarioRepository.update(
      {...scenario.state, weights: weights},
      scenario.title,
      scenario.id,
      (error: Error) => {
        callback(error, weights);
      }
    );
  }

  function getPataviResults(
    request: Request<{}, {}, TPataviCommands>,
    response: Response,
    next: any
  ): void {
    const method = (request.body as any)?.method ?? (request.body as any)?.problem?.method ?? 'unknown';
    logger.debug(`Received Patavi results request for method: ${method}`);

    postAndHandleResults(
      request.body,
      (error: Error, results: TPataviResults) => {
        if (error) {
          logger.error(error);
          return next({
            message: error
          });
        } else {
          response.json(results);
        }
      }
    );
  }

  return {
    getWeights,
    getPataviResults
  };
}
