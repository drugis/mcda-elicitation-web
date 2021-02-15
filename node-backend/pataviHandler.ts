import IWeights from '@shared/interface/IWeights';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IWeightsCommand} from '@shared/interface/Patavi/IWeightsCommand';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPataviCommands} from '@shared/types/PataviCommands';
import {TPataviResults} from '@shared/types/PataviResults';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED} from 'http-status-codes';
import _ from 'lodash';
import IDB from './interface/IDB';
import logger from './logger';
import createPataviTask, {postAndHandleResults} from './patavi';
import ScenarioRepository from './scenarioRepository';

export default function PataviHandler(db: IDB) {
  const scenarioRepository = ScenarioRepository(db);

  function postTask(
    request: Request<{}, {}, IPataviProblem>,
    response: Response,
    next: any
  ): void {
    createPataviTask(request.body, (error: Error, taskUri: string): void => {
      if (error) {
        logger.error(error);
        return next({
          message: error
        });
      } else {
        response.location(taskUri);
        response.status(CREATED);
        response.json({
          href: taskUri
        });
      }
    });
  }

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
    postTask,
    getWeights,
    getPataviResults
  };
}
