'use strict';
define(['angular'], function(angular) {
  var dependencies = ['ngResource'];
  var WorkspaceSettingsResource = function($resource) {
    return $resource('/workspaces/:workspaceId/workspaceSettings', {
      workspaceId: '@workspaceId'
    }, {
        put: {
          method: 'PUT'
        }
      });
  };
  return angular.module('elicit.workspaceSettingsResource', dependencies)
    .factory('WorkspaceSettingsResource', ['$resource', WorkspaceSettingsResource]);
});
