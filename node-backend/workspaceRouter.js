'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceService = require('./workspaceService')(db);
  return express.Router()
    .get('/', WorkspaceService.queryWorkspaces)
    .post('/', WorkspaceService.createWorkspace)
    .get('/:id', WorkspaceService.getWorkspace)
    .post('/:id', WorkspaceService.updateWorkspace)
    .delete('/:id', WorkspaceService.deleteWorkspace)
    ;
};
