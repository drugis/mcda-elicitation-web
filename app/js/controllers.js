define(['angular', 'underscore'], function(angular,  _) {
  var dependencies = ['$scope', '$stateParams', '$location', 'Tasks', 'Workspaces'];

  var WorkspaceController = function($scope, $stateParams, $location, Tasks, Workspaces) {
    $scope.tasks = Tasks.available;

    Workspaces.get($stateParams.workspaceId).then(function(workspace) {
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
