'use strict';
var util = require('./util');
module.exports = function(db) {
  var workspaceSettingsRepository = require('./workspaceSettingsRepository')(db);

  function get(req, res, next) {
    workspaceSettingsRepository.get(req.params.workspaceId,
      function(error, result) {
        if (error) {
          util.checkForError(error, next);
        } else {
          res.json(result.rows.length ? result.rows[0].settings : {});
        }
      }
    );
  }

  function put(req, res, next) {
    workspaceSettingsRepository.put(req.params.workspaceId,
      req.body,
      function(error) {
        if (error) {
          util.checkForError(error, next);
        } else {
          res.end();
        }
      }
    );
  }

  return {
    get: get,
    put: put
  };

};
