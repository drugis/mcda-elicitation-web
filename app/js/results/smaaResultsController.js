'use strict';
define(['clipboard', 'require'], function(Clipboard) {
  var dependencies = ['$scope', '$stateParams', 'currentScenario', 'taskDefinition', 'MCDAResultsService', 'OrderingService'];

  var SmaaResultsController = function($scope, $stateParams, currentScenario, taskDefinition, MCDAResultsService, OrderingService) {
    // functions
    $scope.loadState = loadState;

    // init
    $scope.scenario = currentScenario;
    new Clipboard('.clipboard-button');

    OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(ordering) {
      $scope.criteria = ordering.criteria;
      $scope.alternatives = ordering.alternatives;
      loadState();
    });

    function loadState() {
      $scope.aggregateState = MCDAResultsService.replaceAlternativeNames($scope.scenario.state.legend, $scope.aggregateState);
      $scope.state = MCDAResultsService.getResults($scope, taskDefinition.clean($scope.aggregateState));
      $scope.state.resultsPromise.then(function() {
        $scope.state = MCDAResultsService.addSmaaResults($scope.state);
      });
    }
  };
  return dependencies.concat(SmaaResultsController);
});