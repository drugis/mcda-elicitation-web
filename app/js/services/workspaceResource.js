define(['angular'],
  function(angular) {
    var dependencies = ['ngResource'];

    var WorkspaceResource = function($resource) {
      return $resource(config.workspacesRepositoryUrl + ':workspaceId', {
        workspaceId: '@id'
      });
    };

    return angular.module('elicit.workspaceResource', dependencies).factory('WorkspaceResource', WorkspaceResource);
  });
