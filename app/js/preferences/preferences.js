'use strict';

define([
  'angular',
  'react2angular',
  '../../ts/PreferencesTab/PreferencesTab',
  './preferencesController',

  '../workspace/workspace'
], function (angular, react2angular, PreferencesTab, PreferencesController) {
  return angular
    .module('elicit.preferences', ['elicit.workspace'])
    .component(
      'preferences',
      react2angular.react2angular(PreferencesTab.default, [
        'scenarios',
        'currentScenarioId',
        'workspaceId',
        'updateAngularScenario',
        'workspace',
        'subproblems',
        'currentSubproblem'
      ])
    )
    .controller('PreferencesController', PreferencesController);
});
