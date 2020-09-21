'use strict';
define(['angular'], function (angular) {
  var dependencies = ['ngResource'];

  var ScenarioResource = function ($resource) {
    return $resource(
      window.config.workspacesRepositoryUrl +
        ':workspaceId/problems/:problemId/scenarios/:id',
      {
        id: '@id',
        workspaceId: '@workspaceId',
        problemId: '@problemId'
      },
      {
        query: {
          method: 'GET',
          isArray: true
        },
        get: {
          method: 'GET'
        },
        save: {
          method: 'POST'
        }
      }
    );
  };

  return angular
    .module('elicit.scenarioResource', dependencies)
    .factory('ScenarioResource', ['$resource', ScenarioResource]);
});
