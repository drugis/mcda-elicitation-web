'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /workspaces/' + workspaceId + '/workspaceSettings');
    db.query(
      'SELECT settings FROM workspaceSettings WHERE workspaceId = $1',
      [workspaceId],
      function(error, result) {
        if (error) {
          callback(error);
        } else if (!result.rows.length) {
          callback(null, {});
        } else {
          callback(null, result.rows[0].settings);
        }
      });
  }

  function put(workspaceId, settings, callback) {
    logger.debug('PUT /workspaces/' + workspaceId + '/workspaceSettings');
    db.query(
      'INSERT INTO workspaceSettings (workspaceid, settings) VALUES ($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET settings=$2',
      [workspaceId, settings],
      callback);
  }

  return {
    get: get,
    put: put
  };
};
