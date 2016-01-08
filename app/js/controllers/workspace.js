'use strict';
define([], function() {

  return function($scope, $location, $stateParams, $cookies, Tasks, TaskDependencies, currentWorkspace) {
    var user = angular.fromJson($cookies.get("LOGGED-IN-USER"));
    $scope.editMode = {
      isUserOwner: user ? currentWorkspace.owner === user.id : false
    };
    $scope.workspace = currentWorkspace;

    $scope.isEditTitleVisible = false;
    $scope.workspaceTitle = $scope.workspace.title;

    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
      $scope.workspace.title = $scope.workspace.problem.title;
    };

    $scope.saveTitle = function() {
      $scope.workspace.problem.title = $scope.workspace.title;
      $scope.workspace.$save();
      $scope.isEditTitleVisible = false;
    };

    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };
  };
});
