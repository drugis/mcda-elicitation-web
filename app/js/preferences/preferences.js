'use strict';

define([
  'angular',
  './preferencesController',
  './preferencesService',
  './editScenarioTitleController',
  './ordinalSwingController',
  './swingWeightingController',
  './impreciseSwingWeightingController',
  './swingWeightingService',
  './partialValueFunctionController',
  './partialValueFunctionService',
  './newScenarioController',
  './tradeOffService',
  './willingnessToTradeOffDirective',
  './willingnessToTradeOffChartDirective'
], function(
  angular,
  PreferencesController,
  PreferencesService,
  EditScenarioTitleController,
  OrdinalSwingController,
  SwingWeightingController,
  ImpreciseSwingWeightingController,
  SwingWeightingService,
  PartialValueFunctionController,
  PartialValueFunctionService,
  NewScenarioController,
  TradeOffService,
  willingnessToTradeOff,
  willingnessToTradeOffChart
) {
    return angular.module('elicit.preferences', ['elicit.workspace', 'elicit.results'])
      .controller('PreferencesController', PreferencesController)
      .controller('EditScenarioTitleController', EditScenarioTitleController)
      .controller('OrdinalSwingController', OrdinalSwingController)
      .controller('SwingWeightingController', SwingWeightingController)
      .controller('ImpreciseSwingWeightingController', ImpreciseSwingWeightingController)
      .controller('PartialValueFunctionController', PartialValueFunctionController)
      .controller('NewScenarioController', NewScenarioController)

      .factory('PartialValueFunctionService', PartialValueFunctionService)
      .factory('SwingWeightingService', SwingWeightingService)
      .factory('PreferencesService', PreferencesService)
      .factory('TradeOffService', TradeOffService)

      .directive('willingnessToTradeOff', willingnessToTradeOff)
      .directive('willingnessToTradeOffChart', willingnessToTradeOffChart)

      ;
  });
