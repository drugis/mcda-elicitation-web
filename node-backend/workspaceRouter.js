'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceService = require('./workspaceService')(db);
  return express.Router()
    .get('/', WorkspaceService.query)
    .post('/', WorkspaceService.create)
    .get('/:id', WorkspaceService.get)
    .post('/:id', WorkspaceService.update)
    .delete('/:id', WorkspaceService.delete)
    ;
};
