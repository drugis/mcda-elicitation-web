'use strict';
define([],
  function() {
    var dependencies = [
      '$state',
      'PartialValueFunctionService'
    ];
    var PartialValueFunctionDirective = function(
      $state,
      PartialValueFunctionService
    ) {
      return {
        restrict: 'E',
        scope: {
          criteria: '=',
          editMode: '=',
          isAccessible: '=',
          isSafe: '=',
          pvfCoordinates: '=',
          resetWeights: '=',
          scenario: '=',
          tasks: '='
        },
        templateUrl: './partialValueFunctionDirective.html',
        link: function(scope) {
          scope.isPVFDefined = isPVFDefined;
          scope.setPVF = setPVF;

          function isPVFDefined(dataSource) {
            return dataSource.pvf && dataSource.pvf.type;
          }

          function setPVF(criterion, direction) {
            scope.scenario.state = PartialValueFunctionService.getNewScenarioState(scope.scenario, criterion, direction);
            scope.resetWeights();
            scope.scenario.$save($state.params, function(scenario) {
              scope.$emit('elicit.resultsAccessible', scenario);
            });
          }
        }
      };
    };
    return dependencies.concat(PartialValueFunctionDirective);
  });
