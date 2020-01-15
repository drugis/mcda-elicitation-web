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
  './deleteScenarioController',

  './partialValueFunctionService',
  './preferencesService',
  './scenarioService',
  './swingWeightingService',
  './tradeOffService',

  './tradeOffDirective',
  './elicitationTradeOffDirective',
  './scenarioDirective',
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
  DeleteScenarioController,

  PartialValueFunctionService,
  PreferencesService,
  ScenarioService,
  SwingWeightingService,
  TradeOffService,

  tradeOffDirective,
  elicitationTradeOffDirective,
  scenarioDirective,
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
    .controller('DeleteScenarioController', DeleteScenarioController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('SwingWeightingService', SwingWeightingService)
    .factory('PreferencesService', PreferencesService)
    .factory('TradeOffService', TradeOffService)
    .factory('ScenarioService', ScenarioService)

    .directive('elicitationTradeOff', elicitationTradeOffDirective)
    .directive('scenario', scenarioDirective)
    .directive('partialValueFunctions', partialValueFunctionDirective)
    .directive('partialValuePlot', partialValuePlotDirective)
    .directive('preferenceElicitationTable', preferenceElicitationTableDirective)
    .directive('tradeOff', tradeOffDirective)
    .directive('willingnessToTradeOff', willingnessToTradeOffDirective)
    .directive('willingnessToTradeOffChart', willingnessToTradeOffChartDirective)
    ;
});
