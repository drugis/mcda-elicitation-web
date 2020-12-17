'use strict';
import {OurError} from '@shared/interface/IError';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import httpStatus from 'http-status-codes';
import _ from 'lodash';
import {PoolClient} from 'pg';
import IDB from './interface/IDB';
import logger from './logger';
import ScenarioRepository from './scenarioRepository';
import SubproblemRepository from './subproblemRepository';
import {getRanges, getUser, handleError, reduceProblem} from './util';
import WorkspaceRepository from './workspaceRepository';

export default function WorkspaceHandler(db: IDB) {
  const workspaceRepository = WorkspaceRepository(db);
  const subproblemRepository = SubproblemRepository(db);
  const scenarioRepository = ScenarioRepository(db);

  function query(request: Request, response: Response, next: any): void {
    workspaceRepository.query(
      getUser(request).id,
      (error: OurError, result: IOldWorkspace[]): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function create(request: Request, response: Response, next: any): void {
    db.runInTransaction(
      _.partial(createWorkspaceTransaction, request),
      (error: OurError, workspaceInfo: IWorkspaceInfo): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.status(httpStatus.CREATED);
          response.json(workspaceInfo);
        }
      }
    );
  }

  function createWorkspaceTransaction(
    request: Request,
    client: PoolClient,
    transactionCallback: (
      error: OurError,
      workspaceInfo: IWorkspaceInfo
    ) => void
  ): void {
    waterfall(
      [
        _.partial(createNewWorkspace, client, request),
        _.partial(createSubProblem, client, request),
        _.partial(setDefaultSubProblem, client),
        _.partial(createScenario, client, request),
        _.partial(setDefaultScenario, client),
        _.partial(workspaceRepository.getWorkspaceInfo, client)
      ],
      transactionCallback
    );
  }

  function createNewWorkspace(
    client: PoolClient,
    request: Request,
    callback: (error: OurError, id: string) => void
  ): void {
    logger.debug('creating new workspace');

    const owner = getUser(request).id;
    const title = request.body.title;
    const problem = request.body.problem;
    workspaceRepository.create(client, owner, title, problem, callback);
  }

  function createSubProblem(
    client: PoolClient,
    request: Request<{}, {}, {problem: IProblem}>,
    workspaceId: string,
    callback: (
      error: OurError,
      workspaceId?: string,
      subproblemId?: string
    ) => void
  ): void {
    logger.debug('creating subproblem');
    const definition = {
      ranges: getRanges(request.body.problem) //FIXME don't allow ranges on uploads
    };
    subproblemRepository.create(
      client,
      workspaceId,
      'Default',
      definition,
      (error: OurError, subproblemId: string): void => {
        if (error) {
          callback(error);
        } else {
          callback(null, workspaceId, subproblemId);
        }
      }
    );
  }

  function setDefaultSubProblem(
    client: PoolClient,
    workspaceId: string,
    subproblemId: string,
    callback: (
      error: OurError,
      workspaceId?: string,
      subproblemId?: string
    ) => void
  ): void {
    logger.debug('setting default subproblem');
    workspaceRepository.setDefaultSubProblem(
      client,
      workspaceId,
      subproblemId,
      (error: OurError): void => {
        if (error) {
          callback(error);
        } else {
          callback(null, workspaceId, subproblemId);
        }
      }
    );
  }

  function createScenario(
    client: PoolClient,
    request: Request,
    workspaceId: string,
    subproblemId: string,
    callback: (
      error: OurError,
      workspaceId?: string,
      scenarioId?: number
    ) => void
  ): void {
    logger.debug('creating scenario');
    const scenario: IScenarioCommand = {
      title: 'Default',
      subproblemId: subproblemId,
      workspaceId: workspaceId,
      state: {
        problem: reduceProblem(request.body.problem),
        prefs: []
      }
    };
    scenarioRepository.createInTransaction(
      client,
      scenario,
      (error: OurError, scenarioId: number): void => {
        if (error) {
          callback(error);
        } else {
          callback(null, workspaceId, scenarioId);
        }
      }
    );
  }

  function setDefaultScenario(
    client: PoolClient,
    workspaceId: string,
    scenarioId: string,
    callback: (error: OurError, workspaceId?: string) => void
  ): void {
    logger.debug('setting default scenario');
    workspaceRepository.setDefaultScenario(
      client,
      workspaceId,
      scenarioId,
      (error: OurError): void => {
        if (error) {
          callback(error);
        } else {
          callback(null, workspaceId);
        }
      }
    );
  }

  function get(request: Request, response: Response, next: any): void {
    workspaceRepository.get(
      request.params.id,
      (error: OurError, result: IOldWorkspace): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function update(request: Request, response: Response, next: any): void {
    workspaceRepository.update(
      request.body.problem.title,
      request.body.problem,
      request.params.id,
      (error: OurError): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(httpStatus.OK);
        }
      }
    );
  }

  function del(request: Request, response: Response, next: any): void {
    workspaceRepository.delete(request.params.id, (error: OurError): void => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  return {
    query,
    create,
    createWorkspaceTransaction,
    get,
    update,
    delete: del
  };
}
