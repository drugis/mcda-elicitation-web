'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /workspaces/:id');
    var query = 'SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    db.query(query,
      [workspaceId],
      function(error, result) {
        if (error) {
          logger.error('error retrieving workspace, error: ' + error);
          callback(error);
        } else {
          callback(error, result.rows[0]);
        }
      });
  }

  function create(owner, title, problem, callback) {
    logger.debug('creating workspace');
    var query = 'INSERT INTO workspace (owner, title, problem) VALUES ($1, $2, $3) RETURNING id';
    db.query(query,
      [owner, title, problem],
      function(error, result) {
        if (error) {
          logger.error('error creating workspace, error: ' + error);
          return callback(error);
        } else {
          callback(null, result.rows[0].id);
        }
      });
  }

  function setDefaultSubProblem(workspaceId, subProblemId, callback) {
    logger.debug('setting default subproblem');
    const query = 'UPDATE workspace SET defaultsubproblemId = $1 WHERE id = $2';
    db.query(query, [subProblemId, workspaceId],
      function(error) {
        callback(error, workspaceId, subProblemId);
      });
  }

  function setDefaultScenario(workspaceId, scenarioId, callback) {
    logger.debug('setting default scenario');
    const query = 'UPDATE workspace SET defaultScenarioId = $1 WHERE id = $2';
    db.query(query,
      [scenarioId, workspaceId],
      function(error) {
        callback(error, workspaceId);
      });
  }

  function getWorkspaceInfo(workspaceId, callback) {
    logger.debug('getting workspace info');
    const query = 'SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    db.query(query,
      [workspaceId],
      function(error, result) {
        if (error) {
          callback(error);
        } else {
          callback(null, result.rows[0]);
        }
      });
  }

  return {
    get: get,
    create: create,
    setDefaultSubProblem: setDefaultSubProblem,
    setDefaultScenario: setDefaultScenario,
    getWorkspaceInfo: getWorkspaceInfo
  };
};
