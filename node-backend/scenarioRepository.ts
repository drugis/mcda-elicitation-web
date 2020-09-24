import {OurError} from '@shared/interface/IError';
import IScenarioCommand from '@shared/interface/Scenario/IScenarioCommand';
import IScenarioState from '@shared/interface/Scenario/IScenarioState';
import _ from 'lodash';
import {PoolClient, QueryResult} from 'pg';
import IDB, {ClientOrDB} from './interface/IDB';
import logger from './logger';

export default function ScenarioRepository(db: IDB) {
  function createInTransaction(
    client: PoolClient,
    scenario: IScenarioCommand,
    callback: (error: OurError, id?: number) => void
  ): void {
    create(client, scenario, callback);
  }

  function createDirectly(
    scenario: IScenarioCommand,
    callback: (error: OurError, id?: number) => void
  ): void {
    create(db, scenario, callback);
  }

  function create(
    clientOrDB: ClientOrDB,
    scenario: IScenarioCommand,
    callback: (error: OurError, id?: number) => void
  ): void {
    logger.debug('Creating scenario');
    const query =
      'INSERT INTO scenario (workspace, subproblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id';
    clientOrDB.query(
      query,
      [
        scenario.workspaceId,
        scenario.subproblemId,
        scenario.title,
        scenario.state
      ],
      (error: OurError, result: QueryResult<{id: number}>) => {
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
    callback: (error: OurError, scenarios?: any[]) => void
  ): void {
    logger.debug('Getting scenarios for workspace: ' + workspaceId);
    const query =
      'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1';
    db.query(query, [workspaceId], _.partial(resultsCallback, callback));
  }

  function queryForSubProblem(
    workspaceId: string,
    subproblemId: string,
    callback: (error: OurError, scenarios?: any[]) => void
  ) {
    logger.debug(
      'getting /workspaces/' +
        workspaceId +
        '/subproblem/' +
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
    callback: (error: OurError, result?: any) => void,
    error: OurError,
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
    callback: (error: OurError, scenario?: any) => void
  ): void {
    logger.debug('Getting scenario: ' + scenarioId);
    const query =
      'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE id = $1';
    db.query(
      query,
      [scenarioId],
      (error: OurError, result: QueryResult<any>) => {
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
      }
    );
  }

  function update(
    state: IScenarioState,
    title: string,
    scenarioId: string,
    callback: (error: OurError) => void
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
    subproblemId: string,
    callback: (error: OurError) => void
  ): void {
    const query = 'DELETE FROM scenario WHERE id = $1';
    client.query(query, [subproblemId], callback);
  }

  function getScenarioIdsForSubproblem(
    subproblemId: string,
    callback: (error: OurError, scenarioIds?: string[]) => void
  ): void {
    logger.debug('Getting scenario ids for: ' + subproblemId);
    const query = 'SELECT id FROM scenario WHERE subproblemId = $1';
    db.query(
      query,
      [subproblemId],
      (error: OurError, result: QueryResult<{id: string}>) => {
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
