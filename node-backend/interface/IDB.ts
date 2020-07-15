import IError, {Error} from '@shared/interface/IError';
import {AsyncResultCallback} from 'async';
import {PoolClient} from 'pg';

export default interface IDB {
  runInTransaction: (
    functionsToExecute: (
      client: PoolClient,
      callback: (error: Error, result?: any) => void
    ) => void,
    callback: AsyncResultCallback<any, IError>
  ) => void;
  query: (
    text: string,
    values: any,
    callback: (error: Error, result?: any) => void
  ) => void;
  endConnection: () => void;
}

export type ClientOrDB = IDB | PoolClient;
