'use strict';
define(function(require) {
  var _ = require('lodash');

  return function($scope, $stateParams, EffectsTableResource, EffectsTableService) {
    $scope.scales = $scope.workspace.$$scales.observed;
    $scope.valueTree = $scope.workspace.$$valueTree;

    $scope.problem = $scope.workspace.problem;
    $scope.effectsTableData = EffectsTableService.buildEffectsTableData($scope.problem, $scope.valueTree);
    $scope.nrAlternatives = _.keys($scope.problem.alternatives).length;
    $scope.alternativeInclusions = {};

    _.map($scope.problem.alternatives, function(alternative, alternativeKey) {
      $scope.alternativeInclusions[alternativeKey] = true;
    });

    EffectsTableResource.query($stateParams, function(exclusions) {
      _.forEach(exclusions, function(exclusion) {
        $scope.alternativeInclusions[exclusion.alternativeId] = false;
      });
    });

    $scope.$watch('workspace.$$scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);

    $scope.isExact = function(criterion, alternative) {
      var perf = _.find($scope.problem.performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    };

    $scope.toggleVisibility = function(alternativeId) {
      EffectsTableResource.toggleExclusion($stateParams, {
        alternativeId: alternativeId
      });
    };
  };
});
