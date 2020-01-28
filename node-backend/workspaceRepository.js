'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /workspaces/:id');
    const query = 'SELECT id, owner, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      function(error, result) {
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

  function create(owner, title, problem, callback) {
    logger.debug('creating workspace');
    const query = 'INSERT INTO workspace (owner, title, problem) VALUES ($1, $2, $3) RETURNING id';
    db.query(
      query,
      [owner, title, problem],
      function(error, result) {
        callback(error, error || result.rows[0].id);
      }
    );
  }

  function setDefaultSubProblem(workspaceId, subproblemId, callback) {
    logger.debug('setting default subproblem for: ' + workspaceId);
    const query = 'UPDATE workspace SET defaultSubproblemId = $1 WHERE id = $2';
    db.query(
      query,
      [subproblemId, workspaceId],
      callback
    );
  }

  function getDefaultSubproblem(workspaceId, callback) {
    logger.debug('getting default subproblem id for: ' + workspaceId);
    const query = 'SELECT defaultSubproblemId FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      callback
    );
  }

  function setDefaultScenario(workspaceId, scenarioId, callback) {
    logger.debug('setting default scenario of ' + workspaceId + ' to ' + scenarioId);
    const query = 'UPDATE workspace SET defaultScenarioId = $1 WHERE id = $2';
    db.query(
      query,
      [scenarioId, workspaceId],
      callback
    );
  }

  function getDefaultScenarioId(workspaceId, callback) {
    logger.debug('getting default scenario id for: ' + workspaceId);
    const query = 'SELECT defaultScenarioId FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      function(error, result) {
        if (error) {
          callback(error);
        } else {
          callback(error, result.rows[0].defaultscenarioid);
        }
      }
    );
  }

  function getWorkspaceInfo(workspaceId, callback) {
    logger.debug('getting workspace info');
    const query = 'SELECT id, owner, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1';
    db.query(
      query,
      [workspaceId],
      function(error, result) {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback('No workspace with ID ' + workspaceId + ' found.');
        } else {
          callback(null, result.rows[0]);
        }
      }
    );
  }

  function update(title, problem, id, callback) {
    logger.debug('updating workspace');
    const query = 'UPDATE workspace SET title = $1, problem = $2 WHERE id = $3';
    db.query(
      query,
      [title, problem, id],
      callback
    );
  }

  function del(workspaceId, callback) {
    logger.debug('delete workspace');
    const query = 'DELETE FROM workspace WHERE id=$1';
    db.query(
      query,
      [workspaceId],
      callback
    );
  }

  function query(ownerId, callback) {
    const query = 'SELECT id, owner, title, problem, defaultSubproblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM Workspace WHERE owner = $1';
    db.query(
      query,
      [ownerId],
      function(error, result) {
        callback(error, error || result.rows);
      }
    );
  }

  return {
    get: get,
    create: create,
    setDefaultSubProblem: setDefaultSubProblem,
    getDefaultSubproblem: getDefaultSubproblem,
    setDefaultScenario: setDefaultScenario,
    getDefaultScenarioId: getDefaultScenarioId,
    getWorkspaceInfo: getWorkspaceInfo,
    update: update,
    delete: del,
    query: query
  };
};
