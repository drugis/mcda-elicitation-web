'use strict';
define(['angular'], function(angular) {
  var dependencies = ['ngResource'];
  var ToggleColumnsResource = function($resource) {
    return $resource(
      window.config.workspacesRepositoryUrl + ':workspaceId/toggledColumns', {
        workspaceId: '@workspaceId'
      }
    );
  };
  return angular.module('elicit.toggleColumnsResource', dependencies).factory('ToggleColumnsResource', ToggleColumnsResource);
});