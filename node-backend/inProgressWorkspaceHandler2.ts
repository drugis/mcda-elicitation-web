import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import IInProgressMessage from '../app/js/interface/IInProgressMessage';
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

  return {
    create: create,
    get: get
  };
}
