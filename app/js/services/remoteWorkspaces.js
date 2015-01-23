define(['angular'],
  function(angular) {
    var dependencies = ['ngResource'];

    var Workspaces = function($resource) {
      var WorkspaceResource = $resource(config.workspacesRepositoryUrl + ':workspaceId', {
        workspaceId: '@id'
      });
    };

    return angular.module('elicit.remoteWorkspaces', dependencies).factory('WorkspaceResource', Workspaces);
  });
