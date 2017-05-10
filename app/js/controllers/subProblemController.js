'use strict';
define(function(require) {
  require('angular');
  var _ = require('lodash');

  return function($scope, $stateParams) {

    $scope.problem = $scope.workspace.problem;
    $scope.updateInclusions = updateInclusions;

    $scope.subProblemPromise.then(function(subProblem) {
      $scope.subProblem = subProblem;
      $scope.originalInclusions = createInclusions(subProblem);
      $scope.problemState = {
        criterionInclusions: _.cloneDeep($scope.originalInclusions)
      };
      updateInclusions();
    });

    $scope.$watch('workspace.$$scales.observed', function(newValue) {
      $scope.scales = newValue;
    }, true);

    function updateInclusions() {
      $scope.problemState.isChanged = !_.isEqual($scope.problemState.criterionInclusions, $scope.originalInclusions);
      $scope.problemState.numberOfCriteriaSelected = _.reduce($scope.problemState.criterionInclusions, function(accum, inclusion) {
        return inclusion? accum + 1 : accum ;
      }, 0);
    }

    function createInclusions(subProblem) {
      return _.mapValues($scope.problem.criteria, function(key) {
        return !_.find(subProblem.definition.excludedCriteria, key);
      });
    }

  };
});
