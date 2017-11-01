'use strict';
define(function(require) {
  var angular = require('angular');
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
        }
      }
    );
  };

  return angular.module('elicit.workspaceResource', dependencies).factory('WorkspaceResource', WorkspaceResource);
});