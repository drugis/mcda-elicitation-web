'use strict';

define([
  'angular',
  'react2angular',
  '../../ts/PreferencesTab/PreferencesTab',
  './partialValueFunctionController',
  './preferencesController',

  './partialValueFunctionService',

  './partialValuePlotDirective',

  '../workspace/workspace'
], function (
  angular,
  react2angular,
  PreferencesTab,
  PartialValueFunctionController,
  PreferencesController,

  PartialValueFunctionService,

  partialValuePlotDirective
) {
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
        'scales',
        'subproblems',
        'currentSubproblem'
      ])
    )
    .controller(
      'PartialValueFunctionController',
      PartialValueFunctionController
    )
    .controller('PreferencesController', PreferencesController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)

    .directive('partialValuePlot', partialValuePlotDirective);
});
