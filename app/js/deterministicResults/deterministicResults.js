'use strict';
define([
  './deterministicResultsController',
  '../../ts/DeterministicTab/DeterministicTab',

  './deterministicWeightsTableDirective',
  './lineChartDirective',
  './measurementSensitivityDirective',
  './preferencesSensitivityDirective',
  './sensitivityInputDirective',
  './sensitivityTableDirective',
  './valueProfileTableDirective',
  './valueProfilePlotDirective',
  './valueProfilesDirective',

  './deterministicResultsService',

  'angular',
  'react2angular',
  'angular-patavi-client'
], function (
  DeterministicResultsController,
  DeterministicTab,

  deterministicWeightsTableDirective,
  lineChartDirective,
  measurementSensitivityDirective,
  preferencesSensitivityDirective,
  sensitivityInputDirective,
  sensitivityTableDirective,
  valueProfileTableDirective,
  valueProfilePlotDirective,
  valueProfilesDirective,

  DeterministicResultsService,

  angular,
  react2angular
) {
  return angular
    .module('elicit.deterministicResults', ['patavi', 'elicit.results'])
    .controller(
      'DeterministicResultsController',
      DeterministicResultsController
    )

    .directive('deterministicWeightsTable', deterministicWeightsTableDirective)
    .directive('lineChart', lineChartDirective)
    .directive('measurementSensitivity', measurementSensitivityDirective)
    .directive('preferencesSensitivity', preferencesSensitivityDirective)
    .directive('sensitivityInput', sensitivityInputDirective)
    .directive('sensitivityTable', sensitivityTableDirective)
    .directive('valueProfileTable', valueProfileTableDirective)
    .directive('valueProfilePlot', valueProfilePlotDirective)
    .directive('valueProfiles', valueProfilesDirective)

    .factory('DeterministicResultsService', DeterministicResultsService)
    .component(
      'deterministicTab',
      react2angular.react2angular(DeterministicTab.default, [
        'scenarios',
        'currentScenarioId',
        'workspaceId',
        'problem',
        'settings',
        'updateAngularScenario',
        'toggledColumns',
        'workspace',
        'scales',
        'subproblems',
        'currentSubproblem',
        'editMode'
      ])
    );
});
