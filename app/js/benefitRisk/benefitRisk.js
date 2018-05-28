'use strict';
var requires = [
  'mcda/benefitRisk/mcdaBenefitRiskController',
  'mcda/benefitRisk/schemaService'
];
define(['angular'].concat(requires), function(
  angular,
  MCDABenefitRiskController,
  SchemaService
) {
  return angular.module('elicit.benefitRisk', ['elicit.util'])
    .controller('MCDABenefitRiskController', MCDABenefitRiskController)
    .factory('SchemaService', SchemaService)
        
    ;
});
