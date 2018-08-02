'use strict';
define(['angular'], function(angular) {
  var dependencies = ['ngResource'];
  var WorkspaceSettingsResource = function($resource) {
    return $resource('/workspaces/:workspaceId/workspaceSettings', {
      workspaceId: '@workspaceId'
    });
  };
  return angular.module('elicit.workspaceSettingsResource', dependencies).factory('WorkspaceSettingsResource', WorkspaceSettingsResource);
});
