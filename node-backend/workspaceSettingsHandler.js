'use strict';
var util = require('./util');
var httpStatus = require('http-status-codes');

module.exports = function(db) {
  var workspaceSettingsRepository = require('./workspaceSettingsRepository')(db);

  function get(request, response, next) {
    workspaceSettingsRepository.get(
      request.params.workspaceId,
      function(error, result) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.json(result);
        }
      }
    );
  }

  function put(request, response, next) {
    workspaceSettingsRepository.put(
      request.params.workspaceId,
      request.body,
      function(error) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.sendStatus(httpStatus.OK);
        }
      }
    );
  }

  return {
    get: get,
    put: put
  };
};
