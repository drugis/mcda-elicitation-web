'use strict';
define([], function() {

  return function($scope, $location, $stateParams, $cookies, Tasks, TaskDependencies, currentWorkspace, WorkspaceService) {
    var user = angular.fromJson($cookies["LOGGED-IN-USER"]);
    
    $scope.editMode = {
      isUserOwner: user ? currentWorkspace.owner === user.id : false
    };
    $scope.workspace = currentWorkspace;
    $scope.workspace.problem = WorkspaceService.addValueTree($scope.workspace.problem);
    WorkspaceService.prepareScales($scope.workspace.problem);

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