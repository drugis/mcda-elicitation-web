'use strict';
var util = require('./util');
var httpStatus = require('http-status-codes');

module.exports = function(db) {
  var orderingRepository = require('./orderingRepository')(db);

  function get(request, response, next) {
    orderingRepository.get(
      request.params.workspaceId,
      function(error, result) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.json({
            ordering: result
          });
        }
      });
  }

  function update(request, response, next) {
    orderingRepository.update(
      request.params.workspaceId, request.body,
      function(error) {
        if (error) {
          util.handleError(error, next);
        } else {
          response.sendStatus(httpStatus.OK);
        }
      });
  }

  return {
    get: get,
    update: update
  };
};
