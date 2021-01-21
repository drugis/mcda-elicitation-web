'use strict';
import {OurError} from '@shared/interface/IError';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import IScenarioPvf from '@shared/interface/Scenario/IScenarioPvf';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import httpStatus from 'http-status-codes';
import _ from 'lodash';
import {PoolClient} from 'pg';
import IDB from './interface/IDB';
import logger from './logger';
import ScenarioRepository from './scenarioRepository';
import SubproblemRepository from './subproblemRepository';
import {buildScenarioCriteria, getUser, handleError} from './util';
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
    request: Request<
      {},
      {},
      {
        ranges: Record<string, [number, number]>;
        title: string;
        problem: IProblem;
        pvfs: Record<string, IScenarioPvf>;
      }
    >,
    callback: (error: OurError, id: string) => void
  ): void {
    logger.debug('creating new workspace');

    const owner = getUser(request).id;
    const title = request.body.title;
    workspaceRepository.create(
      client,
      owner,
      title,
      request.body.problem,
      callback
    );
  }

  function createSubProblem(
    client: PoolClient,
    request: Request<
      {},
      {},
      {
        ranges: Record<string, [number, number]>;
        title: string;
        problem: IProblem;
        pvfs: Record<string, IScenarioPvf>;
      }
    >,
    workspaceId: string,
    callback: (
      error: OurError,
      workspaceId?: string,
      subproblemId?: string
    ) => void
  ): void {
    logger.debug('creating subproblem');
    const definition = {
      ranges: request.body.ranges
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
    request: Request<
      {},
      {},
      {
        ranges: Record<string, [number, number]>;
        title: string;
        problem: IProblem;
        pvfs: Record<string, IScenarioPvf>;
      }
    >,
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
        problem: {
          criteria: buildScenarioCriteria(
            request.body.problem.criteria,
            request.body.pvfs
          )
        },
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
