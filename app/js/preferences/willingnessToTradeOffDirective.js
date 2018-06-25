'use strict';
define(['lodash'], 
  function(_) {
  var dependencies = [
    'mcdaRootPath'
  ];
  var WillingnessToTradeOffDirective = function(
    mcdaRootPath
  ) {
    return {
      restrict: 'E',
      scope: {
        problem: '='
      },
      templateUrl: mcdaRootPath + 'js/preferences/willingnessToTradeOffDirective.html',
      link: function(scope) {
        scope.criteria = decorateWithId(scope.problem.criteria);
        scope.settings = {
          firstCriterion: scope.criteria[0],
          secondCriterion: scope.criteria[1]
        };
        firstCriterionChanged();

        scope.firstCriterionChanged = firstCriterionChanged;
        function firstCriterionChanged() {
          scope.filteredCriteria = _.reject(scope.criteria, ['id', scope.settings.firstCriterion.id]);
          scope.settings.secondCriterion = scope.filteredCriteria[0];
        }
        
        function decorateWithId(list) {
          return _.map(list, function(item, id) {
            item.id = id;
            return item;
          });
        }
      }
    };
  };
  return dependencies.concat(WillingnessToTradeOffDirective);
});
