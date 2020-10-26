'use strict';

define([
  'angular',
  'react2angular',
  '../../ts/PreferencesTab/PreferencesTab',
  './partialValueFunctionController',
  './preferencesController',

  './partialValueFunctionService',

  './partialValuePlotDirective',

  '../workspace/workspace',
  '../results/results'
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
    .module('elicit.preferences', ['elicit.workspace', 'elicit.results'])
    .component(
      'preferences',
      react2angular.react2angular(PreferencesTab.default, [
        'scenarios',
        'currentScenarioId',
        'workspaceId',
        'problem',
        'settings',
        'updateAngularScenario',
        'toggledColumns'
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
