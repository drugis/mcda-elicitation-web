'use strict';
define([], function () {
  var dependencies = ['$scope', 'PageTitleService'];

  var SmaaResultsController = function (
    $scope,

    PageTitleService
  ) {
    $scope.scalesPromise.then(function () {
      PageTitleService.setPageTitle(
        'SmaaResultsController',
        ($scope.aggregateState.problem.title || $scope.workspace.title) +
          "'s SMAA results"
      );
    });

    $scope.smaaSettings = {
      ...$scope.workspaceSettings,
      ...{
        displayMode: 'values',
        analysisType: 'smaa'
      }
    };
  };
  return dependencies.concat(SmaaResultsController);
});
