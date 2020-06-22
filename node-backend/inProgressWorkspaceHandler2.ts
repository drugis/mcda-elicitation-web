import {Request, Response} from 'express';
import {CREATED} from 'http-status-codes';
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
          response.json(createdId);
        }
      }
    );
  }

  return {
    create: create
  };
}
