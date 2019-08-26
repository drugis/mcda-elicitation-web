'use strict';
var util = require('./util');
var httpStatus = require('http-status-codes');

module.exports = function(db) {
  var inProgressWorkspaceRepository = require('./inProgressWorkspaceRepository')(db);

  function create(request, response, next) {
    inProgressWorkspaceRepository.create(
      util.getUser(request).id,
      request.body,
      function(error, result) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.status(httpStatus.CREATED);
          response.json({ id: result.rows[0].id });
        }
      });
  }

  function update(request, response, next) {
    inProgressWorkspaceRepository.update(request.body, request.params.id, function(error) {
      if (error) {
        util.handleError(error, next);
      } else {
        response.sendStatus(httpStatus.OK);
      }
    });
  }

  function get(request, response, next) {
    inProgressWorkspaceRepository.get(request.params.id, function(error, result) {
      if (error) {
        util.handleError(error, next);
      } else {
        response.json(result.rows[0]);
      }
    });
  }

  function query(request, response, next) {
    inProgressWorkspaceRepository.query(util.getUser(request).id, function(error, result) {
      if (error) {
        util.handleError(error, next);
      } else {
        response.json(result.rows);
      }
    });
  }

  function del(request, response, next) {
    inProgressWorkspaceRepository.delete(request.params.id, function(error) {
      if (error) {
        util.handleError(error, next);
      } else {
        response.sendStatus(httpStatus.OK);
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
