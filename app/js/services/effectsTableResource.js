'use strict';
define(function(require) {
  var angular = require('angular');

  var dependencies = ['ngResource'];

  var EffectsTableResource = function($resource) {
    return $resource('/projects/:projectId/analyses/:workspaceId/effectsTable', {
      projectId: '@projectId',
      workspaceId: '@workspaceId'
    }, {
      setEffectsTableVisibility: {
        url: '/projects/:projectId/analyses/:workspaceId/effectsTable',
        method: 'POST'
      }, getEffectsTableVisibility: {
        url: '/projects/:projectId/analyses/:workspaceId/effectsTable',
        method: 'GET'
      }
    });
  };

  return angular.module('elicit.effectsTableResource', dependencies).factory('EffectsTableResource', EffectsTableResource);
});


// 'use strict';
// define([], function() {
//   var dependencies = ['$resource'];
//   var AnalysisResource = function($resource) {
//     return $resource('/projects/:projectId/analyses/:analysisId', {
//       projectId: '@projectId',
//       analysisId: '@id',
//       modelId: '@modelId',
//       outcomeIds: '@outcomeIds'
//     }, {
//       setPrimaryModel: {
//         url: '/projects/:projectId/analyses/:analysisId/setPrimaryModel',
//         method: 'POST'
//       },
//       setArchived: {
//         url: '/projects/:projectId/analyses/:analysisId/setArchivedStatus',
//         method: 'POST'
//       }
//     });
//   };
//   return dependencies.concat(AnalysisResource);
// });
