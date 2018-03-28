'use strict';
var requires = [
  'mcda/evidence/evidenceController',
  'mcda/evidence/editAlternativeController',
  'mcda/evidence/editCriterionController',
  'mcda/evidence/editTherapeuticContextController'
];
define(['angular', 'angular-resource'].concat(requires), function(
  angular,
  ngResource,
  EvidenceController,
  EditAlternativeController,
  EditCriterionController,
  EditTherapeuticContextController
) {
  return angular.module('elicit.evidence', [])
    .controller('EvidenceController', EvidenceController)
    .controller('EditAlternativeController', EditAlternativeController)
    .controller('EditCriterionController', EditCriterionController)
    .controller('EditTherapeuticContextController', EditTherapeuticContextController)
    ;
});