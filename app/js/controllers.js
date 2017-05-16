'use strict';
define(function(require) {
  var angular = require('angular');
  return angular.module('elicit.controllers', ['elicit.effectsTableService'])
    .controller('ChooseProblemController', require('mcda/controllers/chooseProblem'))
    .controller('WorkspaceController', require('mcda/controllers/workspace'))
    .controller('ScenarioController', require('mcda/controllers/scenario'))
    .controller('EvidenceController', require('mcda/controllers/evidenceController'))
    .controller('PreferencesController', require('mcda/controllers/preferences'))
    .controller('ScaleRangeController', require('mcda/controllers/scaleRangeController'))
    .controller('PartialValueFunctionController', require('mcda/controllers/partialValueFunction'))
    .controller('OrdinalSwingController', require('mcda/controllers/ordinalSwing'))
    .controller('IntervalSwingController', require('mcda/controllers/intervalSwing'))
    .controller('ExactSwingController', require('mcda/controllers/exactSwing'))
    .controller('ResultsController', require('mcda/controllers/results'))
    ;
});
