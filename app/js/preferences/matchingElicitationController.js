'use strict';
define(['lodash'],
  function(_) {
    var dependencies = [
      '$scope', '$stateParams',
      'SwingWeightingService',
      'PageTitleService',
      'PartialValueFunctionService',
      'currentScenario',
      'taskDefinition'
    ];
    var MatchingElicitationController = function(
      $scope,
      $stateParams,
      SwingWeightingService,
      PageTitleService,
      PartialValueFunctionService,
      currentScenario,
      taskDefinition
    ) {
      $scope.getUnitOfMeasurement = PartialValueFunctionService.getUnitOfMeasurement;
      $scope.isPrecise = true;
      PageTitleService.setPageTitle('MatchingElicitationController', 'Matching');

      var sliderOptions = {
        floor: 1,
        ceil: 100,
        translate: function(value) {
          return value + '%';
        }
      };
      var values;
      $scope.scalesPromise.then(function() {
        values = _.mapValues($scope.aggregateState.problem.criteria, function() {
          return -100;
        });
      });

      function getValues() {
        return values;
      }

      function canSave() {
        return !_.find(values, function(value) {
          return value < 0;
        });
      }

      function toBackEnd(mostImportantCriterionId) {
        return function(value, criterionId) {
          return {
            type: 'exact swing',
            ratio: 1 / value,
            criteria: [mostImportantCriterionId, criterionId]
          };
        };
      }

      SwingWeightingService.initWeightingScope(
        $scope,
        $stateParams,
        currentScenario,
        taskDefinition,
        sliderOptions,
        getValues,
        'Matching',
        toBackEnd,
        canSave);
    };
    return dependencies.concat(MatchingElicitationController);
  });
