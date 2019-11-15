'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'EffectsTableService',
    'WorkspaceSettingsService'
  ];
  var SmaaTableDirective = function(
    EffectsTableService,
    WorkspaceSettingsService
  ) {
    return {
      restrict: 'E',
      scope: {
        state: '=',
        criteria: '=',
        alternatives: '=',
        scales: '=',
        toggledColumns: '='
      },

      templateUrl: './smaaTableDirective.html',
      link: function(scope) {
        roundScales();
        setProblem();

        scope.rows = EffectsTableService.buildEffectsTable(scope.criteria);
        scope.nrAlternatives = _.keys(scope.alternatives).length;
        scope.numberOfColumns = _.filter(scope.toggledColumns).length;

        scope.$on('elicit.settingsChanged', setProblem);
        scope.$watch('scales', roundScales, true);

        function setProblem() {
          scope.problem = WorkspaceSettingsService.usePercentage() ? scope.state.percentified.problem : scope.state.dePercentified.problem;
        }

        function roundScales() {
          scope.scalesRounded = EffectsTableService.getRoundedScales(scope.scales);
        }
      }
    };
  };
  return dependencies.concat(SmaaTableDirective);
});
