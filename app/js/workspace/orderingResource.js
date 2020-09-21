'use strict';
define(['angular'], function (angular) {
  var dependencies = ['ngResource'];
  var OrderingResource = function ($resource) {
    return $resource(
      '/workspaces/:workspaceId/ordering',
      {
        workspaceId: '@workspaceId'
      },
      {
        put: {
          method: 'PUT'
        }
      }
    );
  };
  return angular
    .module('elicit.orderingResource', dependencies)
    .factory('OrderingResource', ['$resource', OrderingResource]);
});
