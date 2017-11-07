'use strict';
var requires = [
  'mcda/preferences/preferencesController',
  'mcda/preferences/editScenarioTitleController',
  'mcda/preferences/ordinalSwingController',
  'mcda/preferences/intervalSwingController',
  'mcda/preferences/exactSwingController',
  'mcda/preferences/partialValueFunctionController',
  'mcda/preferences/partialValueFunctionService'
];
define(['angular'].concat(requires), function(
  angular,
  PreferencesController,
  EditScenarioTitleController,
  OrdinalSwingController,
  IntervalSwingController,
  ExactSwingController,
  PartialValueFunctionController,
  PartialValueFunctionService
) {
  return angular.module('elicit.preferences', [])
    .controller('PreferencesController', PreferencesController)
    .controller('EditScenarioTitleController', EditScenarioTitleController)
    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller('IntervalSwingController', IntervalSwingController)
    .controller('ExactSwingController', ExactSwingController)
    .controller('PartialValueFunctionController', PartialValueFunctionController)

    .factory('PartialValueFunctionService', PartialValueFunctionService)
    ;
});