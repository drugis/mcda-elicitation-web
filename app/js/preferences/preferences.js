'use strict';

define([
  'angular',
  './preferencesController',
  './preferencesService',
  './editScenarioTitleController',
  './ordinalSwingController',
  './swingWeightingController',
  './matchingElicitationController',
  './setMatchingWeightController',
  './impreciseSwingWeightingController',
  './swingWeightingService',
  './partialValueFunctionController',
  './partialValueFunctionService',
  './newScenarioController',
  './tradeOffService',
  './willingnessToTradeOffDirective',
  './willingnessToTradeOffChartDirective',
  './preferenceElicitationTableDirective',
  './elicitationTradeOffDirective',
  '../workspace/workspace',
  '../results/results'
], function(
  angular,
  PreferencesController,
  PreferencesService,
  EditScenarioTitleController,
  OrdinalSwingController,
  SwingWeightingController,
  MatchingElicitationController,
  SetMatchingWeightController,
  ImpreciseSwingWeightingController,
  SwingWeightingService,
  PartialValueFunctionController,
  PartialValueFunctionService,
  NewScenarioController,
  TradeOffService,
  willingnessToTradeOff,
  willingnessToTradeOffChart,
  preferenceElicitationTable,
  elicitationTradeOff
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

      .directive('willingnessToTradeOff', willingnessToTradeOff)
      .directive('willingnessToTradeOffChart', willingnessToTradeOffChart)
      .directive('preferenceElicitationTable', preferenceElicitationTable)
      .directive('elicitationTradeOff', elicitationTradeOff)
      ;
  });
