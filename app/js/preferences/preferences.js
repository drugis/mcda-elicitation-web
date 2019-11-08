'use strict';

define([
  'angular',
  './editScenarioTitleController',
  './impreciseSwingWeightingController',
  './matchingElicitationController',
  './newScenarioController',
  './ordinalSwingController',
  './partialValueFunctionController',
  './preferencesController',
  './setMatchingWeightController',
  './swingWeightingController',

  './partialValueFunctionService',
  './preferencesService',
  './scenarioService',
  './swingWeightingService',
  './tradeOffService',

  './tradeOffDirective',
  './elicitationTradeOffDirective',
  './individualScenarioDirective',
  './partialValueFunctionDirective',
  './partialValuePlotDirective',
  './preferenceElicitationTableDirective',
  './willingnessToTradeOffChartDirective',
  './willingnessToTradeOffDirective',

  '../workspace/workspace',
  '../results/results'
], function(
  angular,
  EditScenarioTitleController,
  ImpreciseSwingWeightingController,
  MatchingElicitationController,
  NewScenarioController,
  OrdinalSwingController,
  PartialValueFunctionController,
  PreferencesController,
  SetMatchingWeightController,
  SwingWeightingController,

  PartialValueFunctionService,
  PreferencesService,
  ScenarioService,
  SwingWeightingService,
  TradeOffService,

  tradeOffDirective,
  elicitationTradeOffDirective,
  individualScenarioDirective,
  partialValueFunctionDirective,
  partialValuePlotDirective,
  preferenceElicitationTableDirective,
  willingnessToTradeOffChartDirective,
  willingnessToTradeOffDirective

) {
  return angular.module('elicit.preferences', ['elicit.workspace', 'elicit.results'])
    .controller('PreferencesController', PreferencesController)
    .controller('EditScenarioTitleController', EditScenarioTitleController)
    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller('SwingWeightingController', SwingWeightingController)
    .controller('SetMatchingWeightController', SetMatchingWeightController)
    .controller('MatchingElicitationController', MatchingElicitationController)
    .controller('ImpreciseSwingWeightingController', ImpreciseSwingWeightingController)
    .controller('PartialValueFunctionController', PartialValueFunctionController)
    .controller('NewScenarioController', NewScenarioController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('SwingWeightingService', SwingWeightingService)
    .factory('PreferencesService', PreferencesService)
    .factory('TradeOffService', TradeOffService)
    .factory('ScenarioService', ScenarioService)

    .directive('tradeOff', tradeOffDirective)
    .directive('willingnessToTradeOff', willingnessToTradeOffDirective)
    .directive('willingnessToTradeOffChart', willingnessToTradeOffChartDirective)
    .directive('preferenceElicitationTable', preferenceElicitationTableDirective)
    .directive('elicitationTradeOff', elicitationTradeOffDirective)
    .directive('partialValuePlot', partialValuePlotDirective)
    .directive('partialValueFunctions', partialValueFunctionDirective)
    .directive('individualScenario', individualScenarioDirective)
    ;
});
