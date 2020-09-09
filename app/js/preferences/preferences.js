'use strict';

define([
  'angular',
  'react2angular',

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
  '../../ts/Elicitation/RankingElicitation/RankingElicitationWrapper',
  '../../ts/Elicitation/MatchingElicitation/MatchingElicitationWrapper',
  '../../ts/Elicitation/PreciseSwingElicitation/PreciseSwingElicitationWrapper',
  '../../ts/Elicitation/ImpreciseSwingElicitation/ImpreciseSwingElicitationWrapper',

  '../workspace/workspace',
  '../results/results'
], function (
  angular,
  react2angular,

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
  willingnessToTradeOffDirective,
  RankingElicitation,
  MatchingElicitation,
  PreciseSwingElicitation,
  ImpreciseSwingElicitation
) {
  return angular
    .module('elicit.preferences', ['elicit.workspace', 'elicit.results'])
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
    .directive('willingnessToTradeOff', willingnessToTradeOffDirective)
    .component(
      'rankingElicitation',
      react2angular.react2angular(RankingElicitation.default, [
        'criteria',
        'cancel',
        'save'
      ])
    )
    .component(
      'matchingElicitation',
      react2angular.react2angular(MatchingElicitation.default, [
        'criteria',
        'cancel',
        'save'
      ])
    )
    .component(
      'preciseSwingElicitation',
      react2angular.react2angular(PreciseSwingElicitation.default, [
        'criteria',
        'cancel',
        'save'
      ])
    )
    .component(
      'impreciseSwingElicitation',
      react2angular.react2angular(ImpreciseSwingElicitation.default, [
        'criteria',
        'cancel',
        'save'
      ])
    );
});
