'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($scope, taskDefinition, ValueTreeUtil) {
    $scope.problem = $scope.workspace.problem;
    $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.workspace.$$valueTree, $scope.problem.criteria);
  };

});
