'use strict';
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
    function (Config, patavi, angular, angularanimate, mmfoundation, _) {
      var dependencies = ['$scope', 'taskDefinition', 'ValueTreeUtil'];
      var OverviewController = function ($scope, taskDefinition, ValueTreeUtil) {
        var problem = $scope.workspace.problem;

        $scope.$parent.taskId = taskDefinition.id;

        $scope.problem = problem;
        $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree(problem.valueTree, problem.criteria);
      };

      return dependencies.concat(OverviewController);
    });
