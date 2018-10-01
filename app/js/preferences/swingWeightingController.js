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
    var SwingWeightingController = function($scope, $stateParams,
      SwingWeightingService,
      PageTitleService,
      currentScenario,
      taskDefinition
    ) {
      $scope.isPrecise = true;
      PageTitleService.setPageTitle('SwingWeightingController', 'Precise swing weighting');

      var sliderOptions = {
        floor: 1,
        ceil: 100,
        translate: function(value) {
          return value + '%';
        }
      };

      function getValues(criteria) {
        return _.reduce(_.keys(criteria), function(accum, criterionId) {
          accum[criterionId] = 100;
          return accum;
        }, {});
      }

      function toBackEnd(mostImportantCriterionId) {
        return function(value, criterionId) {
          return {
            type: 'exact swing',
            ratio: 1 / (value / 100),
            criteria: [mostImportantCriterionId, criterionId]
          };
        };
      }
      SwingWeightingService.initWeightingScope($scope,
        $stateParams,
        currentScenario,
        taskDefinition,
        sliderOptions,
        getValues,
        'Precise swing weighting',
        toBackEnd);
    };
    return dependencies.concat(SwingWeightingController);
  });
