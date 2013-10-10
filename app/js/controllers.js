define(['angular', 'underscore'], function(angular,  _) {
  return angular.module('elicit.controllers', [])
    .controller('WorkspaceController', function($scope, $routeParams, Tasks, Workspaces) {
      $scope.tasks = Tasks.available;
      $scope.route = $routeParams;

      $scope.$watch('route', function(newVal, oldVal) {
        console.log("route changed", newVal, oldVal);
        console.log(newVal.workspaceId);
        $scope.currentTask = Workspaces.currentTask[newVal.workspaceId];
      });

      $scope.getTask = function(taskId) {
        console.log("calling GetTask", taskId);
	return _.find(Tasks, function(task) { return taskId === task.id; });
      };
 
    });
});
