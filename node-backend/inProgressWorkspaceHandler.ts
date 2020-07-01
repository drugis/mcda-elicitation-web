import IAlternativeCommand from '@shared/interface/IAlternativeCommand';
import ICriterionCommand from '@shared/interface/ICriterionCommand';
import IDataSourceCommand from '@shared/interface/IDataSourceCommand';
import IError from '@shared/interface/IError';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import _ from 'lodash';
import {
  buildEmptyInProgress,
  buildInProgressCopy,
  createOrdering,
  createProblem
} from './inProgressRepositoryService';
import InProgressWorkspaceRepository from './inProgressWorkspaceRepository';
import {logger} from './loggerTS';
import OrderingRepository from './orderingRepository';
import {getUser, handleError} from './util';
import WorkspaceHandler from './workspaceHandler';
import WorkspaceRepository from './workspaceRepository';

export default function InProgressHandler(db: any) {
  const inProgressWorkspaceRepository = InProgressWorkspaceRepository(db);
  const workspaceRepository = WorkspaceRepository(db);

  const workspaceHandler = WorkspaceHandler(db);
  const orderingRepository = OrderingRepository(db);

  function createEmpty(
    request: Request,
    response: Response,
    next: () => {}
  ): void {
    const user: {id: string} = getUser(request);
    const emptyInProgress = buildEmptyInProgress();
    inProgressWorkspaceRepository.create(
      user.id,
      emptyInProgress,
      _.partial(createCallback, response, next)
    );
  }

  function createCopy(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    const user: {id: string} = getUser(request);
    const sourceWorkspaceId = Number.parseInt(request.body.sourceWorkspaceId);

    waterfall(
      [
        _.partial(workspaceRepository.get, sourceWorkspaceId),
        buildInProgress,
        _.partial(createNew, user.id)
      ],
      _.partial(createCallback, response, next)
    );
  }

  function createCallback(
    response: Response,
    next: () => void,
    error: IError | null,
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
    workspace: IWorkspace,
    callback: (error: IError | null, inProgressCopy: IInProgressMessage) => void
  ) {
    callback(null, buildInProgressCopy(workspace));
  }

  function createNew(
    userId: string,
    inProgressCopy: IInProgressMessage,
    callback: (error: IError | null, createdId: string) => void
  ) {
    inProgressWorkspaceRepository.create(userId, inProgressCopy, callback);
  }

  function get(request: Request, response: Response, next: () => void): void {
    inProgressWorkspaceRepository.get(
      Number.parseInt(request.params.id),
      (error: any, inProgressWorkspace: IInProgressMessage) => {
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
      (error: any) => {
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
    inProgressWorkspaceRepository.upsertCriterion(command, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function deleteCriterion(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteCriterion(
      request.params.criterionId,
      (error: any) => {
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
    inProgressWorkspaceRepository.upsertDataSource(command, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function deleteDataSource(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteDataSource(
      request.params.dataSourceId,
      (error: any) => {
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
    inProgressWorkspaceRepository.upsertAlternative(command, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function deleteAlternative(
    request: Request,
    response: Response,
    next: () => void
  ): void {
    inProgressWorkspaceRepository.deleteAlternative(
      request.params.alternativeId,
      (error: any) => {
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
    inProgressWorkspaceRepository.upsertCell(request.body, (error: any) => {
      if (error) {
        handleError(error, next);
      } else {
        response.sendStatus(OK);
      }
    });
  }

  function createWorkspace(
    request: Request,
    response: Response,
    next: (error: any) => void
  ): void {
    const inProgressId = Number.parseInt(request.params.id);
    waterfall(
      [
        _.partial(inProgressWorkspaceRepository.get, inProgressId),
        buildProblemFromInProgress,
        _.partial(createInTransaction, request.user, inProgressId)
      ],
      (error: IError | null, createdWorkspaceInfo: IWorkspaceInfo): void => {
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
    callback(null, createProblem(inProgressMessage));
  }

  function createInTransaction(
    user: any,
    inProgressId: number,
    problem: IProblem,
    overallCallback: (
      error: IError | null,
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
        client: any,
        transactionCallback: (
          error: IError | null,
          createdWorkspaceInfo?: IWorkspaceInfo
        ) => void
      ) => {
        waterfall(
          [
            _.partial(
              workspaceHandler.createWorkspaceTransaction,
              fakeRequest,
              client
            ),
            _.partial(deleteInprogress, client, inProgressId),
            _.partial(insertOrdering, client)
          ],
          transactionCallback
        );
      },
      (error: IError | null, createdWorkspaceInfo?: IWorkspaceInfo): void => {
        overallCallback(error, error ? null : createdWorkspaceInfo);
      }
    );
  }

  function deleteInprogress(
    client: any,
    inProgressId: number,
    createdWorkspaceInfo: IWorkspaceInfo,
    callback: (
      error: IError | null,
      createWorkspaceInfo?: IWorkspaceInfo
    ) => void
  ): void {
    inProgressWorkspaceRepository.deleteInTransaction(
      client,
      inProgressId,
      (error: IError | null) => {
        callback(error, error ? null : createdWorkspaceInfo);
      }
    );
  }

  function insertOrdering(
    client: any,
    createdWorkspaceInfo: IWorkspaceInfo,
    callback: (
      error: IError | null,
      createdWorkspaceInfo?: IWorkspaceInfo
    ) => void
  ) {
    const ordering = createOrdering(
      createdWorkspaceInfo.problem.criteria,
      createdWorkspaceInfo.problem.alternatives
    );
    orderingRepository.updateInTransaction(
      client,
      createdWorkspaceInfo.id,
      ordering,
      (error: IError) => {
        if (error) {
          callback(error);
        } else {
          callback(null, createdWorkspaceInfo);
        }
      }
    );
  }

  function query(request: Request, response: Response, next: () => {}): void {
    const user: {id: number} = getUser(request);
    inProgressWorkspaceRepository.query(
      user.id,
      (error: IError, results: any[]) => {
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
      Number.parseInt(request.params.id),
      (error: IError) => {
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
