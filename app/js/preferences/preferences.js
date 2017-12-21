'use strict';
var requires = [
  'mcda/preferences/preferencesController',
  'mcda/preferences/editScenarioTitleController',
  'mcda/preferences/ordinalSwingController',
  'mcda/preferences/swingWeightingController',
  'mcda/preferences/impreciseSwingWeightingController',
  'mcda/preferences/swingWeightingService',
  'mcda/preferences/partialValueFunctionController',
  'mcda/preferences/partialValueFunctionService'
];
define(['angular'].concat(requires), function(
  angular,
  PreferencesController,
  EditScenarioTitleController,
  OrdinalSwingController,
  SwingWeightingController,
  ImpreciseSwingWeightingController,
  SwingWeightingService,
  PartialValueFunctionController,
  PartialValueFunctionService
) {
  return angular.module('elicit.preferences', ['elicit.workspace'])
    .controller('PreferencesController', PreferencesController)
    .controller('EditScenarioTitleController', EditScenarioTitleController)
    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller('SwingWeightingController', SwingWeightingController)
    .controller('ImpreciseSwingWeightingController', ImpreciseSwingWeightingController)
    .controller('PartialValueFunctionController', PartialValueFunctionController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    .factory('SwingWeightingService', SwingWeightingService)
    ;
});