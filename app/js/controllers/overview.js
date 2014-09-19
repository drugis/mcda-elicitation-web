'use strict';
define(['mcda/config', 'mcda/lib/patavi', 'angular', 'angularanimate', 'mmfoundation', 'underscore'],
    function (Config, patavi, angular, angularanimate, mmfoundation, _) {
      var dependencies = ['$scope', 'taskDefinition', 'ValueTreeUtil'];
      var OverviewController = function ($scope, taskDefinition, ValueTreeUtil) {

        $scope.$parent.taskId = taskDefinition.id;

        $scope.workspace.$promise.then(function(workspace) {
          $scope.problem = workspace.problem;
          $scope.expandedValueTree = ValueTreeUtil.addCriteriaToValueTree($scope.problem.valueTree, $scope.problem.criteria);
        });

      };

      return dependencies.concat(OverviewController);
    });
