'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$stateParams',
    '$modal',
    'EffectsTableService',
    'ToggleColumnsResource',
    'mcdaRootPath'
  ];
  var EffectsTableDirective = function(
    $stateParams,
    $modal,
    EffectsTableService,
    ToggleColumnsResource,
    mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'criteria': '=',
        'alternatives': '=',
        'valueTree': '=',
        'editMode': '=',
        'effectsTableInfo': '=',
        'scales': '=',
        'isStandAlone': '='
      },
      templateUrl: mcdaRootPath + 'js/effectsTable/effectsTable.html',
      link: function(scope) {
        // functions
        scope.toggleColumns = toggleColumns;

        // init
        scope.studyDataAvailable = EffectsTableService.isStudyDataAvailable(scope.effectsTableInfo);
    
        ToggleColumnsResource.get($stateParams).$promise.then(function(response) {
          var toggledColumns = response.toggledColumns;
          if (toggledColumns) {
            scope.toggledColumns = toggledColumns;
          } else {
            scope.toggledColumns = {
              criteria: true,
              description: true,
              units: true,
              references: true,
              strength: true
            };
          }
        });

        scope.$watch('criteria', function(newCriteria) {
          scope.keyedCriteria = _.keyBy(_.cloneDeep(newCriteria), 'id');
          scope.rows = EffectsTableService.buildEffectsTable(scope.valueTree, scope.keyedCriteria);
        }, true);
        scope.$watch('alternatives', function(newAlternatives) {
          scope.nrAlternatives = _.keys(scope.alternatives).length;
          scope.alternatives = newAlternatives;
        });

        function toggleColumns() {
          $modal.open({
            templateUrl: mcdaRootPath + 'js/evidence/toggleColumns.html',
            controller: 'ToggleColumnsController',
            resolve: {
              toggledColumns: function() {
                return scope.toggledColumns;
              },
              callback: function() {
                return function(newToggledColumns) {
                  scope.toggledColumns = newToggledColumns;
                  ToggleColumnsResource.put($stateParams, {
                    toggledColumns: scope.toggledColumns
                  });
                };
              }
            }
          });
        }
      }
    };
  };
  return dependencies.concat(EffectsTableDirective);
});