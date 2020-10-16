'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = [
    '$scope',
    '$stateParams',
    '$modal',
    '$state',
    'subProblems',
    'SubProblemService',
    'PageTitleService'
  ];

  var SubProblemController = function (
    $scope,
    $stateParams,
    $modal,
    $state,
    subProblems,
    SubProblemService,
    PageTitleService
  ) {
    // functions
    $scope.openCreateDialog = openCreateDialog;

    // init
    $scope.scalesPromise.then(function () {
      $scope.subProblems = subProblems;
      $scope.scales = $scope.workspace.scales;
      $scope.isBaseline = SubProblemService.determineBaseline(
        $scope.aggregateState.problem.table,
        $scope.aggregateState.problem.alternatives
      );
      PageTitleService.setPageTitle(
        'SubProblemController',
        ($scope.aggregateState.problem.title || $scope.workspace.title) +
          "'s problem definition"
      );
    });

    $scope.$watch(
      'workspace.scales',
      function (newScales, oldScales) {
        if (
          newScales &&
          oldScales &&
          newScales.observed === oldScales.observed
        ) {
          return;
        } else {
          $scope.scales = newScales;
        }
      },
      true
    );

    function openCreateDialog() {
      $modal.open({
        templateUrl: './createSubProblem.html',
        controller: 'CreateSubProblemController',
        size: 'large',
        resolve: {
          subProblems: function () {
            return $scope.subProblems;
          },
          subProblem: function () {
            return $scope.subProblem;
          },
          problem: function () {
            return $scope.baseState.dePercentified.problem;
          },
          scales: function () {
            return $scope.scales;
          },
          editMode: function () {
            return $scope.editMode;
          },
          effectsTableInfo: function () {
            return $scope.effectsTableInfo;
          },
          callback: function () {
            return function (newProblemId, newScenarioId) {
              $state.go(
                'problem',
                _.extend({}, $stateParams, {
                  problemId: newProblemId,
                  id: newScenarioId
                })
              );
            };
          }
        }
      });
    }
  };

  return dependencies.concat(SubProblemController);
});
