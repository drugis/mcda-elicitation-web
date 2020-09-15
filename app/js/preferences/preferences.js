'use strict';

define([
  'angular',
  './matchingElicitationController',
  './partialValueFunctionController',
  './preferencesController',
  './setMatchingWeightController',

  './partialValueFunctionService',
  './preferencesService',
  './scenarioService',
  './swingWeightingService',
  './tradeOffService',

  './elicitationTradeOffDirective',
  './elicitationTradeOffPlotDirective',
  './partialValuePlotDirective',

  '../workspace/workspace',
  '../results/results'
], function (
  angular,
  MatchingElicitationController,
  PartialValueFunctionController,
  PreferencesController,
  SetMatchingWeightController,

  PartialValueFunctionService,
  PreferencesService,
  ScenarioService,
  SwingWeightingService,
  TradeOffService,

  elicitationTradeOffDirective,
  elicitationTradeOffPlotDirective,
  partialValuePlotDirective
) {
  return angular
    .module('elicit.preferences', ['elicit.workspace', 'elicit.results'])

    .controller('MatchingElicitationController', MatchingElicitationController)
    .controller(
      'PartialValueFunctionController',
      PartialValueFunctionController
    )
    .controller('PreferencesController', PreferencesController)
    .controller('SetMatchingWeightController', SetMatchingWeightController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('SwingWeightingService', SwingWeightingService)
    .factory('PreferencesService', PreferencesService)
    .factory('TradeOffService', TradeOffService)
    .factory('ScenarioService', ScenarioService)

    .directive('elicitationTradeOff', elicitationTradeOffDirective)
    .directive('elicitationTradeOffPlot', elicitationTradeOffPlotDirective)
    .directive('partialValuePlot', partialValuePlotDirective);
});
