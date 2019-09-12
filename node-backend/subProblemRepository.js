'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function create(workspaceId, title, definition, callback) {
    logger.debug('creating subproblem');
    const query = 'INSERT INTO subProblem (workspaceid, title, definition) VALUES ($1, $2, $3) RETURNING id';
    db.query(
      query,
      [workspaceId, title, definition],
      callback
    );
  }

  function get(workspaceId, subproblemId, callback) {
    logger.debug('retrieving subproblem ' + subproblemId);
    const query = 'SELECT id, workspaceId AS "workspaceId", title, definition FROM subProblem WHERE workspaceId = $1 AND id = $2';
    db.query(
      query,
      [workspaceId, subproblemId],
      callback
    );
  }


  function query(workspaceId, callback) {
    logger.debug('retrieving subproblems for workspace: ' + workspaceId);
    const query = 'SELECT id, workspaceId AS "workspaceId", title, definition FROM subProblem WHERE workspaceId = $1';
    db.query(
      query,
      [workspaceId],
      callback
    );
  }

  function update(definition, title, subproblemId, callback) {
    logger.debug('updating subproblem: ' + subproblemId);
    const query = 'UPDATE subProblem SET definition = $1, title = $2 WHERE id = $3';
    db.query(
      query,
      [definition, title, subproblemId],
      callback
    );
  }

  return {
    create: create,
    get: get,
    query: query,
    update: update
  };
};
