'use strict';
define([], function () {
  var dependencies = ['$scope', 'PageTitleService'];
  var EvidenceController = function ($scope, PageTitleService) {
    PageTitleService.setPageTitle(
      'EvidenceController',
      ($scope.workspace.problem.title || $scope.workspace.title) + `'s overview`
    );
  };
  return dependencies.concat(EvidenceController);
});
