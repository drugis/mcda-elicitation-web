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
    $scope.selectAllAlternatives = selectAllAlternatives;
    $scope.deselectAllAlternatives = deselectAllAlternatives;
    $scope.toggleVisibility = toggleVisibility;
    $scope.references = {
      has: _.find($scope.effectsTableData, function(effectsTableRow) {
        return _.find(effectsTableRow.criteria, function(criterion) {
          return criterion.value.source;
        });
      })
    };
    EffectsTableResource.query($stateParams,
      function(inclusions) {
        _.forEach(inclusions, function(inclusion) {
          $scope.alternativeInclusions[inclusion.alternativeId] = true;
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

    function toggleVisibility() {
      EffectsTableResource.setEffectsTableInclusions($stateParams, {
        alternativeIds: alternativeInclusionsToList()
      });
    }

    function alternativeInclusionsToList() {
      return _.reduce($scope.alternativeInclusions, function(accum, inclusion, key) {
        if (inclusion) {
          accum.push(key);
        }
        return accum;
      }, []);
    }

    function selectAllAlternatives() {
      $scope.alternativeInclusions = _.reduce($scope.problem.alternatives, function(accum, alternative, alternativeKey) {
        accum[alternativeKey] = true;
        return accum;
      }, {});
      toggleVisibility();
    }

    function deselectAllAlternatives() {
      $scope.alternativeInclusions = {};
      toggleVisibility();
    }
  };
});