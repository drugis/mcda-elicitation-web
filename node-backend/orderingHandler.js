'use strict';
var util = require('./util');

module.exports = function(db) {
  var orderingRepository = require('./orderingRepository')(db);

  function get(req, res, next) {
    orderingRepository.get(req.params.workspaceId, function(error, result) {
      util.checkForError(error, next);
      if (!error) {
        res.json({
          ordering: result.rows[0] ? result.rows[0].ordering : undefined
        });
      }
    });
  }

  function update(req, res, next) {
    orderingRepository.update(req.params.workspaceId, req.body, function(error) {
      util.checkForError(error, next);
      if (!error) {
        res.end();
      }
    });
  }

  return {
    get: get,
    update: update
  };
};
