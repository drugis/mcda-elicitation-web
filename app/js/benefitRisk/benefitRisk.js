'use strict';
define([
  './mcdaBenefitRiskController',
  './schemaService',
  './tabService',
  'angular'
], function(
  MCDABenefitRiskController,
  SchemaService,
  TabService,
  angular
) {
  return angular.module('elicit.benefitRisk', ['elicit.util'])
    .controller('MCDABenefitRiskController', MCDABenefitRiskController)
    .factory('SchemaService', SchemaService)
    .factory('TabService', TabService)
    ;
});
