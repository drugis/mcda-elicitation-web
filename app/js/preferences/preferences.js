'use strict';

define([
  'angular',
  'react2angular',
  '../../ts/PreferencesTab/PreferencesTab',
  './matchingElicitationController',
  './partialValueFunctionController',
  './preferencesController',
  './setMatchingWeightController',

  './partialValueFunctionService',
  './preferencesService',
  './scenarioService',
  './tradeOffService',

  './elicitationTradeOffDirective',
  './elicitationTradeOffPlotDirective',
  './partialValuePlotDirective',

  '../workspace/workspace',
  '../results/results'
], function (
  angular,
  react2angular,
  PreferencesTab,
  MatchingElicitationController,
  PartialValueFunctionController,
  PreferencesController,
  SetMatchingWeightController,

  PartialValueFunctionService,
  PreferencesService,
  ScenarioService,
  TradeOffService,

  elicitationTradeOffDirective,
  elicitationTradeOffPlotDirective,
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
        'settings'
      ])
    )
    .controller('MatchingElicitationController', MatchingElicitationController)
    .controller(
      'PartialValueFunctionController',
      PartialValueFunctionController
    )
    .controller('PreferencesController', PreferencesController)
    .controller('SetMatchingWeightController', SetMatchingWeightController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('PreferencesService', PreferencesService)
    .factory('TradeOffService', TradeOffService)
    .factory('ScenarioService', ScenarioService)

    .directive('elicitationTradeOff', elicitationTradeOffDirective)
    .directive('elicitationTradeOffPlot', elicitationTradeOffPlotDirective)
    .directive('partialValuePlot', partialValuePlotDirective);
});
