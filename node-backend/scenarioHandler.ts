import {OurError} from '@shared/interface/IError';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import _ from 'lodash';
import {PoolClient} from 'pg';
import IDB from './interface/IDB';
import logger from './logger';
import ScenarioRepository from './scenarioRepository';
import {handleError} from './util';
import WorkspaceRepository from './workspaceRepository';

export default function ScenarioHandler(db: IDB) {
  const scenarioRepository = ScenarioRepository(db);
  const workspaceRepository = WorkspaceRepository(db);

  function query(request: Request, response: Response, next: any): void {
    scenarioRepository.query(
      request.params.workspaceId,
      _.partial(defaultCallback, response, next)
    );
  }

  function queryForSubProblem(
    request: Request,
    response: Response,
    next: any
  ): void {
    const {workspaceId, subproblemId} = request.params;
    scenarioRepository.queryForSubProblem(
      workspaceId,
      subproblemId,
      _.partial(defaultCallback, response, next)
    );
  }

  function get(request: Request, response: Response, next: any): void {
    scenarioRepository.get(
      request.params.id,
      _.partial(defaultCallback, response, next)
    );
  }

  function defaultCallback(
    response: Response,
    next: any,
    error: OurError,
    result: any
  ): void {
    if (error) {
      next(error);
    } else {
      response.json(result);
    }
  }

  function create(request: Request, response: Response, next: any): void {
    const scenario: IScenarioCommand = {
      workspaceId: request.params.workspaceId,
      subproblemId: request.params.subproblemId,
      title: request.body.title,
      state: request.body.state
    };
    scenarioRepository.createDirectly(
      scenario,
      (error: OurError, id?: string): void => {
        if (error) {
          next(error);
        } else {
          response.status(CREATED);
          response.json({id: id});
        }
      }
    );
  }

  function update(request: Request, response: Response, next: any): void {
    scenarioRepository.update(
      request.body.state,
      request.body.title,
      request.body.id,
      (error: OurError): void => {
        if (error) {
          next(error);
        } else {
          response.json(request.body);
        }
      }
    );
  }

  function deleteScenario(
    request: Request,
    response: Response,
    next: any
  ): void {
    const {subproblemId, id: scenarioId, workspaceId} = request.params;
    logger.debug(
      'Deleting workspace/' +
        workspaceId +
        '/problem/' +
        subproblemId +
        '/scenario/' +
        scenarioId
    );
    db.runInTransaction(
      _.partial(deleteTransaction, workspaceId, subproblemId, scenarioId),
      (error: OurError): void => {
        if (error) {
          handleError(error, next);
        } else {
          logger.debug('Deleted scenario: ' + scenarioId);
          response.sendStatus(OK);
        }
      }
    );
  }

  function deleteTransaction(
    workspaceId: string,
    subproblemId: string,
    scenarioId: string,
    client: PoolClient,
    transactionCallback: (error: OurError) => void
  ): void {
    waterfall(
      [
        _.partial(scenarioRepository.getScenarioIdsForSubproblem, subproblemId),
        _.partial(getDefaultScenario, workspaceId),
        _.partial(setDefaultScenario, client, workspaceId, scenarioId),
        _.partial(scenarioRepository.delete, client, scenarioId)
      ],
      transactionCallback
    );
  }

  function getDefaultScenario(
    workspaceId: string,
    scenarioIds: string[],
    callback: (
      error: OurError,
      defaultScenarioId?: string,
      scenarioIds?: string[]
    ) => void
  ): void {
    if (scenarioIds.length === 1) {
      callback({message: 'Cannot delete the only scenario for subproblem'});
    } else {
      workspaceRepository.getDefaultScenarioId(
        workspaceId,
        (error: OurError, defaultScenarioId: string): void => {
          callback(error, defaultScenarioId, scenarioIds);
        }
      );
    }
  }

  function setDefaultScenario(
    client: PoolClient,
    workspaceId: string,
    scenarioId: string,
    defaultScenarioId: string,
    scenarioIds: string[],
    callback: (error?: OurError) => void
  ): void {
    if (defaultScenarioId === scenarioId) {
      const newDefaultScenario = getNewDefaultScenario(scenarioIds, scenarioId);
      workspaceRepository.setDefaultScenario(
        client,
        workspaceId,
        newDefaultScenario,
        (error): void => {
          // discarding extra result arguments to make waterfall cleaner
          callback(error);
        }
      );
    } else {
      callback();
    }
  }

  function getNewDefaultScenario(
    scenarioIds: string[],
    currentDefaultScenarioId: string
  ): string {
    return _.reject(scenarioIds, (id: string): boolean => {
      return id === currentDefaultScenarioId;
    })[0];
  }

  return {
    query,
    queryForSubProblem,
    get,
    create,
    update,
    delete: deleteScenario
  };
}
