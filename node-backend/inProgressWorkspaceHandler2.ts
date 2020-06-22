import {Request, Response} from 'express';
import {CREATED, OK} from 'http-status-codes';
import InProgressWorkspaceRepository from './inProgressWorkspaceRepository2';
import {getUser, handleError} from './util';
import _ from 'lodash';
import {parallel} from 'async';
import IInProgressWorkspace from '../app/js/interface/IInProgressWorkspace';

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
      request.params.inProgressId,
      (error: any, inProgressWorkspace: any) => {
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
