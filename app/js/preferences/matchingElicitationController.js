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
    var MatchingElicitationController = function($scope, $stateParams,
      SwingWeightingService,
      PageTitleService,
      currentScenario,
      taskDefinition
    ) {
      $scope.isPrecise = true;
      PageTitleService.setPageTitle('MatchingElicitationController', 'Matching elicitation');

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
        'Matching elicitation',
        toBackEnd);
    };
    return dependencies.concat(MatchingElicitationController);
  });
