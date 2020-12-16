import {OurError} from '@shared/interface/IError';
import IOrdering from '@shared/interface/IOrdering';
import {Request, Response} from 'express';
import {OK} from 'http-status-codes';
import {QueryResult} from 'pg';
import IDB from './interface/IDB';
import OrderingRepository from './orderingRepository';
import {handleError} from './util';

export default function OrderingHandler(db: IDB) {
  const orderingRepository = OrderingRepository(db);

  function get(request: Request, response: Response, next: any): void {
    orderingRepository.get(
      request.params.workspaceId,
      (error: OurError, result: QueryResult<IOrdering>): void => {
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
    update: update
  };
}
