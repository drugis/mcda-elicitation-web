'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.controllers', ['elicit.effectsTableService', 'elicit.util'])
    .controller('MCDABenefitRiskController', require('mcda/benefitRisk/mcdaBenefitRiskController'))
    .controller('PreferencesController', require('mcda/preferences/preferencesController'))
    .controller('PartialValueFunctionController', require('mcda/preferences/partialValueFunctionController'))
    .controller('OrdinalSwingController', require('mcda/preferences/ordinalSwingController'))
    .controller('IntervalSwingController', require('mcda/preferences/intervalSwingController'))
    .controller('ExactSwingController', require('mcda/preferences/exactSwingController'))
    ;
});
