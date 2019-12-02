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
        scope.nrAlternatives = _.keys(scope.alternatives).length;
        scope.tableRows = EffectsTableService.buildEffectsTable(scope.criteria);
        scope.$watch('toggledColumns', function() {
          scope.numberOfColumns = _.filter(scope.toggledColumns).length;
        }, true);
      }
    };
  };
  return dependencies.concat(SensitivityTableDirective);
});
