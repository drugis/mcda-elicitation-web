'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');

  var dependencies = ['$scope', '$state', '$modal', '$resource', 'mcdaRootPath', 'WorkspaceResource'];

  var ChooseProblemController = function($scope, $state, $modal, $resource, mcdaRootPath, WorkspaceResource) {
    $scope.model = {};
    $scope.local = {};

    $scope.openChooseProblemModal = openChooseProblemModal;

    function openChooseProblemModal() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/workspace/createWorkspace.html',
        controller: 'CreateWorkspaceController',
        resolve: {
          callback: function() {
            return function(workspaceType, workspace) {
              if (workspaceType === 'manual') {
                $state.go('manualInput');
              } else {
                $state.go('evidence', {
                  workspaceId: workspace.id,
                  problemId: workspace.defaultSubProblemId,
                  id: workspace.defaultScenarioId
                });
              }
            };
          }
        }
      });
    }

    $scope.$watch('local.contents', function(newVal) {
      if (!_.isEmpty(newVal)) {
        $scope.model.choice = 'local';
      }
    });

    $scope.workspacesList = WorkspaceResource.query();

    $scope.chooseProblemModal = {};
  };
  return dependencies.concat(ChooseProblemController);
});