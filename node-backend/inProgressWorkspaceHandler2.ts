import {waterfall} from 'async';
import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import _ from 'lodash';
import IAlternativeCommand from '../app/ts/interface/IAlternativeCommand';
import ICriterionCommand from '../app/ts/interface/ICriterionCommand';
import IDataSourceCommand from '../app/ts/interface/IDataSourceCommand';
import IError from '../app/ts/interface/IError';
import IInProgressMessage from '../app/ts/interface/IInProgressMessage';
import IWorkspaceInfo from '../app/ts/interface/IWorkspaceInfo';
import IProblem from '../app/ts/interface/Problem/IProblem';
import {createProblem} from './inProgressRepositoryService';
import InProgressWorkspaceRepository from './inProgressWorkspaceRepository2';
import {logger} from './loggerTS';
import {getUser, handleError} from './util';
import WorkspaceHandler from './workspaceHandler';

export default function InProgressHandler(db: any) {
  const inProgressWorkspaceRepository = InProgressWorkspaceRepository(db);
  const workspaceHandler = WorkspaceHandler(db);

  function create(request: Request, response: Response, next: () => {}): void {
    const user: {id: string} = getUser(request);
    inProgressWorkspaceRepository.create(
      user.id,
      (error: any, createdId: string) => {
        if (error) {
          handleError(error, next);
        } else {
          response.status(CREATED);
          response.json({id: createdId});
        }
      }
    );
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
        createProblemFromInProgress,
        _.partial(
          createWorkspaceAndDeleteInProgress,
          request.user,
          inProgressId
        )
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

  function createProblemFromInProgress(
    inProgressMessage: IInProgressMessage,
    callback: (error: any, problem?: IProblem) => void
  ) {
    callback(null, createProblem(inProgressMessage));
  }

  function createWorkspaceAndDeleteInProgress(
    user: any,
    inProgressId: number,
    problem: IProblem,
    overallCallback: (error: IError | null, createdWorkspaceInfo?: any) => void
  ): void {
    const fakeRequest = {
      user: user,
      body: {
        problem: problem,
        title: problem.title
      }
    };
    logger.debug('yo');
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
            _.partial(deleteinprogress, client, inProgressId)
          ],
          transactionCallback
        );
      },
      (error: IError | null, createdWorkspaceInfo?: IWorkspaceInfo): void => {
        overallCallback(error, error || createdWorkspaceInfo);
      }
    );
  }

  function deleteinprogress(
    client: any,
    inProgressId: number,
    createdWorkspaceInfo: IWorkspaceInfo,
    callback: (
      error: IError | null,
      createWorkspaceInfo?: IWorkspaceInfo
    ) => void
  ): void {
    inProgressWorkspaceRepository.delete(
      client,
      inProgressId,
      (error: IError | null) => {
        callback(error, error ? null : createdWorkspaceInfo);
      }
    );
  }

  return {
    create: create,
    get: get,
    updateWorkspace: updateWorkspace,
    updateCriterion: updateCriterion,
    deleteCriterion: deleteCriterion,
    updateDataSource: updateDataSource,
    deleteDataSource: deleteDataSource,
    updateAlternative: updateAlternative,
    deleteAlternative: deleteAlternative,
    updateCell: updateCell,
    createWorkspace: createWorkspace
  };
}
