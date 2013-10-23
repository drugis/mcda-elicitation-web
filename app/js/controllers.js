define(['angular', 'underscore'], function(angular,  _) {
  var dependencies = ['$scope', '$routeParams', '$location', 'Tasks', 'Workspaces'];

  var WorkspaceController = function($scope, $routeParams, $location, Tasks, Workspaces) {
    $scope.tasks = Tasks.available;
    $scope.route = $routeParams;

    Workspaces.current().then(function(workspace) {
      $scope.workspaceTitle = workspace.title;

      $scope.scenarios = workspace.query();
      $scope.$on("elicit.scenariosChanged", function(e, val) {
        $scope.scenarios = workspace.query();
      });

      $scope.forkScenario = function() {
        workspace.currentScenario().then(function(scenario) {
          var scenarioId = workspace.newScenario(scenario.state);
          workspace.redirectToDefaultView(scenarioId);
        });
      };

      $scope.newScenario = function() {
        var scenarioId = workspace.newScenario({ "problem" : workspace.problem });
        workspace.redirectToDefaultView(scenarioId);
      };
    });
  };

  return angular.module('elicit.controllers', []).controller('WorkspaceController', dependencies.concat(WorkspaceController));
});
