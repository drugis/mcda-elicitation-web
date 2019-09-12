'use strict';
define(['clipboard', 'require'], function(Clipboard) {
  var dependencies = [
    '$scope',
    '$stateParams',
    'currentScenario',
    'MCDAResultsService',
    'OrderingService',
    'PageTitleService'
  ];

  var SmaaResultsController = function(
    $scope,
    $stateParams,
    currentScenario,
    MCDAResultsService,
    OrderingService,
    PageTitleService
  ) {
    // functions
    $scope.loadState = loadState;

    // init
    $scope.scenario = currentScenario;
    new Clipboard('.clipboard-button');
    PageTitleService.setPageTitle('SmaaResultsController', ($scope.aggregateState.problem.title || $scope.workspace.title) +'\'s SMAA results');

    OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(ordering) {
      $scope.criteria = ordering.criteria;
      $scope.alternatives = ordering.alternatives;
      loadState();
    });

    function loadState() {
      $scope.state = MCDAResultsService.replaceAlternativeNames($scope.scenario.state.legend, $scope.aggregateState.dePercentified);
      $scope.state = MCDAResultsService.getResults($scope, $scope.state);
      $scope.state.resultsPromise.then(function() {
        $scope.state = MCDAResultsService.addSmaaResults($scope.state);
      });
    }
  };
  return dependencies.concat(SmaaResultsController);
});
