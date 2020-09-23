import {OurError} from '@shared/interface/IError';
import {Request, Response} from 'express';
import {OK} from 'http-status-codes';
import IDB from './interface/IDB';
import {handleError} from './util';
import WorkspaceSettingsRepository from './workspaceSettingsRepository';

export default function WorkspaceSettingsHandler(db: IDB) {
  const workspaceSettingsRepository = WorkspaceSettingsRepository(db);

  function get(request: Request, response: Response, next: any): void {
    workspaceSettingsRepository.get(
      request.params.workspaceId,
      (error: OurError, result: any): void => {
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
      (error: OurError): void => {
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
