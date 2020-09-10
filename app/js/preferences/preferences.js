'use strict';

define([
  'angular',
  'react2angular',

  '../../ts/PreferencesTab/PreferencesTab',

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
  './elicitationTradeOffPlotDirective',
  './scenarioDirective',
  './partialValueFunctionDirective',
  './partialValuePlotDirective',
  './preferenceElicitationTableDirective',
  './willingnessToTradeOffChartDirective',
  './willingnessToTradeOffDirective',

  '../workspace/workspace',
  '../results/results'
], function (
  angular,
  react2angular,
  PreferencesTab,
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
  elicitationTradeOffPlotDirective,
  scenarioDirective,
  partialValueFunctionDirective,
  partialValuePlotDirective,
  preferenceElicitationTableDirective,
  willingnessToTradeOffChartDirective,
  willingnessToTradeOffDirective
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

    .controller('EditScenarioTitleController', EditScenarioTitleController)
    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller(
      'ImpreciseSwingWeightingController',
      ImpreciseSwingWeightingController
    )
    .controller('MatchingElicitationController', MatchingElicitationController)
    .controller('NewScenarioController', NewScenarioController)
    .controller(
      'PartialValueFunctionController',
      PartialValueFunctionController
    )
    .controller('PreferencesController', PreferencesController)
    .controller('SetMatchingWeightController', SetMatchingWeightController)
    .controller('SwingWeightingController', SwingWeightingController)
    .controller('DeleteScenarioController', DeleteScenarioController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('SwingWeightingService', SwingWeightingService)
    .factory('PreferencesService', PreferencesService)
    .factory('TradeOffService', TradeOffService)
    .factory('ScenarioService', ScenarioService)

    .directive('tradeOff', tradeOffDirective)
    .directive('elicitationTradeOff', elicitationTradeOffDirective)
    .directive('elicitationTradeOffPlot', elicitationTradeOffPlotDirective)
    .directive('scenario', scenarioDirective)
    .directive('partialValueFunctions', partialValueFunctionDirective)
    .directive('partialValuePlot', partialValuePlotDirective)
    .directive(
      'preferenceElicitationTable',
      preferenceElicitationTableDirective
    )
    .directive(
      'willingnessToTradeOffChart',
      willingnessToTradeOffChartDirective
    )
    .directive('willingnessToTradeOff', willingnessToTradeOffDirective);
});
