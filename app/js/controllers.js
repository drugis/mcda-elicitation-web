define(['angular', 'underscore'], function(angular,  _) {
  return angular.module('elicit.controllers', [])
    .controller('WorkspaceController', ['$scope', '$routeParams', 'Tasks', 'Workspaces', function($scope, $routeParams, Tasks, Workspaces) {
      $scope.tasks = Tasks.available;
      $scope.route = $routeParams;
      $scope.currentWorkspace = Workspaces.current;

    }]);
});
