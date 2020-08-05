'use strict';
define([], function () {
  var dependencies = ['PartialValueFunctionService'];
  var TradeOffDirective = function (PartialValueFunctionService) {
    return {
      restrict: 'E',
      scope: {
        criteria: '=',
        criteriaHavePvf: '=',
        editMode: '=',
        importance: '=',
        isAccessible: '=',
        isSafe: '=',
        problem: '=',
        resetWeights: '=',
        tasks: '=',
        weights: '='
      },
      templateUrl: './tradeOffDirective.html',
      link: function (scope) {
        scope.isPVFDefined = isPVFDefined;

        scope.pvf = PartialValueFunctionService;

        scope.$watch('problem', (newProblem) => {
          if (newProblem) {
            scope.elicitationMethod = getElicitationMethod(scope.problem);
          }
        }, true);

        function getElicitationMethod(problem) {
          const preferences = problem.preferences;
          if (!preferences || !preferences.length) {
            return 'None';
          }
          if (preferences[0].type === 'ordinal') {
            return 'Ranking';
          }
          if (preferences[0].type === 'exact swing') {
            return 'Matching or Precise Swing Weighting';
          }
          if (preferences[0].type === 'ratio bound') {
            return 'Imprecise Swing Weighting';
          }
        }

        function isPVFDefined(dataSource) {
          return dataSource.pvf && dataSource.pvf.type;
        }
      }
    };
  };
  return dependencies.concat(TradeOffDirective);
});
