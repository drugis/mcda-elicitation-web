import {Error} from '@shared/interface/IError';
import _ from 'lodash';
import {PoolClient, QueryResult} from 'pg';
import IDB, {ClientOrDB} from './interface/IDB';
import logger from './logger';

export default function ScenarioRepository(db: IDB) {
  function createInTransaction(
    client: PoolClient,
    workspaceId: string,
    subproblemId: number,
    title: string,
    state: any,
    callback: (error: Error, id?: number) => void
  ): void {
    create(client, workspaceId, subproblemId, title, state, callback);
  }

  function createDirectly(
    workspaceId: string,
    subproblemId: number,
    title: string,
    state: any,
    callback: (error: Error, id?: number) => void
  ): void {
    create(db, workspaceId, subproblemId, title, state, callback);
  }

  function create(
    clientOrDB: ClientOrDB,
    workspaceId: string,
    subproblemId: number,
    title: string,
    state: any,
    callback: (error: Error, id?: number) => void
  ): void {
    logger.debug('Creating scenario');
    const query =
      'INSERT INTO scenario (workspace, subProblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id';
    clientOrDB.query(
      query,
      [workspaceId, subproblemId, title, state],
      (error: Error, result: QueryResult<{id: number}>) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result.rows[0].id);
        }
      }
    );
  }

  function query(
    workspaceId: string,
    callback: (error: Error, scenarios?: any[]) => void
  ): void {
    logger.debug('Getting scenarios for workspace: ' + workspaceId);
    const query =
      'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1';
    db.query(query, [workspaceId], _.partial(resultsCallback, callback));
  }

  function queryForSubProblem(
    workspaceId: string,
    subproblemId: number,
    callback: (error: Error, scenarios?: any[]) => void
  ) {
    logger.debug(
      'getting /workspaces/' +
        workspaceId +
        '/subProblem/' +
        subproblemId +
        '/scenarios'
    );
    const query =
      'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1 AND subProblemId = $2';
    db.query(
      query,
      [workspaceId, subproblemId],
      _.partial(resultsCallback, callback)
    );
  }

  function resultsCallback(
    callback: (error: Error, result?: any) => void,
    error: Error,
    result: QueryResult<any>
  ): void {
    if (error) {
      callback(error);
    } else {
      callback(null, result.rows);
    }
  }
  function get(
    scenarioId: string,
    callback: (error: Error, scenario?: any) => void
  ): void {
    logger.debug('Getting scenario: ' + scenarioId);
    const query =
      'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE id = $1';
    db.query(query, [scenarioId], (error: Error, result: QueryResult<any>) => {
      if (error) {
        callback(error);
      } else if (!result.rows.length) {
        callback({
          message: 'No scenario with ID ' + scenarioId + ' found.',
          statusCode: 404
        });
      } else {
        callback(null, result.rows[0]);
      }
    });
  }

  function update(
    state: any,
    title: string,
    scenarioId: number,
    callback: (error: Error) => void
  ): void {
    logger.debug('updating scenario:' + scenarioId);
    const query = 'UPDATE scenario SET state = $1, title = $2 WHERE id = $3';
    db.query(
      query,
      [
        {
          problem: state.problem,
          prefs: state.prefs,
          legend: state.legend,
          uncertaintyOptions: state.uncertaintyOptions,
          weights: state.weights
        },
        title,
        scenarioId
      ],
      callback
    );
  }

  function deleteScenario(
    client: PoolClient,
    subproblemId: number,
    callback: (error: Error) => void
  ): void {
    const query = 'DELETE FROM scenario WHERE id = $1';
    client.query(query, [subproblemId], callback);
  }

  function getScenarioIdsForSubproblem(
    subproblemId: number,
    callback: (error: Error, scenarioIds?: number[]) => void
  ): void {
    logger.debug('Getting scenario ids for: ' + subproblemId);
    const query = 'SELECT id FROM scenario WHERE subproblemId = $1';
    db.query(
      query,
      [subproblemId],
      (error: Error, result: QueryResult<{id: number}>) => {
        if (error) {
          callback(error);
        } else {
          callback(null, _.map(result.rows, 'id'));
        }
      }
    );
  }

  return {
    createDirectly: createDirectly,
    createInTransaction: createInTransaction,
    query: query,
    queryForSubProblem: queryForSubProblem,
    get: get,
    update: update,
    delete: deleteScenario,
    getScenarioIdsForSubproblem: getScenarioIdsForSubproblem
  };
}
