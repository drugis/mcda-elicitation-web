'use strict';
var util = require('./util');

module.exports = function(db) {
  var inProgressWorkspaceRepository = require('./inProgressWorkspaceRepository')(db);

  function create(request, response, next) {
    inProgressWorkspaceRepository.create(
      util.getUser(request).id,
      request.body,
      function(error, result) {
        util.checkForError(error, next);
        if (!error) {
          response.json({ id: result.rows[0].id });
        }
      });
  }

  function update(request, response, next) {
    inProgressWorkspaceRepository.update(request.body, request.params.id, function(error) {
      util.checkForError(error, next);
      if (!error) {
        response.end();
      }
    });
  }

  function get(request, response, next) {
    inProgressWorkspaceRepository.get(request.params.id, function(error, result) {
      util.checkForError(error, next);
      if (!error) {
        response.json(result.rows[0]);
      }
    });
  }

  function query(request, response, next) {
    inProgressWorkspaceRepository.query(util.getUser(request).id, function(error, result) {
      util.checkForError(error, next);
      if (!error) {
        response.json(result.rows);
      }
    });
  }

  function del(request, response, next) {
    db.query('DELETE FROM inProgressWorkspace WHERE id=$1', [request.params.id], function(error) {
      util.checkForError(error, next);
      if (!error) {
        response.end();
      }
    });
  }

  return {
    create: create,
    update: update,
    get: get,
    query: query,
    delete: del,
  };
};
