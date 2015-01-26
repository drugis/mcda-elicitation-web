'use strict';
define(['mcda/config', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
    function (Config, angular, angularanimate, mmfoundation, _) {
      var dependencies = ['$scope', 'taskDefinition', 'ValueTreeUtil'];
      var OverviewController = function ($scope, taskDefinition, ValueTreeUtil) {

        $scope.$parent.taskId = taskDefinition.id;
        $scope.problem = $scope.workspace.problem;
        $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.problem.valueTree, $scope.problem.criteria);

      };

      return dependencies.concat(OverviewController);
    });
