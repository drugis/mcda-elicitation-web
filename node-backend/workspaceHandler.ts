'use strict';
import {
  extractPvfs,
  extractRanges
} from '@shared/CreateWorkspaceUtil/CreateWorkspaceUtil';
import IWorkspaceCommand from '@shared/interface/Commands/IWorkspaceCommand';
import {OurError} from '@shared/interface/IError';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import IWorkspaceExample from '@shared/interface/Workspace/IWorkspaceExample';
import {updateProblemToCurrentSchema} from '@shared/SchemaUtil/SchemaUtil';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {readFileSync} from 'fs';
import httpStatus from 'http-status-codes';
import _ from 'lodash';
import {PoolClient} from 'pg';
import IDB from './interface/IDB';
import IWorkspaceCreationInfo from './interface/IWorkspaceCreationInfo';
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

  function create(
    request: Request<{}, {}, IWorkspaceCommand>,
    response: Response,
    next: any
  ): void {
    const creationInfo = {
      workspace: request.body,
      ownerId: getUser(request).id
    };
    db.runInTransaction(
      _.partial(createWorkspaceTransaction, creationInfo),
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

  function createPremade(
    request: Request<{}, {}, IWorkspaceExample>,
    response: Response,
    next: any
  ): void {
    const creationInfo = buildPremadeCreationInfo(request);

    db.runInTransaction(
      _.partial(createWorkspaceTransaction, creationInfo),
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

  function buildPremadeCreationInfo(
    request: Request<{}, {}, IWorkspaceExample>
  ) {
    const exampleFolder =
      request.body.type === 'example'
        ? 'regular-examples'
        : 'tutorial-examples';
    const workspaceFile = readFileSync(
      `${__dirname}/examples/${exampleFolder}/${request.body.key}.json`
    ).toString();
    const problem = JSON.parse(workspaceFile);
    const updatedProblem = updateProblemToCurrentSchema(problem);
    const workspace = {
      title: problem.title,
      pvfs: extractPvfs(problem.criteria),
      ranges: extractRanges(problem.criteria),
      problem: updatedProblem
    };
    return {
      workspace: workspace,
      ownerId: getUser(request).id
    };
  }

  function createWorkspaceTransaction(
    workspaceInfo: IWorkspaceCreationInfo,
    client: PoolClient,
    transactionCallback: (
      error: OurError,
      workspaceInfo: IWorkspaceInfo
    ) => void
  ): void {
    waterfall(
      [
        _.partial(createNewWorkspace, client, workspaceInfo),
        _.partial(createSubProblem, client, workspaceInfo),
        _.partial(setDefaultSubProblem, client),
        _.partial(createScenario, client, workspaceInfo),
        _.partial(setDefaultScenario, client),
        _.partial(workspaceRepository.getWorkspaceInfo, client)
      ],
      transactionCallback
    );
  }

  function createNewWorkspace(
    client: PoolClient,
    workspaceInfo: IWorkspaceCreationInfo,
    callback: (error: OurError, id: string) => void
  ): void {
    logger.debug('creating new workspace');

    const title = workspaceInfo.workspace.title;
    workspaceRepository.create(
      client,
      workspaceInfo.ownerId,
      title,
      workspaceInfo.workspace.problem,
      callback
    );
  }

  function createSubProblem(
    client: PoolClient,
    workspaceInfo: IWorkspaceCreationInfo,
    workspaceId: string,
    callback: (
      error: OurError,
      workspaceId?: string,
      subproblemId?: string
    ) => void
  ): void {
    logger.debug('creating subproblem');
    const definition = {
      ranges: workspaceInfo.workspace.ranges
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
    workspaceInfo: IWorkspaceCreationInfo,
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
            workspaceInfo.workspace.problem.criteria,
            workspaceInfo.workspace.pvfs
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
    createPremade,
    createWorkspaceTransaction,
    get,
    update,
    delete: del
  };
}
