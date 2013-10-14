define(['angular', 'underscore'], function(angular,  _) {
  var dependencies = ['$scope', '$routeParams', 'Tasks', 'Workspaces'];
  var WorkspaceController = function($scope, $routeParams, Tasks, Workspaces) {
      $scope.tasks = Tasks.available;
      $scope.route = $routeParams;
      $scope.currentWorkspace = Workspaces.current;
  };

  return angular.module('elicit.controllers', []).controller('WorkspaceController', dependencies.concat(WorkspaceController));
});
