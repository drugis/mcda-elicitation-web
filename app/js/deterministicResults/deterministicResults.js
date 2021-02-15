'use strict';
define([
  './deterministicResultsController',
  '../../ts/DeterministicTab/DeterministicTab',
  'angular',
  'react2angular'
], function (
  DeterministicResultsController,
  DeterministicTab,
  angular,
  react2angular
) {
  return angular
    .module('elicit.deterministicResults', [])
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
        'updateAngularScenario',
        'workspace',
        'subproblems',
        'currentSubproblem',
        'editMode'
      ])
    );
});
