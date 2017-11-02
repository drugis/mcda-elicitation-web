'use strict';
var requires = [
  'mcda/evidence/evidenceController',
  'mcda/evidence/editCriterionController',
  'mcda/evidence/editTherapeuticContextController'
];
define(['angular'].concat(requires), function(
  angular,
  EvidenceController,
  EditCriterionController,
  EditTherapeuticContextController
) {
  return angular.module('elicit.evidence', [])
    .controller('EvidenceController', EvidenceController)
    .controller('EditCriterionController', EditCriterionController)
    .controller('EditTherapeuticContextController', EditTherapeuticContextController)
    ;
});