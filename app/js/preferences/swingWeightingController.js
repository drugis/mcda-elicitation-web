'use strict';
define(['lodash'], function (_) {
  var dependencies = [
    '$scope',
    '$stateParams',
    'SwingWeightingService',
    'PageTitleService',
    'PartialValueFunctionService',
    'currentScenario',
    'taskDefinition'
  ];
  var SwingWeightingController = function (
    $scope,
    $stateParams,
    SwingWeightingService,
    PageTitleService,
    PartialValueFunctionService,
    currentScenario,
    taskDefinition
  ) {
    $scope.getUnitOfMeasurement =
      PartialValueFunctionService.getUnitOfMeasurement;
    PageTitleService.setPageTitle(
      'SwingWeightingController',
      'Precise swing weighting'
    );

    var sliderOptions = {
      floor: 1,
      ceil: 100,
      translate: function (value) {
        return value + '%';
      }
    };

    function getValues(criteria) {
      return _.mapValues(criteria, function () {
        return 100;
      });
    }

    function toBackEnd(mostImportantCriterionId) {
      return function (value, criterionId) {
        return {
          type: 'exact swing',
          ratio: 1 / (value / 100),
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
      'Precise swing weighting',
      toBackEnd
    );
  };
  return dependencies.concat(SwingWeightingController);
});
