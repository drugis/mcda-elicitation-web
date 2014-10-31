define(['angular'],
  function(angular) {
    var dependencies = ['ngResource'];

    var ScenarioResource = function($resource) {
      return $resource(config.workspacesRepositoryUrl + ':workspaceId/scenarios/:id', {
        id: '@id',
        workspaceId: '@workspaceId'
      });

    };

    return angular.module('elicit.scenarioResource', dependencies).factory('ScenarioResource', ScenarioResource);
  });