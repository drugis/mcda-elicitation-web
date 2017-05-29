'use strict';
define(function(require) {
  var dependencies = ['ngResource'];
  var angular = require('angular');
  var EffectsTableResource = function($resource) {
    return $resource(window.config.workspacesRepositoryUrl + ':workspaceId/effectsTable', {
      workspaceId: '@workspaceId'
    }, {
      'setEffectsTableInclusions': {
        url: window.config.workspacesRepositoryUrl + ':workspaceId/effectsTable',
        method: 'POST'
      }
    });
  };
  return angular.module('elicit.effectsTableResource', dependencies)
    .factory('EffectsTableResource', EffectsTableResource);
});
