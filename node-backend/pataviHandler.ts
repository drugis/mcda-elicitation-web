import IWeights from '@shared/interface/IWeights';
import IScenario from '@shared/interface/Scenario/IScenario';
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
  function postTask(request: Request, response: Response, next: any): void {
    // FIXME: separate routes for scales and results
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

  function getWeights(request: Request, response: Response, next: any) {
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
    scenario: IScenario,
    weights: IWeights,
    callback: (error: Error, weights?: IWeights) => void
  ) {
    scenarioRepository.update(
      {...scenario.state, weights: weights},
      scenario.title,
      scenario.id,
      (error: Error) => {
        callback(error, weights);
      }
    );
  }

  return {postTask, getWeights};
}
