'use strict';
define(function(require) {
  var angular = require("angular");

  var dependencies = ['ngResource'];

  var RemarksResource = function($resource) {
    return $resource(window.config.workspacesRepositoryUrl + ':workspaceId/remarks', {
      workspaceId: '@workspaceId'
    });
  };
  return angular.module('elicit.remarks', dependencies).factory('RemarksResource', RemarksResource);
});
