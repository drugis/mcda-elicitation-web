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
import IDB from './interface/IDB';
import {PoolClient} from 'pg';

export default function ScenarioHandler(db: IDB) {
  const scenarioRepository = ScenarioRepository(db);
  const workspaceRepository = WorkspaceRepository(db);

  function query(request: Request, response: Response, next: any) {
    scenarioRepository.query(
      request.params.workspaceId,
      _.partial(defaultCallback, response, next)
    );
  }

  function queryForSubProblem(request: Request, response: Response, next: any) {
    const {workspaceId, subproblemId} = request.params;
    scenarioRepository.queryForSubProblem(
      workspaceId,
      Number.parseInt(subproblemId),
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
      Number.parseInt(request.params.subproblemId),
      request.body.title,
      {
        problem: request.body.state.problem,
        prefs: request.body.state.prefs
      },
      (error: Error, id?: number) => {
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
          response.json(request.body);
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
      _.partial(
        deleteTransaction,
        workspaceId,
        Number.parseInt(subproblemId),
        Number.parseInt(scenarioId)
      ),
      (error: Error): void => {
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
    subproblemId: number,
    scenarioId: number,
    client: PoolClient,
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
    client: PoolClient,
    workspaceId: string,
    scenarioId: number,
    defaultScenarioId: number,
    scenarioIds: number[],
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
    scenarioIds: number[],
    currentDefaultScenarioId: number
  ): number {
    return _.reject(scenarioIds, (id: number) => {
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
