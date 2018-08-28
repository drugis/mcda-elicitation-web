'use strict';
define([
  './evidenceController',
  './editAlternativeController',
  './editCriterionController',
  './editTherapeuticContextController',
  './editDataSourceController',
  'angular',
  'angular-resource'
], function(
  EvidenceController,
  EditAlternativeController,
  EditCriterionController,
  EditTherapeuticContextController,
  EditDataSourceController,
  angular
) {
    return angular.module('elicit.evidence', [])
      .controller('EvidenceController', EvidenceController)
      .controller('EditAlternativeController', EditAlternativeController)
      .controller('EditCriterionController', EditCriterionController)
      .controller('EditTherapeuticContextController', EditTherapeuticContextController)
      .controller('EditDataSourceController', EditDataSourceController)
      ;
  });
