'use strict';
define(['angular'], function(angular) {

  var dependencies = ['ngResource'];

  var SubProblemResource = function($resource) {
    var resource = $resource(
      window.config.workspacesRepositoryUrl + ':workspaceId/problems/:problemId', {
      problemId: '@problemId',
      workspaceId: '@workspaceId'
    }, {
      get: {
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });

    return resource;
  };

  return angular.module('elicit.subProblemResource', dependencies)
    .factory('SubProblemResource', ['$resource', SubProblemResource]);
});
