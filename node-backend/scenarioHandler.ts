'use strict';
import {Error} from '@shared/interface/IError';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import _ from 'lodash';
import logger from './logger';
import {handleError} from './util';
import WorkspaceRepository from './workspaceRepository';
import ScenarioRepository from './scenarioRepository';

export default function ScenarioHandler(db: any) {
  const scenarioRepository = ScenarioRepository(db);
  const workspaceRepository = WorkspaceRepository(db);

  function query(request: Request, response: Response, next: any) {
    scenarioRepository.query(
      request.params.workspaceId,
      _.partial(defaultCallback, response, next)
    );
  }

  function queryForSubProblem(request: Request, response: Response, next: any) {
    scenarioRepository.queryForSubProblem(
      request.params.workspaceId,
      request.params.subProblemId,
      _.partial(defaultCallback, response, next)
    );
  }

  function get(request: Request, response: Response, next: any) {
    scenarioRepository.get(
      request.params.id,
      _.partial(defaultCallback, response, next)
    );
  }

  function defaultCallback(
    response: Response,
    next: any,
    error: Error,
    result: any
  ) {
    if (error) {
      next(error);
    } else {
      response.json(result);
    }
  }

  function create(request: Request, response: Response, next: any) {
    scenarioRepository.createDirectly(
      request.params.workspaceId,
      request.params.subProblemId,
      request.body.title,
      {
        problem: request.body.state.problem,
        prefs: request.body.state.prefs
      },
      function (error: Error, id?: string) {
        if (error) {
          next(error);
        } else {
          response.status(CREATED);
          response.json({id: id});
        }
      }
    );
  }

  function update(request: Request, response: Response, next: any) {
    scenarioRepository.update(
      request.body.state,
      request.body.title,
      request.body.id,
      (error: Error) => {
        if (error) {
          next(error);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function deleteScenario(request: Request, response: Response, next: any) {
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
      (error: Error) => {
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
    client: any,
    transactionCallback: (error: Error) => void
  ) {
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
      error: Error,
      defaultScenarioId?: string,
      scenarioIds?: string[]
    ) => void
  ): void {
    if (scenarioIds.length === 1) {
      callback({message: 'Cannot delete the only scenario for subproblem'});
    } else {
      workspaceRepository.getDefaultScenarioId(
        workspaceId,
        (error: Error, defaultScenarioId: string) => {
          callback(error, defaultScenarioId, scenarioIds);
        }
      );
    }
  }

  function setDefaultScenario(
    client: any,
    workspaceId: string,
    scenarioId: string,
    defaultScenarioId: string,
    scenarioIds: string[],
    callback: (error?: Error) => void
  ): void {
    if (defaultScenarioId === scenarioId) {
      const newDefaultScenario = getNewDefaultScenario(scenarioIds, scenarioId);
      workspaceRepository.setDefaultScenario(
        client,
        workspaceId,
        newDefaultScenario,
        (error) => {
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
    return _.reject(scenarioIds, (id: string) => {
      return id === currentDefaultScenarioId;
    })[0];
  }

  return {
    query: query,
    queryForSubProblem: queryForSubProblem,
    get: get,
    create: create,
    update: update,
    delete: deleteScenario
  };
}
