'use strict';
var express = require('express');

module.exports = function(db) {
  var SubProblemHandler = require('./subProblemHandler')(db);
  return express.Router()
    .get('/:workspaceId/problems/', SubProblemHandler.query)
    .get('/:workspaceId/problems/:subProblemId', SubProblemHandler.get)
    .post('/:workspaceId/problems/', SubProblemHandler.create)
    .post('/:workspaceId/problems/:subProblemId', SubProblemHandler.update)
    ;
};
