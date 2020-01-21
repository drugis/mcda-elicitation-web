'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function create(workspaceId, title, definition, callback) {
    logger.debug('creating subproblem');
    const query = 'INSERT INTO subproblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id';
    db.query(
      query,
      [workspaceId, title, definition],
      callback
    );
  }

  function get(workspaceId, subproblemId, callback) {
    logger.debug('retrieving subproblem ' + subproblemId);
    const query = 'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1 AND id = $2';
    db.query(
      query,
      [workspaceId, subproblemId],
      callback
    );
  }


  function query(workspaceId, callback) {
    logger.debug('retrieving subproblems for workspace: ' + workspaceId);
    const query = 'SELECT id, workspaceId AS "workspaceId", title, definition FROM subproblem WHERE workspaceId = $1';
    db.query(
      query,
      [workspaceId],
      callback
    );
  }

  function update(definition, title, subproblemId, callback) {
    logger.debug('updating subproblem: ' + subproblemId);
    const query = 'UPDATE subproblem SET definition = $1, title = $2 WHERE id = $3';
    db.query(
      query,
      [definition, title, subproblemId],
      callback
    );
  }

  function deleteSubproblem(subproblemId, callback) {
    logger.debug('deleting subproblem: ' + subproblemId);
    const query = 'DELETE FROM subproblem WHERE id = $1';
    db.query(
      query,
      [subproblemId],
      callback
    );
  }

  function getSubproblemIds(workspaceId, callback) {
    logger.debug('Getting subproblem ids for workspace: ' + workspaceId);
    const query = 'SELECT id FROM subproblem WHERE workspaceid = $1';
    db.query(
      query,
      [workspaceId],
      callback
    );
  }

  return {
    create: create,
    get: get,
    query: query,
    update: update,
    delete: deleteSubproblem,
    getSubproblemIds: getSubproblemIds
  };
};
