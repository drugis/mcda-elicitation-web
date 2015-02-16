'use strict';
define(function(require) {
  var angular = require("angular");

  var dependencies = ['ngResource'];

  var RemarksResource = function($resource) {
    return $resource('/projects/:projectId/analyses/:workspaceId/remarks', {
      projectId: '@projectId',
      workspaceId: '@workspaceId'
    });
  };

  return angular.module('elicit.remoteRemarks', dependencies).factory('Remarks', RemarksResource);
});
