'use strict';
define([], function () {
  var dependencies = [
    '$scope',
    '$state',
    'currentScenario',
    'PageTitleService'
  ];

  var DeterministicResultsController = function (
    $scope,
    $state,
    currentScenario,
    PageTitleService
  ) {
    $scope.scenario = currentScenario;

    $scope.scalesPromise.then(function () {
      PageTitleService.setPageTitle(
        'DeterministicResultsController',
        ($scope.aggregateState.problem.title || $scope.workspace.title) +
          "'s deterministic results"
      );
    });
  };
  return dependencies.concat(DeterministicResultsController);
});
