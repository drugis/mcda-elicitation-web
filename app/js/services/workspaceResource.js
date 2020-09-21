'use strict';
define(['angular'], function (angular) {
  var WorkspaceResource = function ($resource) {
    return $resource(
      window.config.workspacesRepositoryUrl + ':workspaceId',
      {
        workspaceId: '@workspaceId'
      },
      {
        create: {
          method: 'POST',
          transformRequest: function (problem) {
            return angular.toJson({
              title: problem.title,
              problem: problem
            });
          }
        }
      }
    );
  };
  return angular
    .module('elicit.workspaceResource', ['ngResource'])
    .factory('WorkspaceResource', ['$resource', WorkspaceResource]);
});
