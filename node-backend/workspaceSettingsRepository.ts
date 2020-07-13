import logger from './logger';
import IDB from './interface/IDB';
import {QueryResult} from 'pg';

export default function WorkspaceSettingsRepository(db: IDB) {
  function get(
    workspaceId: string,
    callback: (error: Error, result?: any) => void
  ): void {
    logger.debug('GET /workspaces/' + workspaceId + '/workspaceSettings');
    db.query(
      'SELECT settings FROM workspaceSettings WHERE workspaceId = $1',
      [workspaceId],
      (error: Error, result: QueryResult<any>): void => {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback(null, {});
        } else {
          callback(null, result.rows[0].settings);
        }
      }
    );
  }

  function put(
    workspaceId: string,
    settings: any,
    callback: (error: Error) => void
  ): void {
    logger.debug('PUT /workspaces/' + workspaceId + '/workspaceSettings');
    db.query(
      'INSERT INTO workspaceSettings (workspaceid, settings) VALUES ($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET settings=$2',
      [workspaceId, settings],
      callback
    );
  }

  return {
    get: get,
    put: put
  };
}
