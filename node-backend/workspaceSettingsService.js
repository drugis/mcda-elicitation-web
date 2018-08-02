'use strict';
var logger = require('./logger');
var async = require('async');
module.exports = function(db) {

  function getWorkspaceSettings(req, res, next) {
    logger.debug('GET /workspaces/' + req.params.workspaceId + '/workspaceSettings');

    function getSettings(callback) {
      db.query('SELECT settings FROM workspaceSettings WHERE workspaceId = $1',
        [req.params.workspaceId], function(err, result) {
          if (err) {
            return callback(err);
          }
          callback(null, result.rows[0] ? result.rows[0].settings : undefined);
        });
    }
    
    function getToggledColumns(settings, callback) {
      db.query('SELECT toggledColumns AS "toggledColumns", toggledColumns FROM toggledColumns WHERE workspaceId = $1',
        [req.params.workspaceId], function(err, result) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            settings: settings,
            toggledColumns: result.rows[0] ? result.rows[0].toggledColumns : undefined
          });
        });
    }

    function callback(err, result) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.json(result);
    }

    async.waterfall([getSettings, getToggledColumns], callback);
  }

  function postWorkspaceSettings(req, res, next) {
    logger.debug('POST /workspaces/' + req.params.workspaceId + '/workspaceSettings');

    function updateSettings(callback) {
      db.query('INSERT INTO workspaceSettings (workspaceid, settings) VALUES ($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET settings=$2',
        [req.params.workspaceId, req.body.settings], function(err) {
          if (err) {
            return callback(err);
          }
          callback(null);
        }
      );
    }

    function updateToggledColumns(callback) {
      db.query('INSERT INTO toggledColumns (workspaceid, toggledColumns) VALUES ($1, $2) ON CONFLICT(workspaceId) DO UPDATE SET toggledColumns=$2',
        [req.params.workspaceId, req.body.toggledColumns], callback);
    }

    function callback(err) {
      if (err) {
        err.status = 500;
        return next(err);
      }
      res.end();
    }

    async.waterfall([updateSettings, updateToggledColumns], callback);

  }

  return {
    getWorkspaceSettings: getWorkspaceSettings,
    postWorkspaceSettings: postWorkspaceSettings
  };

};
