'use strict';
define(function(require) {
  var _ = require('lodash');

  return function($scope, $stateParams, EffectsTableService) {
    $scope.scales = $scope.workspace.scales.observed;
    $scope.valueTree = $scope.workspace.$$valueTree;

    $scope.problem = $scope.workspace.problem;
    $scope.effectsTableData = EffectsTableService.buildEffectsTableData($scope.problem, $scope.valueTree);
    $scope.nrAlternatives = _.keys($scope.problem.alternatives).length;

    $scope.references = {
      has: _.find($scope.effectsTableData, function(effectsTableRow) {
        return _.find(effectsTableRow.criteria, function(criterion) {
          return criterion.value.source;
        });
      })
    };

    $scope.$watch('workspace.scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);

    $scope.isExact = function(criterion, alternative) {
      var perf = _.find($scope.problem.performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    };
  };
});