'use strict';
define(function() {

  var dependencies = ['$resource'];

  var EffectsTableResource = function($resource) {
    return $resource('/projects/:projectId/analyses/:workspaceId/effectsTable', {
      projectId: '@projectId',
      workspaceId: '@workspaceId'
    }, {
      setPairOfEffectsTable: {
        url: '/projects/:projectId/analyses/:workspaceId/effectsTable',
        method: 'POST'
      }, getEffectsTable: {
        url: '/projects/:projectId/analyses/:workspaceId/effectsTable',
        method: 'GET'
      }
    });
  };

  return dependencies.concat(EffectsTableResource);
});