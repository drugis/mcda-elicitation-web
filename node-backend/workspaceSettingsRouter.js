'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceSettingsHandler = require('./workspaceSettingsHandler')(db);
  return express.Router()
    .get('/:workspaceId/workspaceSettings', WorkspaceSettingsHandler.get)
    .put('/:workspaceId/workspaceSettings', WorkspaceSettingsHandler.put)
    ;
};
