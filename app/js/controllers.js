define(['angular', 'underscore'], function(angular,  _) {
  return angular.module('elicit.controllers', [])
    .controller('WorkspaceController', ['$scope', '$routeParams', 'Tasks', function($scope, $routeParams, Tasks) {
      $scope.tasks = Tasks.available;
      $scope.route = $routeParams;
    }]);
});
