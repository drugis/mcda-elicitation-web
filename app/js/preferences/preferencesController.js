'use strict';
define([], function () {
  var dependencies = ['$scope', 'PageTitleService'];
  var PreferencesController = function ($scope, PageTitleService) {
    PageTitleService.setPageTitle(
      'PreferencesController',
      ($scope.aggregateState.problem.title || $scope.workspace.title) +
        "'s preferences"
    );
  };
  return dependencies.concat(PreferencesController);
});
