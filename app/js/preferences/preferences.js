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
    .controller('EditScenarioTitleController', EditScenarioTitleController)
    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller('ImpreciseSwingWeightingController', ImpreciseSwingWeightingController)
    .controller('MatchingElicitationController', MatchingElicitationController)
    .controller('NewScenarioController', NewScenarioController)
    .controller('PartialValueFunctionController', PartialValueFunctionController)
    .controller('PreferencesController', PreferencesController)
    .controller('SetMatchingWeightController', SetMatchingWeightController)
    .controller('SwingWeightingController', SwingWeightingController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('SwingWeightingService', SwingWeightingService)
    .factory('PreferencesService', PreferencesService)
    .factory('TradeOffService', TradeOffService)
    .factory('ScenarioService', ScenarioService)

    .directive('elicitationTradeOff', elicitationTradeOffDirective)
    .directive('individualScenario', individualScenarioDirective)
    .directive('partialValueFunctions', partialValueFunctionDirective)
    .directive('partialValuePlot', partialValuePlotDirective)
    .directive('preferenceElicitationTable', preferenceElicitationTableDirective)
    .directive('tradeOff', tradeOffDirective)
    .directive('willingnessToTradeOff', willingnessToTradeOffDirective)
    .directive('willingnessToTradeOffChart', willingnessToTradeOffChartDirective)
    ;
});
