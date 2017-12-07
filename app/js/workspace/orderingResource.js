'use strict';
define([], function() {
  var dependencies = ['$resource'];
  var OrderingResource = function($resource) {
    return $resource('/workspaces/:workspaceId/ordering', {
      workspaceId: '@workspaceId'
    }, {
      put: {
        method: 'PUT'
      }
    });
  };
  return dependencies.concat(OrderingResource);
});