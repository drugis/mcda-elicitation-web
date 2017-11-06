'use strict';
define(['clipboard', 'require'], function(Clipboard) {
  var dependencies = ['$scope', '$state', 'currentScenario', 'taskDefinition', 'MCDAResultsService', 'TaskDependencies'];

  var SmaaResultsController = function($scope, $state, currentScenario, taskDefinition, MCDAResultsService, TaskDependencies) {
    // init
    if (!TaskDependencies.isAccessible($scope.tasks.results, $scope.aggregateState).accessible) {
      $state.go('preferences', {
        workspaceId: $scope.workspace.id,
        problemId: $scope.subProblem.id,
        id: currentScenario.id
      });
    } else {
      $scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean($scope.aggregateState));
      $scope.scenario = currentScenario;
      var clipboard = new Clipboard('.clipboard-button');
    }

  };
  return dependencies.concat(SmaaResultsController);
});