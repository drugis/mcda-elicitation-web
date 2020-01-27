'use strict';
var logger = require('./logger');
const _ = require('lodash');

module.exports = function(db) {
  function create(workspaceId, subproblemId, title, state, callback) {
    logger.debug('Creating scenario');
    const query = 'INSERT INTO scenario (workspace, subProblemId, title, state) VALUES ($1, $2, $3, $4) RETURNING id';
    db.query(query,
      [workspaceId, subproblemId, title, state],
      function(error, result) {
        callback(error, error || result.rows[0]);
      }
    );
  }

  function query(workspaceId, callback) {
    logger.debug('Getting scenarios for workspace: ' + workspaceId);
    const query = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1';
    db.query(
      query,
      [workspaceId],
      function(error, result) {
        callback(error, error || result.rows);
      });
  }

  function queryForSubProblem(workspaceId, subproblemId, callback) {
    logger.debug('getting /workspaces/' + workspaceId + '/subProblem/' + subproblemId + '/scenarios');
    const query = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE workspace = $1 AND subProblemId = $2';
    db.query(
      query,
      [workspaceId, subproblemId],
      function(error, result) {
        callback(error, error || result.rows);
      });
  }

  function get(scenarioId, callback) {
    logger.debug('Getting scenario: ' + scenarioId);
    const query = 'SELECT id, title, state, subproblemId AS "subProblemId", workspace AS "workspaceId" FROM scenario WHERE id = $1';
    db.query(
      query,
      [scenarioId],
      function(error, result) {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback('No scenario with ID ' + scenarioId + ' found.');
        } else {
          callback(null, result.rows[0]);
        }
      }
    );
  }

  function update(state, title, scenarioId, callback) {
    logger.debug('updating scenario:' + scenarioId);
    const query = 'UPDATE scenario SET state = $1, title = $2 WHERE id = $3';
    db.query(
      query,
      [{
        problem: state.problem,
        prefs: state.prefs,
        legend: state.legend,
        uncertaintyOptions: state.uncertaintyOptions
      },
        title,
        scenarioId
      ],
      callback
    );
  }

  function deleteScenario(subproblemId, callback) {
    const query = 'DELETE FROM scenario WHERE id = $1';
    db.query(
      query,
      [subproblemId],
      callback
    );
  }

  function getScenarioIdsForSubproblem(subproblemId, callback) {
    logger.debug('Getting scenario ids for: ' + subproblemId);
    const query = 'SELECT id FROM scenario WHERE subproblemId = $1';
    db.query(
      query,
      [subproblemId],
      function(error, result) {
        callback(error, error || _.map(result.rows, 'id'));
      }
    );
  }

  return {
    create: create,
    query: query,
    queryForSubProblem: queryForSubProblem,
    get: get,
    update: update,
    delete: deleteScenario,
    getScenarioIdsForSubproblem: getScenarioIdsForSubproblem
  };
};
