'use strict';
define(['angular'], function(angular) {
  var dependencies = ['ngResource'];

  var RemarksResource = function($resource) {
    return $resource('/projects/:projectId/analyses/:analysisId/remarks', {
      projectId: '@projectId',
      analysisId: '@analysisId'
    });
  };
  return angular.module('elicit.remoteRemarks', dependencies).factory('RemoteRemarks', RemarksResource);
});