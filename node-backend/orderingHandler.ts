'use strict';

import {Request, Response} from 'express';
import {Error} from '@shared/interface/IError';
import {handleError} from './util';
import {OK} from 'http-status-codes';
import OrderingRepository from './orderingRepository';
import IDB from './interface/IDB';

export default function OrderingHandler(db: IDB) {
  const orderingRepository = OrderingRepository(db);

  function get(request: Request, response: Response, next: any) {
    orderingRepository.get(
      request.params.workspaceId,
      (error: Error, result: any) => {
        if (error) {
          handleError(error, next);
        } else {
          response.json({
            ordering: result
          });
        }
      }
    );
  }

  function update(request: Request, response: Response, next: any) {
    orderingRepository.updateDirect(
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
    update: update
  };
}
