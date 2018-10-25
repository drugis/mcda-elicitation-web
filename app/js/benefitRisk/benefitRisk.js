'use strict';
define([
  './mcdaBenefitRiskController',
  './schemaService',
  './mcdaBenefitRiskService',
  'angular'
], function(
  MCDABenefitRiskController,
  SchemaService,
  McdaBenefitRiskService,
  angular
) {
    return angular.module('elicit.benefitRisk', ['elicit.util'])
      .controller('MCDABenefitRiskController', MCDABenefitRiskController)
      .factory('SchemaService', SchemaService)
      .factory('McdaBenefitRiskService', McdaBenefitRiskService)
      ;
  });
