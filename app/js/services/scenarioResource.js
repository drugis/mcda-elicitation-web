'use strict';
define(function(require) {
  var angular = require("angular");

  var dependencies = ['ngResource'];

  var ScenarioResource = function($resource) {
    return $resource(window.config.workspacesRepositoryUrl + ':workspaceId/scenarios/:id', {
      id: '@id',
      workspaceId: '@workspaceId'
    });

  };

  return angular.module('elicit.scenarioResource', dependencies).factory('ScenarioResource', ScenarioResource);
});
