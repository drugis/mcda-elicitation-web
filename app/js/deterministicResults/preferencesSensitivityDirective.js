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

          scope.$on('elicit.legendChanged', init);

          init();

          function init() {
            scope.selectedCriterion = scope.criteria[0];
            doPreferencesSensitivity();
          }

          function doPreferencesSensitivity() {
            scope.plotOptions = {
              useTooltip: true,
              labelXAxis: 'Weight given to ' + scope.selectedCriterion.title,
              labelYAxis: 'total value',
            };

            delete scope.values;
            DeterministicResultsService.getPreferencesSensitivityResults(scope, scope.aggregateState.dePercentified).resultsPromise.then(function(result) {
              scope.values = DeterministicResultsService.pataviResultToLineValues(result.results, scope.alternatives, scope.scenario.state.legend);
            });
          }
        }
      };
    };
    return dependencies.concat(PreferencesSensitivityDirective);
  });
