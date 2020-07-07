'use strict';
import logger from './loggerTS';
import {Error} from '@shared/interface/IError';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import _ from 'lodash';
import ScenarioRepository from './scenarioRepository';
import SubproblemRepository from './subproblemRepository';
import {handleError} from './util';
import WorkspaceRepository from './workspaceRepository';

export default function SubproblemHandler(db: any) {
  const subproblemRepository = SubproblemRepository(db);
  const scenarioRepository = ScenarioRepository(db);
  const workspaceRepository = WorkspaceRepository(db);

  function query(request: Request, response: Response, next: any): void {
    subproblemRepository.query(
      request.params.workspaceId,
      _.partial(defaultCallback, response, next)
    );
  }

  function defaultCallback(
    response: Response,
    next: any,
    error: Error,
    result: any
  ): void {
    if (error) {
      handleError(error, next);
    } else {
      response.json(result);
    }
  }

  function get(request: Request, response: Response, next: any): void {
    const {workspaceId, subproblemId} = request.params;
    logger.debug('GET /workspaces/:id/problems/:subproblemId');
    subproblemRepository.get(
      workspaceId,
      Number.parseInt(subproblemId),
      _.partial(defaultCallback, response, next)
    );
  }

  function create(request: Request, response: Response, next: any): void {
    logger.debug('POST /workspaces/:workspaceId/problems');
    const {workspaceId} = request.params;
    db.runInTransaction(
      _.partial(subproblemTransaction, request),
      _.partial(createTransactionCallback, response, next, workspaceId)
    );
  }

  function createTransactionCallback(
    response: Response,
    next: any,
    workspaceId: string,
    error: Error,
    subproblemId: number
  ): void {
    if (error) {
      handleError(error, next);
    } else {
      retrieveSubProblem(
        workspaceId,
        subproblemId,
        _.partial(retrieveSubProblemCallback, response, next)
      );
    }
  }

  function retrieveSubProblemCallback(
    response: Response,
    next: any,
    error: Error,
    subproblem: any
  ): void {
    if (error) {
      handleError(error, next);
    } else {
      logger.debug('done creating subproblem : ' + JSON.stringify(subproblem));
      response.status(CREATED);
      response.json(subproblem);
    }
  }

  function subproblemTransaction(
    request: Request,
    client: any,
    transactionCallback: (error: Error, newSubproblemId?: number) => void
  ): void {
    waterfall(
      [
        _.partial(createSubProblem, client, request),
        _.partial(createScenario, client, request)
      ],
      (error: Error, newSubproblemId?: number) => {
        transactionCallback(error, newSubproblemId);
      }
    );
  }

  function createSubProblem(
    client: any,
    request: Request,
    callback: (
      error: Error,
      workspaceId?: string,
      newSubproblemId?: number
    ) => void
  ): void {
    logger.debug('creating subproblem');
    const {workspaceId} = request.params;
    const {title, definition} = request.body;
    subproblemRepository.create(
      client,
      workspaceId,
      title,
      definition,
      (error: Error, newSubproblemId: number) => {
        if (error) {
          callback(error);
        } else {
          logger.debug('done creating subproblem');
          callback(null, workspaceId, newSubproblemId);
        }
      }
    );
  }

  function createScenario(
    client: any,
    request: Request,
    workspaceId: string,
    subproblemId: number,
    callback: (error: Error, subproblemId?: number) => void
  ): void {
    logger.debug(
      'creating scenario; workspaceid: ' +
        workspaceId +
        ', subproblemId: ' +
        subproblemId
    );
    const state = request.body.scenarioState;
    scenarioRepository.createInTransaction(
      client,
      workspaceId,
      subproblemId,
      'Default',
      state,
      (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null, subproblemId);
        }
      }
    );
  }

  function retrieveSubProblem(
    workspaceId: string,
    subproblemId: number,
    callback: (error: Error, subproblem?: any) => void
  ): void {
    logger.debug('retrieving subproblem');
    subproblemRepository.get(
      workspaceId,
      subproblemId,
      (error: Error, result: any) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }
      }
    );
  }

  function update(request: Request, response: Response, next: any): void {
    const {workspaceId, subproblemId} = request.params;
    const {definition, title} = request.body;
    logger.debug(
      'Updating workspace/' + workspaceId + '/problem/' + subproblemId
    );
    subproblemRepository.update(
      definition,
      title,
      subproblemId,
      _.partial(defaultCallback, response, next)
    );
  }

  function deleteSubproblem(
    request: Request,
    response: Response,
    next: any
  ): void {
    const {workspaceId, subproblemIdString} = request.params;
    const subproblemId = Number.parseInt(subproblemIdString);
    logger.debug(
      'Deleting workspace/' + workspaceId + '/problem/' + subproblemId
    );
    db.runInTransaction(
      _.partial(deleteTransaction, workspaceId, subproblemId),
      (error: Error) => {
        if (error) {
          handleError(error, next);
        } else {
          logger.debug('Done deleting subproblem: ' + subproblemId);
          response.sendStatus(OK);
        }
      }
    );
  }

  function deleteTransaction(
    workspaceId: string,
    subproblemId: number,
    client: any,
    transactionCallback: (error: Error) => void
  ): void {
    waterfall(
      [
        _.partial(getSubproblemIds, workspaceId),
        getDefaultSubproblem,
        _.partial(setDefaultSubproblem, client, subproblemId),
        _.partial(deleteSubproblemAction, client, subproblemId)
      ],
      transactionCallback
    );
  }

  function getSubproblemIds(
    workspaceId: string,
    callback: (
      error: Error,
      workspaceId?: string,
      subproblemIds?: string[]
    ) => void
  ): void {
    subproblemRepository.getSubproblemIds(
      workspaceId,
      (error: Error, result: string[]) => {
        if (error) {
          callback(error);
        } else if (result.length === 1) {
          callback({
            message: 'Cannot delete the only subproblem for workspace'
          });
        } else {
          callback(null, workspaceId, result);
        }
      }
    );
  }

  function getDefaultSubproblem(
    workspaceId: string,
    subproblemIds: string[],
    callback: (
      error: Error,
      workspaceId?: string,
      subproblemIds?: string[],
      defaultSubproblem?: string
    ) => void
  ): void {
    workspaceRepository.getDefaultSubproblem(
      workspaceId,
      (error: Error, result: string) => {
        if (error) {
          callback(error);
        } else {
          callback(null, workspaceId, subproblemIds, result);
        }
      }
    );
  }

  function setDefaultSubproblem(
    client: any,
    subproblemId: number,
    workspaceId: string,
    subproblemIds: number[],
    defaultId: number,
    callback: (error: Error) => void
  ): void {
    if (subproblemId + '' === defaultId + '') {
      setNewDefaultSubproblem(
        client,
        subproblemId,
        workspaceId,
        subproblemIds,
        callback
      );
    } else {
      callback(null);
    }
  }

  function setNewDefaultSubproblem(
    client: any,
    subproblemId: number,
    workspaceId: string,
    subproblemIds: number[],
    callback: (error: Error) => void
  ): void {
    const newDefault = getNewDefaultSubproblemId(subproblemId, subproblemIds);
    workspaceRepository.setDefaultSubProblem(
      client,
      workspaceId,
      newDefault,
      function (error) {
        if (error) {
          callback(error);
        } else {
          determineAndSetNewDefaultScenario(
            client,
            newDefault,
            workspaceId,
            callback
          );
        }
      }
    );
  }

  function getNewDefaultSubproblemId(
    subproblemId: number,
    subproblemIds: number[]
  ): number {
    return _.find(subproblemIds, (id: number) => {
      return id !== subproblemId;
    });
  }

  function determineAndSetNewDefaultScenario(
    client: any,
    subproblemId: number,
    workspaceId: string,
    callback: (error: Error) => void
  ): void {
    scenarioRepository.getScenarioIdsForSubproblem(subproblemId, function (
      error,
      result
    ) {
      if (error) {
        callback(error);
      } else {
        const newDefaultScenario = result[0];
        setDefaultScenario(client, workspaceId, newDefaultScenario, callback);
      }
    });
  }

  function setDefaultScenario(
    client: any,
    workspaceId: string,
    newDefaultScenario: number,
    callback: (error: Error) => void
  ): void {
    workspaceRepository.setDefaultScenario(
      client,
      workspaceId,
      newDefaultScenario,
      (error) => {
        callback(error);
      }
    );
  }

  function deleteSubproblemAction(
    client: any,
    subproblemId: number,
    callback: (error: Error) => void
  ): void {
    subproblemRepository.delete(client, subproblemId, (error: Error) => {
      callback(error);
    });
  }

  return {
    query: query,
    get: get,
    create: create,
    update: update,
    delete: deleteSubproblem
  };
}
