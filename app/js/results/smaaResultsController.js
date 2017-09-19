'use strict';
define(function(require) {
  var _ = require('lodash');

  var dependencies = ['$scope', 'currentScenario', 'taskDefinition', 'MCDAResultsService'];

  var SmaaResultsController = function($scope, currentScenario, taskDefinition, MCDAResultsService) {
    // init
    $scope.scenario = currentScenario;
    $scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean($scope.aggregateState));
  };
  return dependencies.concat(SmaaResultsController);
});