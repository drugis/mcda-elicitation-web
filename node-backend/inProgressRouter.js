'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceService = require('./inProgressWorkspaceService')(db);
  return express.Router()
    .post('/', WorkspaceService.create)
    .put('/:id', WorkspaceService.update)
    .get('/:id', WorkspaceService.get)
    .get('/', WorkspaceService.query)
    .delete('/:id', WorkspaceService.delete)
    ;
};
