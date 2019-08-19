'use strict';
var logger = require('./logger');

module.exports = function(db) {
  function get(workspaceId, callback) {
    logger.debug('GET /workspaces/' + workspaceId + '/ordering');
    db.query('SELECT workspaceId AS "workspaceId", ordering FROM ordering WHERE workspaceId = $1',
      [workspaceId],
      callback);
  }

  function update(workspaceId, ordering, callback) {
    logger.debug('SET /workspaces/' + workspaceId + '/ordering/');
    db.query('INSERT INTO ordering(workspaceId, ordering) values($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET ordering=$2',
      [workspaceId, ordering],
      callback);
  }

  return {
    get: get,
    update: update
  };
};
