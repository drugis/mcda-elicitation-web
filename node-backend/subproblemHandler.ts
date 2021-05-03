import IDefaultIdsMessage from '@shared/interface/Commands/IDefaultIdsMessage';
import ISubproblemMessage from '@shared/interface/Commands/ISubproblemMessage';
import {OurError} from '@shared/interface/IError';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import IScenarioState from '@shared/interface/Scenario/IScenarioState';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED} from 'http-status-codes';
import _ from 'lodash';
import {PoolClient} from 'pg';
import IDB from './interface/IDB';
import logger from './logger';
import ScenarioRepository from './scenarioRepository';
import SubproblemRepository from './subproblemRepository';
import {handleError} from './util';
import WorkspaceRepository from './workspaceRepository';

export default function SubproblemHandler(db: IDB) {
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
    error: OurError,
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
      subproblemId,
      _.partial(defaultCallback, response, next)
    );
  }

  function create(
    request: Request<{workspaceId: string}, {}, ISubproblemCommand>,
    response: Response,
    next: any
  ): void {
    logger.debug('POST /workspaces/:workspaceId/problems');
    const {workspaceId} = request.params;
    db.runInTransaction(
      _.partial(subproblemTransaction, request),
      _.partialRight(createTransactionCallback, response, next, workspaceId)
    );
  }

  function createTransactionCallback(
    error: OurError,
    ids: IDefaultIdsMessage,
    response: Response,
    next: any,
    workspaceId: string
  ): void {
    if (error) {
      handleError(error, next);
    } else {
      retrieveSubProblem(
        workspaceId,
        ids.subproblemId,
        _.partialRight(
          retrieveSubProblemCallback,
          ids.scenarioId,
          response,
          next
        )
      );
    }
  }

  function retrieveSubProblemCallback(
    error: OurError,
    subproblem: IOldSubproblem,
    scenarioId: string,
    response: Response,
    next: any
  ): void {
    if (error) {
      handleError(error, next);
    } else {
      logger.debug('done creating subproblem : ' + JSON.stringify(subproblem));
      const message: ISubproblemMessage = {
        subproblem: subproblem,
        defaultScenarioId: scenarioId
      };
      response.status(CREATED);
      response.json(message);
    }
  }

  function subproblemTransaction(
    request: Request<{workspaceId: string}, {}, ISubproblemCommand>,
    client: PoolClient,
    transactionCallback: (error: OurError, ids?: IDefaultIdsMessage) => void
  ): void {
    waterfall(
      [
        _.partial(createSubProblem, client, request),
        _.partial(createScenario, client)
      ],
      (error: OurError, newSubproblemId?: string, newScenarioId?: string) => {
        transactionCallback(error, {
          subproblemId: newSubproblemId,
          scenarioId: newScenarioId
        });
      }
    );
  }

  function createSubProblem(
    client: PoolClient,
    request: Request<{workspaceId: string}, {}, ISubproblemCommand>,
    callback: (
      error: OurError,
      workspaceId?: string,
      newSubproblemId?: string
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
      (error: OurError, newSubproblemId: string) => {
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
    client: PoolClient,
    workspaceId: string,
    subproblemId: string,
    callback: (
      error: OurError,
      subproblemId?: string,
      scenarioId?: string
    ) => void
  ): void {
    logger.debug(
      'creating scenario; workspaceid: ' +
        workspaceId +
        ', subproblemId: ' +
        subproblemId
    );
    const state: IScenarioState = {
      problem: {criteria: {}},
      prefs: []
    };
    const scenario: IScenarioCommand = {
      title: 'Default',
      state: state,
      workspaceId: workspaceId,
      subproblemId: subproblemId
    };
    scenarioRepository.createInTransaction(
      client,
      scenario,
      (error, scenarioId?: string) => {
        if (error) {
          callback(error);
        } else {
          callback(null, subproblemId, scenarioId);
        }
      }
    );
  }

  function retrieveSubProblem(
    workspaceId: string,
    subproblemId: string,
    callback: (error: OurError, subproblem?: any) => void
  ): void {
    logger.debug('retrieving subproblem');
    subproblemRepository.get(
      workspaceId,
      subproblemId,
      (error: OurError, result: any) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result);
        }
      }
    );
  }

  function update(
    request: Request<
      {workspaceId: string; subproblemId: string},
      {},
      IOldSubproblem
    >,
    response: Response,
    next: any
  ): void {
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
    const {workspaceId, subproblemId} = request.params;
    logger.debug(
      'Deleting workspace/' + workspaceId + '/problem/' + subproblemId
    );
    db.runInTransaction(
      _.partial(deleteTransaction, workspaceId, subproblemId),
      (error: OurError, defaultIds?: IDefaultIdsMessage) => {
        if (error) {
          handleError(error, next);
        } else {
          logger.debug('Done deleting subproblem: ' + subproblemId);
          response.json(defaultIds);
        }
      }
    );
  }

  function deleteTransaction(
    workspaceId: string,
    subproblemId: string,
    client: PoolClient,
    transactionCallback: (
      error: OurError,
      defaultIds?: IDefaultIdsMessage
    ) => void
  ): void {
    waterfall(
      [
        _.partial(getSubproblemIds, workspaceId),
        getDefaultSubproblem,
        _.partial(setDefaultSubproblem, client, subproblemId),
        _.partial(deleteSubproblemAction, client, subproblemId),
        _.partial(getDefaultIds, client, workspaceId)
      ],
      transactionCallback
    );
  }

  function getSubproblemIds(
    workspaceId: string,
    callback: (
      error: OurError,
      workspaceId?: string,
      subproblemIds?: string[]
    ) => void
  ): void {
    subproblemRepository.getSubproblemIds(
      workspaceId,
      (error: OurError, result: string[]) => {
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
      error: OurError,
      workspaceId?: string,
      subproblemIds?: string[],
      defaultSubproblem?: string
    ) => void
  ): void {
    workspaceRepository.getDefaultSubproblem(
      workspaceId,
      (error: OurError, result: string) => {
        if (error) {
          callback(error);
        } else {
          callback(null, workspaceId, subproblemIds, result);
        }
      }
    );
  }

  function setDefaultSubproblem(
    client: PoolClient,
    subproblemId: string,
    workspaceId: string,
    subproblemIds: string[],
    defaultId: string,
    callback: (error: OurError) => void
  ): void {
    if (subproblemId === defaultId) {
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
    client: PoolClient,
    subproblemId: string,
    workspaceId: string,
    subproblemIds: string[],
    callback: (error: OurError, defaultId?: string) => void
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
    subproblemId: string,
    subproblemIds: string[]
  ): string {
    return _.find(subproblemIds, (id: string) => {
      return id !== subproblemId;
    });
  }

  function determineAndSetNewDefaultScenario(
    client: PoolClient,
    subproblemId: string,
    workspaceId: string,
    callback: (error: OurError, defaultId?: string) => void
  ): void {
    scenarioRepository.getScenarioIdsForSubproblem(
      subproblemId,
      (error: OurError, result: string[]) => {
        if (error) {
          callback(error);
        } else {
          const newDefaultScenario = result[0];
          setDefaultScenario(client, workspaceId, newDefaultScenario, callback);
        }
      }
    );
  }

  function setDefaultScenario(
    client: PoolClient,
    workspaceId: string,
    newDefaultScenario: string,
    callback: (error: OurError) => void
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
    client: PoolClient,
    subproblemId: string,
    callback: (error: OurError) => void
  ): void {
    subproblemRepository.delete(client, subproblemId, (error: OurError) => {
      callback(error);
    });
  }

  function getDefaultIds(
    client: PoolClient,
    workspaceId: string,
    callback: (error: OurError, defaultIds?: IDefaultIdsMessage) => void
  ) {
    workspaceRepository.getDefaultIds(client, workspaceId, callback);
  }

  return {
    query,
    get,
    create,
    update,
    delete: deleteSubproblem
  };
}
