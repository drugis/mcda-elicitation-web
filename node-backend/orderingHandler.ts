import {Request, Response} from 'express';
import {Error} from '@shared/interface/IError';
import {handleError} from './util';
import {OK} from 'http-status-codes';
import OrderingRepository from './orderingRepository';
import IDB from './interface/IDB';

export default function OrderingHandler(db: IDB) {
  const orderingRepository = OrderingRepository(db);

  function get(request: Request, response: Response, next: any): void {
    orderingRepository.get(
      request.params.workspaceId,
      (error: Error, result: any): void => {
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

  function update(request: Request, response: Response, next: any): void {
    orderingRepository.updateDirect(
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
    update: update
  };
}
