'use strict';
define([],function() {
  var dependencies = ['ngResource'];
  var WorkspaceResource = function($resource) {
    return $resource(
      window.config.workspacesRepositoryUrl + ':workspaceId', {
        workspaceId: '@workspaceId'
      }, {
        create: {
          method: 'POST',
          transformRequest: function(problem) {
            return angular.toJson({
              title: problem.title,
              problem: problem
            });
          }
        },
        delete: {
          method: 'DELETE'
        }
      }
    );
  };

  return angular.module('elicit.workspaceResource', dependencies).factory('WorkspaceResource', WorkspaceResource);
});