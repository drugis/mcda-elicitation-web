'use strict';
define(['underscore'], function(_) {

  return function($scope, $location, $stateParams, Tasks, TaskDependencies, currentWorkspace, WorkspaceService, PataviService) {

    $scope.workspace = currentWorkspace;
    $scope.workspace.$promise.then(function(workspace) {
      workspace.problem = WorkspaceService.addValueTree(workspace.problem);
      prepareScales(workspace.problem);
    });

    function prepareScales(problem) {
        var payload = _.extend(problem, {
          method: 'scales'
        });
       PataviService.run(payload).then(function(results) {
        $scope.scales = results;
      }, function(error) {
        $scope.$emit('error', {
          code: error.code,
          cause: error.cause
        });
      });
    }

    $scope.isEditTitleVisible = false;

    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
      $scope.workspaceTitle = $scope.workspace.title;
    };

    $scope.saveTitle = function() {
      $scope.workspace.title = $scope.workspaceTitle;
      $scope.workspace.$save();
      $scope.isEditTitleVisible = false;
    };

    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };
  };
});
