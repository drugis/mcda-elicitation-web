'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');
  var lodash = require('lodash');

  return function($scope, $stateParams,
    taskDefinition,
    RemarksResource,
    ValueTreeUtil,
    EffectsTableService,
    EffectsTableResource) {

    var remarksCache;
    $scope.$watch('workspace.$$scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);
    $scope.scales = $scope.workspace.$$scales.observed;
    $scope.valueTree = $scope.workspace.$$valueTree;

    $scope.isExact = function(criterion, alternative) {
      var perf = _.find($scope.problem.performanceTable, function(performance) {
        return performance.alternative === alternative && performance.criterion === criterion;
      });
      return !!perf && perf.performance.type === 'exact';
    };

    $scope.problem = $scope.workspace.problem;
    $scope.effectsTableData = EffectsTableService.buildEffectsTableData($scope.problem, $scope.valueTree);
    $scope.nrAlternatives = _.keys($scope.problem.alternatives).length;
    $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.valueTree, $scope.problem.criteria);
    $scope.remarks = {};

    $scope.alternativeInclusions = {};
    lodash.map($scope.problem.alternatives, function(alternative, alternativeKey){
      $scope.alternativeInclusions[alternativeKey] = true;
    });
    
    EffectsTableResource.query($stateParams, function(exclusions) {
      lodash.forEach(exclusions, function(exclusion) {
        $scope.alternativeInclusions[exclusion.alternativeId] = false;
      });
    });

    RemarksResource.get(_.omit($stateParams, 'id'), function(remarks) {
      if (remarks.remarks) {
        $scope.remarks = remarks;
      }
      remarksCache = angular.copy(remarks);
    });

    $scope.toggleVisibility = function(alternativeId){
      EffectsTableResource.toggleExclusion($stateParams, {alternativeId: alternativeId});
    };

    $scope.saveRemarks = function() {
      RemarksResource.save(_.omit($stateParams, 'id'), $scope.remarks, function() {
        remarksCache = angular.copy($scope.remarks);
      });
    };

    $scope.cancelRemarks = function() {
      $scope.remarks = angular.copy(remarksCache);
    };

  };
});
