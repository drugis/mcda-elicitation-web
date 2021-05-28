import IDefaultIdsMessage from '@shared/interface/Commands/IDefaultIdsMessage';
import {OurError} from '@shared/interface/IError';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import {PoolClient, QueryResult} from 'pg';
import IDB from './interface/IDB';
import logger from './logger';

export default function WorkspaceRepository(db: IDB) {
  function get(
    workspaceId: string,
    callback: (error: OurError, result?: IOldWorkspace) => void
  ) {
    logger.debug('GET /workspaces/:id');
    const query =
      'SELECT id, owner, title, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      (error: OurError, result: QueryResult<IOldWorkspace>) => {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback({
            message: 'No workspace with ID ' + workspaceId + ' found.',
            statusCode: 404
          });
        } else {
          callback(null, result.rows[0]);
        }
      }
    );
  }

  function create(
    client: PoolClient,
    owner: number,
    title: string,
    problem: IProblem,
    callback: (error: OurError, id?: string) => void
  ) {
    logger.debug('creating workspace');
    const query =
      'INSERT INTO workspace (owner, title, problem) VALUES ($1, $2, $3) RETURNING id';
    client.query(
      query,
      [owner, title, problem],
      (error: OurError, result: QueryResult<{id: string}>) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result.rows[0].id);
        }
      }
    );
  }

  function setDefaultSubProblem(
    client: PoolClient,
    workspaceId: string,
    subproblemId: string,
    callback: (error: OurError) => void
  ) {
    logger.debug('setting default subproblem for: ' + workspaceId);
    const query = 'UPDATE workspace SET defaultSubproblemId = $1 WHERE id = $2';
    client.query(query, [subproblemId, workspaceId], callback);
  }

  function getDefaultSubproblem(
    workspaceId: string,
    callback: (error: OurError, defaultSubproblemId?: string) => void
  ) {
    logger.debug('getting default subproblem id for: ' + workspaceId);
    const query = 'SELECT defaultSubproblemId FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      (error: OurError, result: QueryResult<{defaultsubproblemid: number}>) => {
        if (error) {
          callback(error);
        } else {
          callback(error, result.rows[0].defaultsubproblemid.toString());
        }
      }
    );
  }

  function setDefaultScenario(
    client: PoolClient,
    workspaceId: string,
    scenarioId: string,
    callback: (error: OurError) => void
  ) {
    logger.debug(
      'setting default scenario of ' + workspaceId + ' to ' + scenarioId
    );
    const query = 'UPDATE workspace SET defaultScenarioId = $1 WHERE id = $2';
    client.query(query, [scenarioId, workspaceId], callback);
  }

  function getDefaultScenarioId(
    workspaceId: string,
    callback: (error: OurError, defaultScenarioId?: string) => void
  ) {
    logger.debug('getting default scenario id for: ' + workspaceId);
    const query = 'SELECT defaultScenarioId FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      function (
        error: OurError,
        result: QueryResult<{defaultscenarioid: number}>
      ) {
        if (error) {
          callback(error);
        } else {
          callback(error, result.rows[0].defaultscenarioid.toString());
        }
      }
    );
  }

  function getWorkspaceInfo(
    client: PoolClient,
    workspaceId: string,
    callback: (error: OurError, workspaceInfo?: IWorkspaceInfo) => void
  ) {
    logger.debug('getting workspace info');
    const query =
      'SELECT id, owner, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    client.query(
      query,
      [workspaceId],
      (error: OurError, result: QueryResult<IWorkspaceInfo>) => {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback({
            statusCode: 404,
            message: 'No workspace with ID ' + workspaceId + ' found.'
          });
        } else {
          callback(null, result.rows[0]);
        }
      }
    );
  }

  function update(
    title: string,
    problem: IProblem,
    id: string,
    callback: (error: OurError) => void
  ) {
    logger.debug('updating workspace');
    const query = 'UPDATE workspace SET title = $1, problem = $2 WHERE id = $3';
    db.query(query, [title, problem, id], callback);
  }

  function del(workspaceId: string, callback: (error: OurError) => void) {
    logger.debug('delete workspace');
    const query = 'DELETE FROM workspace WHERE id=$1';
    db.query(query, [workspaceId], callback);
  }

  function query(
    ownerId: number,
    callback: (
      error: OurError,
      workspaceSummaries?: IWorkspaceSummary[]
    ) => void
  ) {
    const query = `SELECT id, owner, title, 
      (SELECT json_agg(criteria_json.value->'title') 
        FROM json_each(workspace.problem->'criteria') AS criteria_json 
        WHERE owner = 9
      ) AS criteria, 
      (SELECT json_agg(alternative_json.value->'title') 
        FROM json_each(workspace.problem->'alternatives') AS alternative_json 
        WHERE owner = 9
      ) AS alternatives, 
      defaultSubproblemId AS "defaultSubProblemId", 
      defaultScenarioId AS "defaultScenarioId", 
      creationdate AS "creationDate" 
    FROM workspace 
    WHERE owner = $1`;
    db.query(
      query,
      [ownerId],
      (error: OurError, result: QueryResult<IWorkspaceSummary>) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result.rows);
        }
      }
    );
  }

  function getDefaultIds(
    client: PoolClient,
    workspaceId: string,
    callback: (error: OurError, defaultIds?: IDefaultIdsMessage) => void
  ) {
    const query =
      'SELECT defaultSubproblemId, defaultScenarioId FROM workspace WHERE id = $1';
    client.query(
      query,
      [workspaceId],
      (
        error: OurError,
        result: QueryResult<{
          defaultsubproblemid: number;
          defaultscenarioid: number;
        }>
      ) => {
        if (error) {
          callback(error);
        } else {
          const {defaultsubproblemid, defaultscenarioid} = result.rows[0];
          callback(null, {
            subproblemId: defaultsubproblemid.toString(),
            scenarioId: defaultscenarioid.toString()
          });
        }
      }
    );
  }

  return {
    get,
    create,
    setDefaultSubProblem,
    getDefaultSubproblem,
    setDefaultScenario,
    getDefaultScenarioId,
    getDefaultIds,
    getWorkspaceInfo,
    update,
    delete: del,
    query
  };
}
