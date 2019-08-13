'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'EffectsTableService'
  ];
  var SensitivityTableDirective = function(
    EffectsTableService
  ) {
    return {
      restrict: 'E',
      scope: {
        editMode: '=',
        toggledColumns: '=',
        alternatives: '=',
        scenario: '=',
        scales: '=',
        modifiableScales: '=',
        sensitivityScalesChanged: '=',
        isEditing: '=',
        criteria: '='
      },
      templateUrl: './sensitivityTableDirective.html',
      link: function(scope) {
        // init
        scope.nrAlternatives = _.keys(scope.alternatives).length;
        scope.tableRows = EffectsTableService.buildEffectsTable(scope.criteria);
      }
    };
  };
  return dependencies.concat(SensitivityTableDirective);
});
