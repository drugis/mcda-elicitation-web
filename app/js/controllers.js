define(['angular', 'underscore'], function(angular,  _) {
  var dependencies = ['$scope', '$routeParams', 'Tasks'];

  var WorkspaceController = function($scope, $routeParams, Tasks) {
    $scope.tasks = Tasks.available;
    $scope.route = $routeParams;
  };

  return angular.module('elicit.controllers', []).controller('WorkspaceController', dependencies.concat(WorkspaceController));
});
