'use strict';
define([], function () {
  var dependencies = ['$scope', 'currentScenario', 'PageTitleService'];

  var DeterministicResultsController = function (
    $scope,
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
