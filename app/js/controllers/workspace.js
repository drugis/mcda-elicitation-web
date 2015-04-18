'use strict';
define(function(require) {
  return function($scope, $location, $stateParams, Tasks, TaskDependencies, currentWorkspace) {
    $scope.editMode = {
      isUserOwner: currentWorkspace.owner === window.config.user.id
    };
    $scope.workspace = currentWorkspace;

    $scope.isEditTitleVisible = false;
    $scope.workspaceTitle = $scope.workspace.title;

    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
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
