'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  var dependencies = ['ngResource'];

  var WorkspaceResource = function($q, $resource, $rootScope, MCDAPataviService, ValueTreeService) {

    var resource = $resource(
      window.config.workspacesRepositoryUrl + ':workspaceId', { workspaceId: '@id' }, {
        get:    { method:'GET', interceptor: { response: ValueTreeService.addDerived }},
        save:   { method:'POST', interceptor: { response: ValueTreeService.addDerived }},
        create: { method:'POST', transformRequest: function(problem, headersGetter) {
          return angular.toJson({
            title: problem.title,
            problem: problem
          });
        }}
      }
    );

    return resource;
  };

  return angular.module('elicit.workspaceResource', dependencies).factory('WorkspaceResource', WorkspaceResource);
});
