'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'mcdaRootPath'
  ];
  var WillingnessToTradeOffDirective = function(mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        problem: '='
      },
      templateUrl: mcdaRootPath + 'js/preferences/willingnessToTradeOffDirective.html',
      link: function(scope) {
        var criteriaWithId = decorateWithId(scope.problem.criteria);
        scope.firstCriterionOptions = criteriaWithId;
        scope.settings = {
          firstCriterion: criteriaWithId[0]
        };
        scope.firstCriterionChanged = firstCriterionChanged;
        scope.secondCriterionChanged = secondCriterionChanged;

        firstCriterionChanged();
        secondCriterionChanged();

        function firstCriterionChanged() {
          // FIXME: refactor repetition
          scope.secondCriterionOptions = _.reject(criteriaWithId, ['id', scope.settings.firstCriterion.id]);
          if (!scope.settings.secondCriterion || scope.settings.secondCriterion.id === scope.settings.firstCriterion.id) {
            scope.settings.secondCriterion = scope.secondCriterionOptions[0];
          }
        }

        function secondCriterionChanged() {
          scope.firstCriterionOptions = _.reject(criteriaWithId, ['id', scope.settings.secondCriterion.id]);
          if (!scope.settings.firstCriterion || scope.settings.firstCriterion.id === scope.settings.secondCriterion.id) {
            scope.settings.firstCriterion = scope.firstCriterionOptions[0];
          }
        }

        function decorateWithId(list) {
          return _.map(list, function(item, id) {
            return _.extend({}, item, {
              id: id
            });
          });
        }
      }
    };
  };
  
  return dependencies.concat(WillingnessToTradeOffDirective);
});
