'use strict';
var requires = [
  'mcda/preferences/preferencesController',
  'mcda/preferences/editScenarioTitleController',
  'mcda/preferences/ordinalSwingController',
  'mcda/preferences/swingWeightingController',
  'mcda/preferences/partialValueFunctionController',
  'mcda/preferences/partialValueFunctionService'
];
define(['angular'].concat(requires), function(
  angular,
  PreferencesController,
  EditScenarioTitleController,
  OrdinalSwingController,
  SwingWeightingController,
  PartialValueFunctionController,
  PartialValueFunctionService
) {
  return angular.module('elicit.preferences', [])
    .controller('PreferencesController', PreferencesController)
    .controller('EditScenarioTitleController', EditScenarioTitleController)
    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller('SwingWeightingController', SwingWeightingController)
    .controller('PartialValueFunctionController', PartialValueFunctionController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    ;
});