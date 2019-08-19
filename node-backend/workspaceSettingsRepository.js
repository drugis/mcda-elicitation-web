'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /workspaces/' + workspaceId + '/workspaceSettings');
    db.query(
      'SELECT settings FROM workspaceSettings WHERE workspaceId = $1',
      [workspaceId],
      callback);
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
