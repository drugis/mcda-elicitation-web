'use strict';
define(function() {
  return function($scope, currentScenario, taskDefinition, MCDAResultsService) {
    $scope.scenario = currentScenario;

    $scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean(currentScenario.state));
  };
});
