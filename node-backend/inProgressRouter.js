'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceHandler = require('./inProgressWorkspaceHandler')(db);
  return express.Router()
    .post('/', WorkspaceHandler.create)
    .put('/:id', WorkspaceHandler.update)
    .get('/:id', WorkspaceHandler.get)
    .get('/', WorkspaceHandler.query)
    .delete('/:id', WorkspaceHandler.delete)
    ;
};
