'use strict';
define([
  './mcdaBenefitRiskController',
  './schemaService',
  'angular'
], function(
  MCDABenefitRiskController,
  SchemaService,
  angular
) {
    return angular.module('elicit.benefitRisk', ['elicit.util'])
      .controller('MCDABenefitRiskController', MCDABenefitRiskController)
      .factory('SchemaService', SchemaService)
      ;
  });
