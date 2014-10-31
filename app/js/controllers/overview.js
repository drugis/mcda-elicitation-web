'use strict';
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
    function (Config, patavi, angular, angularanimate, mmfoundation, _) {
      var dependencies = ['$scope', 'taskDefinition', 'ValueTreeUtil', 'WorkspaceService'];
      var OverviewController = function ($scope, taskDefinition, ValueTreeUtil, WorkspaceService) {

        $scope.workspace.problem = WorkspaceService.addValueTree($scope.workspace.problem);
        $scope.$parent.taskId = taskDefinition.id;
        $scope.problem = $scope.workspace.problem;
        $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.problem.valueTree, $scope.problem.criteria);
      
      };

      return dependencies.concat(OverviewController);
    });
