'use strict';
var requires = [
  'mcda/evidence/evidenceController',
  'mcda/evidence/editAlternativeController',
  'mcda/evidence/editCriterionController',
  'mcda/evidence/editTherapeuticContextController',
  'mcda/evidence/evidenceService'
];
define(['angular'].concat(requires), function(
  angular,
  EvidenceController,
  EditAlternativeController,
  EditCriterionController,
  EditTherapeuticContextController,
  EvidenceService
) {
  return angular.module('elicit.evidence', [])
    .controller('EvidenceController', EvidenceController)
    .controller('EditAlternativeController', EditAlternativeController)
    .controller('EditCriterionController', EditCriterionController)
    .controller('EditTherapeuticContextController', EditTherapeuticContextController)
    .factory('EvidenceService', EvidenceService)
    ;
});