'use strict';

import {Request, Response} from 'express';
import {Error} from '@shared/interface/IError';
import {handleError} from './util';
import {OK} from 'http-status-codes';
import WorkspaceSettingsRepository from './workspaceSettingsRepository';
import IDB from './interface/IDB';

export default function WorkspaceSettingsHandler(db: IDB) {
  const workspaceSettingsRepository = WorkspaceSettingsRepository(db);

  function get(request: Request, response: Response, next: any) {
    workspaceSettingsRepository.get(
      request.params.workspaceId,
      (error: Error, result: any) => {
        if (error) {
          handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function put(request: Request, response: Response, next: any) {
    workspaceSettingsRepository.put(
      request.params.workspaceId,
      request.body,
      (error: Error) => {
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
