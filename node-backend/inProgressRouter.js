'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceService = require('./workspaceService')(db);
  return express.Router()
    .post('/', WorkspaceService.createInProgress)
    .put('/:id', WorkspaceService.updateInProgress)
    .get('/:id', WorkspaceService.getInProgress)
    .get('/', WorkspaceService.queryInProgress)
    .delete('/:id', WorkspaceService.deleteInProgress)
    ;
};
