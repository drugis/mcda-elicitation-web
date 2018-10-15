'use strict';
define(['lodash'],
  function(_) {
    var dependencies = [
      '$scope', '$stateParams',
      'SwingWeightingService',
      'PageTitleService',
      'currentScenario',
      'taskDefinition'
    ];
    var ImpreciseSwingWeightingController = function(
      $scope, $stateParams,
      SwingWeightingService,
      PageTitleService,
      currentScenario,
      taskDefinition
    ) {
      $scope.isImprecise = true;
      PageTitleService.setPageTitle('ImpreciseSwingWeightingController', 'Imprecise swing weighting');

      var sliderOptions = {
        floor: 1,
        ceil: 100,
        translate: function(value) {
          return value + '%';
        },
        noSwitching: true
      };

      function getValues(criteria) {
        return _.reduce(_.keys(criteria), function(accum, criterionId) {
          accum[criterionId] = {
            low: 1,
            high: 100
          };
          return accum;
        }, {});
      }

      function toBackEnd(mostImportantCriterionId) {
        return function(value, key) {
          return {
            type: 'ratio bound',
            bounds: [
              1 / (value.high / 100), // invert makes the .high become the lower value
              1 / (value.low / 100)
            ],
            criteria: [mostImportantCriterionId, key]
          };
        };
      }

      SwingWeightingService.initWeightingScope($scope,
        $stateParams,
        currentScenario,
        taskDefinition,
        sliderOptions,
        getValues,
        'Imprecise swing weighting',
        toBackEnd);
    };
    return dependencies.concat(ImpreciseSwingWeightingController);
  });
