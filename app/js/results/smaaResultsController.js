'use strict';
define(['clipboard', 'require'], function(Clipboard) {
  var dependencies = ['$scope', 'currentScenario', 'taskDefinition', 'MCDAResultsService'];

  var SmaaResultsController = function($scope, currentScenario, taskDefinition, MCDAResultsService) {
    // functions
    $scope.loadState = loadState;

    // init
    $scope.scenario = currentScenario;
    new Clipboard('.clipboard-button');

    loadState();

    function loadState() {
      $scope.aggregateState = MCDAResultsService.replaceAlternativeNames($scope.scenario.state.legend, $scope.aggregateState);
      $scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean($scope.aggregateState));
      $scope.state.resultsPromise.then(function() {
        $scope.state = MCDAResultsService.addSmaaShit($scope.state);
      });
    }
  };
  return dependencies.concat(SmaaResultsController);
});