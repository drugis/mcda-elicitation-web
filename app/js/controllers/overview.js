'use strict';
define(
  ['angular', 'underscore'], function (angular, _) {
    var dependencies = ['$scope', 'taskDefinition', 'ValueTreeUtil'];
    var OverviewController = function ($scope, taskDefinition, ValueTreeUtil) {

      $scope.$parent.taskId = taskDefinition.id;
      $scope.problem = $scope.workspace.problem;
      $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.workspace.$$valueTree, $scope.problem.criteria);

    };

    return dependencies.concat(OverviewController);
  });
