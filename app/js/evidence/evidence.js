'use strict';
var requires = [
  'mcda/evidence/evidenceController',
  'mcda/evidence/editAlternativeController',
  'mcda/evidence/editCriterionController',
  'mcda/evidence/editTherapeuticContextController',
  'mcda/evidence/toggleColumnsController',
  'mcda/evidence/effectsTableService'
];
define(['angular'].concat(requires), function(
  angular,
  EvidenceController,
  EditAlternativeController,
  EditCriterionController,
  EditTherapeuticContextController,
  ToggleColumnsController,
  EffectsTableService
) {
  return angular.module('elicit.evidence', [])
    .controller('EvidenceController', EvidenceController)
    .controller('EditAlternativeController', EditAlternativeController)
    .controller('EditCriterionController', EditCriterionController)
    .controller('EditTherapeuticContextController', EditTherapeuticContextController)
    .controller('ToggleColumnsController', ToggleColumnsController)
    .factory('EffectsTableService', EffectsTableService)
    ;
});