import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import IAlternativeCommand from '../app/ts/interface/IAlternativeCommand';
import ICriterionCommand from '../app/ts/interface/ICriterionCommand';
import IDataSourceCommand from '../app/ts/interface/IDataSourceCommand';
import IInProgressMessage from '../app/ts/interface/IInProgressMessage';
import InProgressWorkspaceRepository from './inProgressWorkspaceRepository2';
import {getUser, handleError} from './util';

export default function InProgressHandler(db: any) {
  const inProgressWorkspaceRepository = InProgressWorkspaceRepository(db);

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
    next: () => void
  ): void {
    const user: {id: string} = getUser(request);
    inProgressWorkspaceRepository.get(
      Number.parseInt(request.params.id),
      (error: any, inProgressMessage: IInProgressMessage) => {
        inProgressWorkspaceRepository.createWorkspace(
          user.id,
          Number.parseInt(request.params.id),
          inProgressMessage,
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
