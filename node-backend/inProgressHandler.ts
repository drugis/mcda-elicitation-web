import IAlternativeCommand from '@shared/interface/IAlternativeCommand';
import ICellCommand from '@shared/interface/ICellCommand';
import ICriterionCommand from '@shared/interface/ICriterionCommand';
import IDataSourceCommand from '@shared/interface/IDataSourceCommand';
import {OurError} from '@shared/interface/IError';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import {buildInProgressCopy} from '@shared/workspaceService';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import _ from 'lodash';
import {PoolClient} from 'pg';
import InProgressWorkspaceRepository from './inProgressRepository';
import {
  buildEmptyInProgress,
  buildProblem,
  createOrdering
} from './inProgressRepositoryService';
import IDB from './interface/IDB';
import logger from './logger';
import OrderingRepository from './orderingRepository';
import {getUser, handleError} from './util';
import WorkspaceHandler from './workspaceHandler';
import WorkspaceRepository from './workspaceRepository';

export default function InProgressHandler(db: IDB) {
  const inProgressWorkspaceRepository = InProgressWorkspaceRepository(db);
  const workspaceRepository = WorkspaceRepository(db);

  const workspaceHandler = WorkspaceHandler(db);
  const orderingRepository = OrderingRepository(db);

  function createEmpty(
    request: Request,
    response: Response,
    next: () => {}
  ): void {
    const emptyInProgress = buildEmptyInProgress();
    inProgressWorkspaceRepository.create(
      getUser(request).id,
      emptyInProgress,
      _.partial(createCallback, response, next)
    );
  }

  function createCopy(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const sourceWorkspaceId = request.body.sourceWorkspaceId;
    waterfall(
      [
        _.partial(workspaceRepository.get, sourceWorkspaceId),
        buildInProgress,
        _.partial(createNew, getUser(request).id)
      ],
      _.partial(createCallback, response, next)
    );
  }

  function createCallback(
    response: Response,
    next: () => void,
    error: OurError,
    createdId: string
  ) {
    if (error) {
      handleError(error, next);
    } else {
      response.status(CREATED);
      response.json({id: createdId});
    }
  }

  function buildInProgress(
    workspace: IOldWorkspace,
    callback: (error: OurError, inProgressCopy: IWorkspace) => void
  ): void {
    callback(null, buildInProgressCopy(workspace));
  }

  function createNew(
    userId: string,
    inProgressCopy: IWorkspace,
    callback: (error: OurError, createdId: string) => void
  ): void {
    inProgressWorkspaceRepository.create(userId, inProgressCopy, callback);
  }

  function get(request: Request, response: Response, next: () => void): void {
    inProgressWorkspaceRepository.get(
      request.params.id,
      (error: any, inProgressWorkspace: IInProgressMessage): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.status(OK);
          response.json(inProgressWorkspace);
        }
      }
    );
  }

  function updateWorkspace(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.updateWorkspace(
      request.body,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateCriterion(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const command: ICriterionCommand = request.body;
    inProgressWorkspaceRepository.upsertCriterion(
      command,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function deleteCriterion(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteCriterion(
      request.params.criterionId,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateDataSource(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const command: IDataSourceCommand = request.body;
    inProgressWorkspaceRepository.upsertDataSource(
      command,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function deleteDataSource(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteDataSource(
      request.params.dataSourceId,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateAlternative(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const command: IAlternativeCommand = request.body;
    inProgressWorkspaceRepository.upsertAlternative(
      command,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function deleteAlternative(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteAlternative(
      request.params.alternativeId,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function updateCell(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const cells: ICellCommand[] = [request.body];
    inProgressWorkspaceRepository.upsertCellsDirectly(
      cells,
      (error: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  function createWorkspace(
    request: Request,
    response: Response,
    next: (error: any) => void
  ): void {
    const inProgressId = request.params.id;
    waterfall(
      [
        _.partial(inProgressWorkspaceRepository.get, inProgressId),
        buildProblemFromInProgress,
        _.partial(createInTransaction, request.user, inProgressId)
      ],
      (error: OurError, createdWorkspaceInfo: IWorkspaceInfo): void => {
        if (error) {
          logger.debug('error creating workspace from in progress ' + error);
          next(error);
        } else {
          response.status(CREATED);
          response.json(createdWorkspaceInfo);
        }
      }
    );
  }

  function buildProblemFromInProgress(
    inProgressMessage: IInProgressMessage,
    callback: (error: any, problem?: IProblem) => void
  ) {
    callback(null, buildProblem(inProgressMessage));
  }

  function createInTransaction(
    user: any,
    inProgressId: string,
    problem: IProblem,
    overallCallback: (
      error: OurError,
      createdWorkspaceInfo?: IWorkspaceInfo
    ) => void
  ): void {
    const fakeRequest = {
      user: user,
      body: {
        problem: problem,
        title: problem.title
      }
    };
    db.runInTransaction(
      (
        client: PoolClient,
        transactionCallback: (
          error: OurError,
          createdWorkspaceInfo?: IWorkspaceInfo
        ) => void
      ): void => {
        waterfall(
          [
            _.partial(
              workspaceHandler.createWorkspaceTransaction,
              fakeRequest as Request,
              client
            ),
            _.partial(deleteInprogress, client, inProgressId),
            _.partial(insertOrdering, client)
          ],
          transactionCallback
        );
      },
      (error: OurError, createdWorkspaceInfo?: IWorkspaceInfo): void => {
        overallCallback(error, error ? null : createdWorkspaceInfo);
      }
    );
  }

  function deleteInprogress(
    client: PoolClient,
    inProgressId: string,
    createdWorkspaceInfo: IWorkspaceInfo,
    callback: (error: OurError, createWorkspaceInfo?: IWorkspaceInfo) => void
  ): void {
    inProgressWorkspaceRepository.deleteInTransaction(
      client,
      inProgressId,
      (error: OurError): void => {
        callback(error, error ? null : createdWorkspaceInfo);
      }
    );
  }

  function insertOrdering(
    client: PoolClient,
    createdWorkspaceInfo: IWorkspaceInfo,
    callback: (error: OurError, createdWorkspaceInfo?: IWorkspaceInfo) => void
  ): void {
    const ordering = createOrdering(
      createdWorkspaceInfo.problem.criteria,
      createdWorkspaceInfo.problem.alternatives
    );
    orderingRepository.updateInTransaction(
      client,
      createdWorkspaceInfo.id.toString(),
      ordering,
      (error: OurError): void => {
        if (error) {
          callback(error);
        } else {
          callback(null, createdWorkspaceInfo);
        }
      }
    );
  }

  function query(request: Request, response: Response, next: () => {}): void {
    inProgressWorkspaceRepository.query(
      getUser(request).id,
      (error: OurError, results: any[]): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(results);
        }
      }
    );
  }

  function del(request: Request, response: Response, next: () => {}): void {
    inProgressWorkspaceRepository.deleteDirectly(
      request.params.id,
      (error: OurError): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(OK);
        }
      }
    );
  }

  return {
    createEmpty: createEmpty,
    createCopy: createCopy,
    get: get,
    updateWorkspace: updateWorkspace,
    updateCriterion: updateCriterion,
    deleteCriterion: deleteCriterion,
    updateDataSource: updateDataSource,
    deleteDataSource: deleteDataSource,
    updateAlternative: updateAlternative,
    deleteAlternative: deleteAlternative,
    updateCell: updateCell,
    createWorkspace: createWorkspace,
    query: query,
    delete: del
  };
}
