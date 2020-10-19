'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = [
    '$scope',
    '$stateParams',
    '$modal',
    '$state',
    'ScenarioResource',
    'subProblems',
    'SubProblemService',
    'PageTitleService'
  ];

  var SubProblemController = function (
    $scope,
    $stateParams,
    $modal,
    $state,
    ScenarioResource,
    subProblems,
    SubProblemService,
    PageTitleService
  ) {
    // functions
    $scope.openCreateDialog = openCreateDialog;
    $scope.subproblemChanged = subproblemChanged;

    // init
    $scope.scalesPromise.then(() => {
      $scope.subProblems = subProblems;
      $scope.scales = $scope.workspace.scales;
      PageTitleService.setPageTitle(
        'SubProblemController',
        ($scope.aggregateState.problem.title || $scope.workspace.title) +
          `'s problem definition`
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

    function subproblemChanged(newSubProblem) {
      var coords = _.omit($stateParams, 'id');
      coords.problemId = newSubProblem.id;
      ScenarioResource.query(coords).$promise.then((scenarios) => {
        $state.go('problem', {
          workspaceId: $scope.workspace.id,
          problemId: newSubProblem.id,
          id: scenarios[0].id
        });
      });
    }

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
