import {Request, Response} from 'express';
import {Error} from '@shared/interface/IError';
import {handleError} from './util';
import {OK} from 'http-status-codes';
import WorkspaceSettingsRepository from './workspaceSettingsRepository';
import IDB from './interface/IDB';

export default function WorkspaceSettingsHandler(db: IDB) {
  const workspaceSettingsRepository = WorkspaceSettingsRepository(db);

  function get(request: Request, response: Response, next: any): void {
    workspaceSettingsRepository.get(
      request.params.workspaceId,
      (error: Error, result: any): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function put(request: Request, response: Response, next: any): void {
    workspaceSettingsRepository.put(
      request.params.workspaceId,
      request.body,
      (error: Error): void => {
        if (error) {
          handleError(error, next);
        } else {
          response.sendStatus(OK);
        }
      }
    );
  }

  return {
    get: get,
    put: put
  };
}
