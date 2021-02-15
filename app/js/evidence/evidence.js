'use strict';
define([
  '../../ts/OverviewTab/OverviewTab',
  './evidenceController',
  'angular',
  'react2angular',
  'angular-resource'
], function (OverviewTab, EvidenceController, angular, react2angular) {
  return angular
    .module('elicit.evidence', [])
    .controller('EvidenceController', EvidenceController)
    .component(
      'overview',
      react2angular.react2angular(OverviewTab.default, [
        'workspace',
        'subproblems',
        'subproblem',
        'workspaceId'
      ])
    );
});
