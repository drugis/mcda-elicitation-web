'use strict';

define([
  'angular',
  'react2angular',

  '../../ts/PreferencesTab/PreferencesTab',

  './impreciseSwingWeightingController',
  './matchingElicitationController',
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

  './elicitationTradeOffDirective',
  './elicitationTradeOffPlotDirective',
  './preferenceElicitationTableDirective',

  '../workspace/workspace',
  '../results/results'
], function (
  angular,
  react2angular,
  PreferencesTab,
  ImpreciseSwingWeightingController,
  MatchingElicitationController,
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

  elicitationTradeOffDirective,
  elicitationTradeOffPlotDirective,
  preferenceElicitationTableDirective
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

    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller(
      'ImpreciseSwingWeightingController',
      ImpreciseSwingWeightingController
    )
    .controller('MatchingElicitationController', MatchingElicitationController)
    .controller(
      'PartialValueFunctionController',
      PartialValueFunctionController
    )
    .controller('PreferencesController', PreferencesController)
    .controller('SetMatchingWeightController', SetMatchingWeightController)
    .controller('SwingWeightingController', SwingWeightingController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('SwingWeightingService', SwingWeightingService)
    .factory('PreferencesService', PreferencesService)
    .factory('TradeOffService', TradeOffService)
    .factory('ScenarioService', ScenarioService)

    .directive('elicitationTradeOff', elicitationTradeOffDirective)
    .directive('elicitationTradeOffPlot', elicitationTradeOffPlotDirective)
    .directive(
      'preferenceElicitationTable',
      preferenceElicitationTableDirective
    );
});
