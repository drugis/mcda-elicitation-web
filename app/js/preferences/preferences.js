'use strict';
var requires = [
  'mcda/preferences/preferencesController',
  'mcda/preferences/preferencesService',
  'mcda/preferences/editScenarioTitleController',
  'mcda/preferences/ordinalSwingController',
  'mcda/preferences/swingWeightingController',
  'mcda/preferences/impreciseSwingWeightingController',
  'mcda/preferences/swingWeightingService',
  'mcda/preferences/partialValueFunctionController',
  'mcda/preferences/partialValueFunctionService',
  'mcda/preferences/newScenarioController',
  'mcda/preferences/willingnessToTradeOffDirective',
  'mcda/preferences/willingnessToTradeOffChartDirective'
];
define(['angular'].concat(requires), function(
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
  willingnessToTradeOff,
  willingnessToTradeOffChart
) {
  return angular.module('elicit.preferences', ['elicit.workspace'])
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

    .directive('willingnessToTradeOff', willingnessToTradeOff)
    .directive('willingnessToTradeOffChart', willingnessToTradeOffChart)
    
    ;
});
