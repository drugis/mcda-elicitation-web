'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /workspaces/:id');
    const query = 'SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      callback
    );
  }

  function create(owner, title, problem, callback) {
    logger.debug('creating workspace');
    const query = 'INSERT INTO workspace (owner, title, problem) VALUES ($1, $2, $3) RETURNING id';
    db.query(
      query,
      [owner, title, problem],
      callback
    );
  }

  function setDefaultSubProblem(workspaceId, subProblemId, callback) {
    logger.debug('setting default subproblem');
    const query = 'UPDATE workspace SET defaultsubproblemId = $1 WHERE id = $2';
    db.query(query,
      [subProblemId, workspaceId],
      callback
    );
  }

  function setDefaultScenario(workspaceId, scenarioId, callback) {
    logger.debug('setting default scenario');
    const query = 'UPDATE workspace SET defaultScenarioId = $1 WHERE id = $2';
    db.query(query,
      [scenarioId, workspaceId],
      callback
    );
  }

  function getWorkspaceInfo(workspaceId, callback) {
    logger.debug('getting workspace info');
    const query = 'SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    db.query(query,
      [workspaceId],
      callback
    );
  }

  function update(title, problem, id, callback) {
    logger.debug('updating workspace');
    const query = 'UPDATE workspace SET title = $1, problem = $2 WHERE id = $3';
    db.query(query,
      [title, problem, id],
      callback
    );
  }

  function del(workspaceId, callback) {
    logger.debug('delete workspace');
    const query = 'DELETE FROM workspace WHERE id=$1';
    db.query(query,
      [workspaceId],
      callback
    );
  }

  function query(ownerId, callback) {
    const query = 'SELECT id, owner, title, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM Workspace WHERE owner = $1';
    db.query(query,
      [ownerId],
      callback
    );
  }

  return {
    get: get,
    create: create,
    setDefaultSubProblem: setDefaultSubProblem,
    setDefaultScenario: setDefaultScenario,
    getWorkspaceInfo: getWorkspaceInfo,
    update: update,
    delete: del,
    query: query
  };
};
