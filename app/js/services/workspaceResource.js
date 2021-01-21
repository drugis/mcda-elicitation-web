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
          transformRequest: function (command) {
            return angular.toJson({
              ranges: command.ranges,
              pvfs: command.pvfs,
              title: command.workspace.title,
              problem: command.workspace
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
