'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'WorkspaceSettingsService'
  ];
  var WillingnessToTradeOffDirective = function(
    WorkspaceSettingsService
  ) {
    return {
      restrict: 'E',
      scope: {
        state: '='
      },
      templateUrl:  './willingnessToTradeOffDirective.html',
      link: function(scope) {
        init();
        scope.firstCriterionChanged = firstCriterionChanged;
        scope.secondCriterionChanged = secondCriterionChanged;

        scope.$on('elicit.settingsChanged', init);

        function init() {
          scope.problem = WorkspaceSettingsService.usePercentage() ? scope.state.percentified.problem : scope.state.dePercentified.problem;
          scope.criteria = decorateWithId(scope.problem.criteria);
          if(!scope.criteria) { return ;}
          scope.firstCriterionOptions = scope.criteria;
          scope.settings = {
            firstCriterion: scope.criteria[0]
          };
        firstCriterionChanged();
        secondCriterionChanged();

        }
        
        function firstCriterionChanged() {
          // FIXME: refactor repetition
          scope.secondCriterionOptions = _.reject(scope.criteria, ['id', scope.settings.firstCriterion.id]);
          if (!scope.settings.secondCriterion || scope.settings.secondCriterion.id === scope.settings.firstCriterion.id) {
            scope.settings.secondCriterion = scope.secondCriterionOptions[0];
          }
        }

        function secondCriterionChanged() {
          scope.firstCriterionOptions = _.reject(scope.criteria, ['id', scope.settings.secondCriterion.id]);
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
