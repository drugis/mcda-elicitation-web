'use strict';
import logger from './loggerTS';
import {Error} from '@shared/interface/IError';
import _ from 'lodash';

export default function SubproblemRepository(db: any) {
  function create(
    client: any,
    workspaceId: string,
    title: string,
    definition: any,
    callback: (error: Error, subproblemId?: number) => void
  ): void {
    logger.debug('creating subproblem');
    const query =
      'INSERT INTO subproblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id';
    client.query(
      query,
      [workspaceId, title, definition],
      (error: Error, result: {rows: [{id: number}]}) => {
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
    subproblemId: number,
    callback: (error: Error, subproblem?: any) => void
  ): void {
    logger.debug('retrieving subproblem ' + subproblemId);
    const query =
      'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1 AND id = $2';
    db.query(
      query,
      [workspaceId, subproblemId],
      (error: Error, result: {rows: [any]}) => {
        if (error) {
          callback(error);
        } else {
          callback(null, result.rows[0]);
        }
      }
    );
  }

  function query(
    workspaceId: string,
    callback: (error: Error, subproblems?: any[]) => void
  ): void {
    logger.debug('retrieving subproblems for workspace: ' + workspaceId);
    const query =
      'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1';
    db.query(query, [workspaceId], (error: Error, result: {rows: any[]}) => {
      if (error) {
        callback(error);
      } else {
        callback(null, result.rows);
      }
    });
  }

  function update(
    definition: any,
    title: string,
    subproblemId: string,
    callback: (error: Error, result: any) => void
  ): void {
    logger.debug('updating subproblem: ' + subproblemId);
    const query =
      'UPDATE subproblem SET definition = $1, title = $2 WHERE id = $3';
    db.query(query, [definition, title, subproblemId], callback);
  }

  function deleteSubproblem(
    client: any,
    subproblemId: number,
    callback: (error: Error) => void
  ): void {
    logger.debug('deleting subproblem: ' + subproblemId);
    const query = 'DELETE FROM subproblem WHERE id = $1';
    client.query(query, [subproblemId], callback);
  }

  function getSubproblemIds(
    workspaceId: string,
    callback: (error: Error, subproblemIds?: string[]) => void
  ): void {
    logger.debug('Getting subproblem ids for workspace: ' + workspaceId);
    const query = 'SELECT id FROM subproblem WHERE workspaceid = $1';
    db.query(query, [workspaceId], function (
      error: Error,
      result: {rows: string[]}
    ) {
      if (error) {
        callback(error);
      } else {
        callback(null, _.map(result.rows, 'id'));
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
