'use strict';
var requires = [
  'mcda/evidence/evidenceController',
  'mcda/evidence/editTherapeuticContextController'
];
define(['angular'].concat(requires), function(
  angular,
  EvidenceController,
  EditTherapeuticContextController
) {
  return angular.module('elicit.evidence', [])
    .controller('EvidenceController', EvidenceController)
    .controller('EditTherapeuticContextController', EditTherapeuticContextController);
});