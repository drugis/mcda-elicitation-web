'use strict';
define(function(require) {
  var angular = require("angular");

  var dependencies = ['ngResource'];

  function buildUrl(url, serializedParams) {
    if (serializedParams.length > 0) {
      url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams;
    }
    return url;
  }

  var ScenarioResource = function($resource, $cacheFactory) {
    var cache = $cacheFactory('scenario');

    var resetCache = function(response) {
      cache.removeAll();
      var config = response.config;
      var url = buildUrl(config.url, config.paramSerializer(config.params));
      cache.put(url, response.resource);
      return response.resource;
    };

    var resource = $resource(
      window.config.workspacesRepositoryUrl + ':workspaceId/scenarios/:id',
      {
        id: '@id',
        workspaceId: '@workspaceId'
      }, {
        query: { method: "GET", isArray: true},
        get:   { cache: cache, method: 'GET'},
        save:  { method: "POST", interceptor: { response: resetCache }}
      });


    return resource;
  };

  return angular.module('elicit.scenarioResource', dependencies).factory('ScenarioResource', ScenarioResource);
});
