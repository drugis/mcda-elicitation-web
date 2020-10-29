import {OurError} from '@shared/interface/IError';
import ISubproblemRange from '@shared/interface/ISubproblemRange';
import IOldSubproblem from 'app/ts/interface/IOldSubproblem';
import _ from 'lodash';
import {PoolClient, QueryResult} from 'pg';
import IDB from './interface/IDB';
import logger from './logger';

export default function SubproblemRepository(db: IDB) {
  function create(
    client: PoolClient,
    workspaceId: string,
    title: string,
    definition: any,
    callback: (error: OurError, subproblemId?: string) => void
  ): void {
    logger.debug('creating subproblem');
    const query =
      'INSERT INTO subproblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id';
    client.query(
      query,
      [workspaceId, title, definition],
      (error: OurError, result: QueryResult<{id: string}>): void => {
        if (error) {
          callback(error);
        } else {
          callback(null, result.rows[0].id);
        }
      }
    );
  }

  function get(
    workspaceId: string,
    subproblemId: string,
    callback: (error: OurError, subproblem?: any) => void
  ): void {
    logger.debug('retrieving subproblem ' + subproblemId);
    const query =
      'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1 AND id = $2';
    db.query(
      query,
      [workspaceId, subproblemId],
      (error: OurError, result: QueryResult<any>) => {
        if (error) {
          callback(error);
        } else {
          callback(null, formatSubproblem(result.rows[0]));
        }
      }
    );
  }

  function formatSubproblem(subproblem: IOldSubproblem) {
    const excludedCriteria = subproblem.definition.excludedCriteria
      ? subproblem.definition.excludedCriteria
      : [];
    const excludedDataSources = subproblem.definition.excludedDataSources
      ? subproblem.definition.excludedDataSources
      : [];
    const excludedAlternatives = subproblem.definition.excludedAlternatives
      ? subproblem.definition.excludedAlternatives
      : [];
    const ranges = formatRanges(subproblem.definition.ranges);
    return {
      ...subproblem,
      definition: {
        excludedCriteria: excludedCriteria,
        excludedDatasources: excludedDataSources,
        excludedAlternatives: excludedAlternatives,
        ranges: ranges
      }
    };
  }

  function formatRanges(
    ranges: Record<string, ISubproblemRange> | Record<string, [number, number]>
  ): Record<string, [number, number]> {
    return _.mapValues(ranges, (range: any) => {
      return range.pvf ? range.pvf.range : range;
    });
  }

  function query(
    workspaceId: string,
    callback: (error: OurError, subproblems?: any[]) => void
  ): void {
    logger.debug('retrieving subproblems for workspace: ' + workspaceId);
    const query =
      'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1';
    db.query(
      query,
      [workspaceId],
      (error: OurError, result: QueryResult<any>) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result.rows);
        }
      }
    );
  }

  function update(
    definition: any,
    title: string,
    subproblemId: string,
    callback: (error: OurError, result: any) => void
  ): void {
    logger.debug('updating subproblem: ' + subproblemId);
    const query =
      'UPDATE subproblem SET definition = $1, title = $2 WHERE id = $3';
    db.query(query, [definition, title, subproblemId], callback);
  }

  function deleteSubproblem(
    client: PoolClient,
    subproblemId: string,
    callback: (error: OurError) => void
  ): void {
    logger.debug('deleting subproblem: ' + subproblemId);
    const query = 'DELETE FROM subproblem WHERE id = $1';
    client.query(query, [subproblemId], callback);
  }

  function getSubproblemIds(
    workspaceId: string,
    callback: (error: OurError, subproblemIds?: string[]) => void
  ): void {
    logger.debug('Getting subproblem ids for workspace: ' + workspaceId);
    const query = 'SELECT id FROM subproblem WHERE workspaceid = $1';
    db.query(query, [workspaceId], function (
      error: OurError,
      result: QueryResult<{id: number}>
    ): void {
      if (error) {
        callback(error);
      } else {
        callback(
          null,
          _.map(result.rows, (row) => {
            return row.id.toString();
          })
        );
      }
    });
  }

  return {
    create: create,
    get: get,
    query: query,
    update: update,
    delete: deleteSubproblem,
    getSubproblemIds: getSubproblemIds
  };
}
