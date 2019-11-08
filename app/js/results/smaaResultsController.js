'use strict';
define(['clipboard', 'require'], function(Clipboard) {
  var dependencies = [
    '$scope',
    '$stateParams',
    'currentScenario',
    'SmaaResultsService',
    'OrderingService',
    'PageTitleService'
  ];

  var SmaaResultsController = function(
    $scope,
    $stateParams,
    currentScenario,
    SmaaResultsService,
    OrderingService,
    PageTitleService
  ) {
    // init
    $scope.scenario = currentScenario;
    new Clipboard('.clipboard-button');

    $scope.scalesPromise.then(function() {
      PageTitleService.setPageTitle('SmaaResultsController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s SMAA results');
      OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(ordering) {
        $scope.criteria = ordering.criteria;
        $scope.alternatives = ordering.alternatives;
        loadState();
      });
    });

    $scope.$on('elicit.legendChanged', function() {
      loadState();
    });

    function loadState() {
      $scope.state = SmaaResultsService.replaceAlternativeNames($scope.scenario.state.legend, $scope.aggregateState.dePercentified);
      $scope.state = SmaaResultsService.getResults($scope, $scope.state);
      $scope.state.resultsPromise.then(function() {
        $scope.state = SmaaResultsService.addSmaaResults($scope.state);
      });
    }
  };
  return dependencies.concat(SmaaResultsController);
});
