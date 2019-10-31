'use strict';
define([],
  function() {
    var dependencies = [
      'DeterministicResultsService'
    ];
    var PreferencesSensitivityDirective = function(
      DeterministicResultsService
    ) {
      return {
        restrict: 'E',
        scope: {
          aggregateState: '=',
          alternatives: '=',
          criteria: '=',
          editMode: '=',
          scenario: '='
        },
        templateUrl: './preferencesSensitivityDirective.html',
        link: function(scope) {
          scope.doPreferencesSensitivity = doPreferencesSensitivity;

          init();

          scope.$on('elicit.legendChanged', function() {
            init();
          });

          function init() {
            scope.selectedCriterion = scope.criteria[0];
            doPreferencesSensitivity();
          }

          function doPreferencesSensitivity() {
            delete scope.preferencesValues;
            DeterministicResultsService.getPreferencesSensitivityResults(scope, scope.aggregateState.dePercentified).resultsPromise.then(function(result) {
              scope.values = DeterministicResultsService.pataviResultToLineValues(result.results, scope.alternatives, scope.scenario.state.legend);
            });
          }
        }
      };
    };
    return dependencies.concat(PreferencesSensitivityDirective);
  });
