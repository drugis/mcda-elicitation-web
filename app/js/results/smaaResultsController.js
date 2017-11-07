'use strict';
define(['clipboard', 'require'], function(Clipboard) {
  var dependencies = ['$scope', 'currentScenario', 'taskDefinition', 'MCDAResultsService'];

  var SmaaResultsController = function($scope, currentScenario, taskDefinition, MCDAResultsService) {
    // init
    $scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean($scope.aggregateState));
    $scope.scenario = currentScenario;
    var clipboard = new Clipboard('.clipboard-button');
  };
  return dependencies.concat(SmaaResultsController);
});