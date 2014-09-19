'use strict';
define([], function() {

  return function($scope, $location, $stateParams, Tasks, TaskDependencies, WorkspaceResource, WorkspaceService) {
    $scope.workspace = WorkspaceResource.get($stateParams, function(workspace) {
      workspace.problem = WorkspaceService.addValueTree(workspace.problem);
    });

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
