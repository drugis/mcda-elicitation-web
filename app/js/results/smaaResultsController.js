'use strict';
define(['clipboard', 'lodash'], function(Clipboard, _) {
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
    $scope.uncertaintyOptionsChanged = uncertaintyOptionsChanged;
    $scope.recalculateSmaa = recalculateSmaa;

    $scope.scenario = currentScenario;
    $scope.uncertaintyOptions = {
      dirty: false
    };
    $scope.warnings = [];
    var deterministicWarning = 'SMAA results will be identical to the deterministic results because there are no stochastic inputs';
    var hasNoStochasticMeasurementsWarning = 'Measurements are not stochastic';
    var hasNoStochasticWeightsWarning = 'Weights are not stochastic';

    new Clipboard('.clipboard-button');

    $scope.scalesPromise.then(function() {
      PageTitleService.setPageTitle('SmaaResultsController', ($scope.aggregateState.problem.title || $scope.workspace.title) + '\'s SMAA results');
      OrderingService.getOrderedCriteriaAndAlternatives($scope.aggregateState.problem, $stateParams).then(function(ordering) {
        $scope.criteria = ordering.criteria;
        $scope.alternatives = ordering.alternatives;
        initUncertaintyOptions();
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

    function initUncertaintyOptions() {
      $scope.noStochasticMeasurements = SmaaResultsService.hasNoStochasticMeasurements($scope.aggregateState);
      $scope.noStochasticWeights = SmaaResultsService.hasNoStochasticWeights($scope.aggregateState);

      if (!$scope.scenario.state.uncertaintyOptions) {
        $scope.scenario.state.uncertaintyOptions = {
          measurements: !$scope.noStochasticMeasurements,
          weights: !$scope.noStochasticWeights
        };
      }

      if ($scope.noStochasticMeasurements) {
        $scope.warnings.push(hasNoStochasticMeasurementsWarning);
      }
      if ($scope.noStochasticWeights) {
        $scope.warnings.push(hasNoStochasticWeightsWarning);
      }
      uncertaintyOptionsChanged();
    }

    function uncertaintyOptionsChanged() {
      $scope.uncertaintyOptions.dirty = true;
      if ($scope.scenario.state.uncertaintyOptions.weights === false && $scope.scenario.state.uncertaintyOptions.measurements === false) {
        $scope.warnings.push(deterministicWarning);
      } else {
        $scope.warnings = _.reject($scope.warnings, function(warning) {
          return warning === deterministicWarning;
        });
      }
    }

    function recalculateSmaa() {
      $scope.uncertaintyOptions.dirty = false;
      $scope.scenario.$save($stateParams);
      loadState();
    }
  };
  return dependencies.concat(SmaaResultsController);
});
