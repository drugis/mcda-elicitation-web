'use strict';

import {Error} from '@shared/interface/IError';
import logger from './logger';
import IDB, {ClientOrDB} from './interface/IDB';
import {PoolClient} from 'pg';

export default function OrderingRepository(db: IDB) {
  function get(
    workspaceId: string,
    callback: (error: Error, result?: any) => void
  ): void {
    logger.debug('getting /workspaces/' + workspaceId + '/ordering');
    db.query(
      'SELECT workspaceId AS "workspaceId", ordering FROM ordering WHERE workspaceId = $1',
      [workspaceId],
      (error: Error, result: {rows: any[]}): void => {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback(null);
        } else {
          callback(null, result.rows[0].ordering);
        }
      }
    );
  }

  function updateDirect(
    workspaceId: string,
    ordering: any,
    callback: (error: Error, result?: any) => void
  ): void {
    update(db, workspaceId, ordering, callback);
  }

  function updateInTransaction(
    client: PoolClient,
    workspaceId: string,
    ordering: any,
    callback: (error: Error, result?: any) => void
  ): void {
    update(client, workspaceId, ordering, callback);
  }

  function update(
    dbOrClient: ClientOrDB,
    workspaceId: string,
    ordering: any,
    callback: (error: Error, result?: any) => void
  ): void {
    logger.debug('setting /workspaces/' + workspaceId + '/ordering/');
    dbOrClient.query(
      'INSERT INTO ordering(workspaceId, ordering) values($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET ordering=$2',
      [workspaceId, ordering],
      callback
    );
  }

  return {
    get: get,
    updateDirect: updateDirect,
    updateInTransaction: updateInTransaction
  };
}
