'use strict';
define(function(require) {
  var _ = require('lodash');

  var dependencies = ['$scope', '$state', '$modal', 'mcdaRootPath', 'WorkspaceResource'];

  var ChooseProblemController = function($scope, $state, $modal, mcdaRootPath, WorkspaceResource) {
    // functions
    $scope.openChooseProblemModal = openChooseProblemModal;
    $scope.deleteWorkspace = deleteWorkspace;

    // init
    $scope.model = {};
    $scope.local = {};
    $scope.chooseProblemModal = {};
    $scope.workspacesList = WorkspaceResource.query();

    $scope.$watch('local.contents', function(newVal) {
      if (!_.isEmpty(newVal)) {
        $scope.model.choice = 'local';
      }
    });

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

    function deleteWorkspace(workspace) {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/workspace/deleteWorkspace.html',
        controller: 'DeleteWorkspaceController',
        resolve: {
          callback: function() {
            return function() {
              $scope.workspacesList = _.reject($scope.workspacesList, ['id', workspace.id]);
            };
          },
          workspace: function() {
            return workspace;
          }
        }
      });
    }
  };
  return dependencies.concat(ChooseProblemController);
});