define(['angular', 'underscore', 'mcda/config'], function(angular, _, Config) {

  return function($scope, $location, $state, Tasks, TaskDependencies, currentWorkspace) {
    $scope.workspace = currentWorkspace;

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
