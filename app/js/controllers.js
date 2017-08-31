'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.controllers', ['elicit.effectsTableService', 'elicit.util'])
    .controller('ChooseProblemController', require('mcda/controllers/chooseProblemController'))
    .controller('WorkspaceController', require('mcda/controllers/workspaceController'))
    .controller('MCDABenefitRiskController', require('mcda/benefitRisk/mcdaBenefitRiskController'))
    .controller('EvidenceController', require('mcda/evidence/evidenceController'))
    .controller('PreferencesController', require('mcda/preferences/preferencesController'))
    .controller('ScaleRangeController', require('mcda/subProblem/scaleRangeController'))
    .controller('PartialValueFunctionController', require('mcda/preferences/partialValueFunctionController'))
    .controller('OrdinalSwingController', require('mcda/preferences/ordinalSwingController'))
    .controller('IntervalSwingController', require('mcda/preferences/intervalSwingController'))
    .controller('ExactSwingController', require('mcda/preferences/exactSwingController'))
    ;
});
