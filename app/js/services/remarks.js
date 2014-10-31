'use strict';
define(['angular','angular-resource'], function(angular) {
  var dependencies = ['ngResource'];

  var RemarksResource = function($resource) {
    return $resource(window.config.workspacesRepositoryUrl + ':workspaceId/remarks', {
      workspaceId: '@workspaceId'
    });
  };
  return angular.module('elicit.remarks', dependencies).factory('RemarksResource', RemarksResource);
});