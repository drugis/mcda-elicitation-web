import {OurError} from '@shared/interface/IError';
import {AsyncResultCallback} from 'async';
import {PoolClient} from 'pg';

export default interface IDB {
  runInTransaction: (
    functionsToExecute: (
      client: PoolClient,
      callback: (error: OurError, result?: any) => void
    ) => void,
    callback: AsyncResultCallback<any, OurError>
  ) => void;
  query: (
    text: string,
    values: any,
    callback: (error: OurError, result?: any) => void
  ) => void;
  endConnection: () => void;
}

export type ClientOrDB = IDB | PoolClient;
