'use strict';
define(['angular'], function(angular) {

  var dependencies = ['ngResource'];

  function buildUrl(url, serializedParams) {
    if (serializedParams.length > 0) {
      url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
    }
    return url;
  }

  var SubProblemResource = function($resource, $cacheFactory) {
    var cache = $cacheFactory('subProblem');

    var resetCache = function(response) {
      cache.removeAll();
      var config = response.config;
      var url = buildUrl(config.url, config.paramSerializer(config.params));
      cache.put(url, response.resource);
      return response.resource;
    };

    var resource = $resource(
      window.config.workspacesRepositoryUrl + ':workspaceId/problems/:problemId', {
        problemId: '@problemId',
        workspaceId: '@workspaceId'
      }, {
        get: {
          cache: cache,
          method: 'GET'
        },
        save: {
          method: 'POST',
          interceptor: {
            response: resetCache
          }
        }
      });


    return resource;
  };

  return angular.module('elicit.subProblemResource', dependencies).factory('SubProblemResource', SubProblemResource);
});
