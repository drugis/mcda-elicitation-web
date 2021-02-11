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
  };
  return dependencies.concat(SmaaResultsController);
});
