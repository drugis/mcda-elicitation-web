'use strict';
var logger = require('./logger');
module.exports = function(db) {

  function getWorkspaceSettings(req, res, next) {
    logger.debug('GET /workspaces/' + req.params.workspaceId + '/workspaceSettings');

    db.query(
      'SELECT settings FROM workspaceSettings WHERE workspaceId = $1',
      [req.params.workspaceId],
      function(err, result) {
        if (err) {
          err.status = 500;
          return next(err);
        }
        res.json(result);
      }
    );
  }

  function putWorkspaceSettings(req, res, next) {
    logger.debug('PUT /workspaces/' + req.params.workspaceId + '/workspaceSettings');

    db.query(
      'INSERT INTO workspaceSettings (workspaceid, settings) VALUES ($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET settings=$2',
      [req.params.workspaceId, req.body],
      function(err) {
        if (err) {
          err.status = 500;
          return next(err);
        }
        res.end();
      }
    );
  }

  return {
    getWorkspaceSettings: getWorkspaceSettings,
    putWorkspaceSettings: putWorkspaceSettings
  };

};