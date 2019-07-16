'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /workspaces/:id');
    db.query('SELECT id, owner, problem, defaultSubProblemId as "defaultSubProblemId", defaultScenarioId AS "defaultScenarioId" FROM workspace WHERE id = $1',
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
  return {
    get: get
  };
};
