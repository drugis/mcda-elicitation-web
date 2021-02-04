'use strict';
define([
  './deterministicResultsController',
  '../../ts/DeterministicTab/DeterministicTab',
  'angular',
  'react2angular',
  'angular-patavi-client'
], function (
  DeterministicResultsController,
  DeterministicTab,
  angular,
  react2angular
) {
  return angular
    .module('elicit.deterministicResults', ['patavi', 'elicit.results'])
    .controller(
      'DeterministicResultsController',
      DeterministicResultsController
    )
    .component(
      'deterministicTab',
      react2angular.react2angular(DeterministicTab.default, [
        'scenarios',
        'currentScenarioId',
        'workspaceId',
        'problem',
        'settings',
        'updateAngularScenario',
        'toggledColumns',
        'workspace',
        'scales',
        'subproblems',
        'currentSubproblem',
        'editMode'
      ])
    );
});
