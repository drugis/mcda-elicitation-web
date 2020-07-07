'use strict';
import {Error} from '@shared/interface/IError';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import async from 'async';
import {Request, Response} from 'express';
import httpStatus from 'http-status-codes';
import _ from 'lodash';
import logger from './loggerTS';
import {getRanges, getUser, handleError, reduceProblem} from './util';
import WorkspaceRepository from './workspaceRepository';
import SubproblemRepository from './subproblemRepository';
import ScenarioRepository from './scenarioRepository';

export default function WorkspaceHandler(db: any) {
  const workspaceRepository = WorkspaceRepository(db);
  const subproblemRepository = SubproblemRepository(db);
  const scenarioRepository = ScenarioRepository(db);

  function query(request: Request, response: Response, next: any): void {
    workspaceRepository.query(
      getUser(request).id,
      (error: Error, result: IOldWorkspace[]) => {
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
      function (error: Error, workspaceInfo: IWorkspaceInfo) {
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
    client: any,
    transactionCallback: (error: Error, workspaceInfo: IWorkspaceInfo) => void
  ): void {
    async.waterfall(
      [
        _.partial(createNewWorkspace, client),
        _.partial(createSubProblem, client),
        _.partial(setDefaultSubProblem, client),
        _.partial(createScenario, client),
        _.partial(setDefaultScenario, client),
        _.partial(workspaceRepository.getWorkspaceInfo, client)
      ],
      transactionCallback
    );

    function createNewWorkspace(
      client: any,
      callback: (error: Error, id: string) => void
    ) {
      logger.debug('creating new workspace');

      const owner = getUser(request).id;
      const title = request.body.title;
      const problem = request.body.problem;
      workspaceRepository.create(client, owner, title, problem, callback);
    }

    function createSubProblem(
      client: any,
      workspaceId: string,
      callback: (
        error: Error,
        workspaceId?: string,
        subproblemId?: number
      ) => void
    ) {
      logger.debug('creating subProblem');
      const definition = {
        ranges: getRanges(request.body.problem)
      };
      subproblemRepository.create(
        client,
        workspaceId,
        'Default',
        definition,
        (error: Error, subproblemId: number) => {
          if (error) {
            callback(error);
          } else {
            callback(null, workspaceId, subproblemId);
          }
        }
      );
    }

    function setDefaultSubProblem(
      client: any,
      workspaceId: string,
      subproblemId: number,
      callback: (
        error: Error,
        workspaceId?: string,
        subproblemId?: number
      ) => void
    ): void {
      logger.debug('setting default subProblem');
      workspaceRepository.setDefaultSubProblem(
        client,
        workspaceId,
        subproblemId,
        (error: Error) => {
          if (error) {
            callback(error);
          } else {
            callback(null, workspaceId, subproblemId);
          }
        }
      );
    }

    function createScenario(
      client: any,
      workspaceId: string,
      subproblemId: number,
      callback: (
        error: Error,
        workspaceId?: string,
        scenarioId?: number
      ) => void
    ) {
      logger.debug('creating scenario');
      var state = {
        problem: reduceProblem(request.body.problem)
      };
      scenarioRepository.createInTransaction(
        client,
        workspaceId,
        subproblemId,
        'Default',
        state,
        (error: Error, scenarioId: number) => {
          if (error) {
            callback(error);
          } else {
            callback(null, workspaceId, scenarioId);
          }
        }
      );
    }

    function setDefaultScenario(
      client: any,
      workspaceId: string,
      scenarioId: number,
      callback: (error: Error, workspaceId?: string) => void
    ) {
      logger.debug('setting default scenario');
      workspaceRepository.setDefaultScenario(
        client,
        workspaceId,
        scenarioId,
        (error: Error) => {
          if (error) {
            callback(error);
          } else {
            callback(null, workspaceId);
          }
        }
      );
    }
  }

  function get(request: Request, response: Response, next: any) {
    workspaceRepository.get(
      request.params.id,
      (error: Error, result: IOldWorkspace) => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function update(request: Request, response: Response, next: any) {
    workspaceRepository.update(
      request.body.problem.title,
      request.body.problem,
      request.params.id,
      (error: Error) => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(httpStatus.OK);
        }
      }
    );
  }

  function del(request: Request, response: Response, next: any) {
    workspaceRepository.delete(request.params.id, (error: Error) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  return {
    query: query,
    create: create,
    createWorkspaceTransaction: createWorkspaceTransaction,
    get: get,
    update: update,
    delete: del
  };
}
