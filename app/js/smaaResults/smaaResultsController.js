'use strict';
define([], function () {
  var dependencies = ['$scope', 'PageTitleService'];

  var SmaaResultsController = function (
    $scope,

    PageTitleService
  ) {
    PageTitleService.setPageTitle(
      'SmaaResultsController',
      ($scope.aggregateState.problem.title || $scope.workspace.title) +
        "'s SMAA results"
    );
  };
  return dependencies.concat(SmaaResultsController);
});
