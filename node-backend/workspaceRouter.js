'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceHandler = require('./workspaceHandler')(db);
  return express.Router()
    .get('/', WorkspaceHandler.query)
    .post('/', WorkspaceHandler.create)
    .get('/:id', WorkspaceHandler.get)
    .post('/:id', WorkspaceHandler.update)
    .delete('/:id', WorkspaceHandler.delete)
    ;
};
