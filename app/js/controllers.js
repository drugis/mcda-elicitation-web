'use strict';
var requires = [
  'mcda/benefitRisk/mcdaBenefitRiskController',
  'mcda/preferences/preferencesController',
  'mcda/preferences/partialValueFunctionController',
  'mcda/preferences/ordinalSwingController',
  'mcda/preferences/intervalSwingController',
  'mcda/preferences/exactSwingController'
];
define(['angular'].concat(requires), function(
  angular,
  MCDABenefitRiskController,
  PreferencesController,
  PartialValueFunctionController,
  OrdinalSwingController,
  IntervalSwingController,
  ExactSwingController
) {
  return angular.module('elicit.controllers', ['elicit.effectsTableService', 'elicit.util'])
    .controller('MCDABenefitRiskController', MCDABenefitRiskController)
    .controller('PreferencesController', PreferencesController)
    .controller('PartialValueFunctionController', PartialValueFunctionController)
    .controller('OrdinalSwingController', OrdinalSwingController)
    .controller('IntervalSwingController', IntervalSwingController)
    .controller('ExactSwingController', ExactSwingController);
});