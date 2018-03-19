'use strict';
var requires = [
  'mcda/evidence/evidenceController',
  'mcda/evidence/editAlternativeController',
  'mcda/evidence/editCriterionController',
  'mcda/evidence/editTherapeuticContextController',
  'mcda/evidence/toggleColumnsController',
  'mcda/evidence/effectsTableScalesCellDirective',
  'mcda/evidence/effectsTableService'
];
define(['angular', 'angular-resource'].concat(requires), function(
  angular,
  ngResource, // needed for .directive
  EvidenceController,
  EditAlternativeController,
  EditCriterionController,
  EditTherapeuticContextController,
  ToggleColumnsController,
  effectsTableScalesCell,
  EffectsTableService
) {
  return angular.module('elicit.evidence', [])
    .controller('EvidenceController', EvidenceController)
    .controller('EditAlternativeController', EditAlternativeController)
    .controller('EditCriterionController', EditCriterionController)
    .controller('EditTherapeuticContextController', EditTherapeuticContextController)
    .controller('ToggleColumnsController', ToggleColumnsController)
    .directive('effectsTableScalesCell', effectsTableScalesCell)
    .factory('EffectsTableService', EffectsTableService);
});