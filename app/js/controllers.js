'use strict';
var requires = [
  'mcda/benefitRisk/mcdaBenefitRiskController'
];
define(['angular'].concat(requires), function(
  angular,
  MCDABenefitRiskController
) {
  return angular.module('elicit.controllers', ['elicit.effectsTableService', 'elicit.util'])
    .controller('MCDABenefitRiskController', MCDABenefitRiskController)
    
    ;
});