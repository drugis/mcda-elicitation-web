'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = [
    '$scope',
    '$stateParams',
    '$state',
    'ScenarioResource',
    'subProblems',
    'PageTitleService'
  ];

  var SubProblemController = function (
    $scope,
    $stateParams,
    $state,
    ScenarioResource,
    subProblems,
    PageTitleService
  ) {
    // functions
    $scope.subproblemChanged = subproblemChanged;

    // init
    $scope.scalesPromise.then(() => {
      $scope.subProblems = subProblems;
      PageTitleService.setPageTitle(
        'SubProblemController',
        ($scope.aggregateState.problem.title || $scope.workspace.title) +
          `'s problem definition`
      );
    });

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
  };

  return dependencies.concat(SubProblemController);
});
