'use strict';
define(function() {
  return function($scope, taskDefinition, ValueTreeUtil) {
    $scope.problem = $scope.workspace.problem;
    $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.workspace.$$valueTree, $scope.problem.criteria);
  };

});
