'use strict';
var express = require('express');

module.exports = function(db) {
  var WorkspaceSettingsService = require('./workspaceSettingsService')(db);
  return express.Router()
    .get('/', WorkspaceSettingsService.get)
    .put('/', WorkspaceSettingsService.put)
    ;
};
