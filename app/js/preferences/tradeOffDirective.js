'use strict';
define([],
  function() {
    var dependencies = [
      'PartialValueFunctionService'
    ];
    var TradeOffDirective = function(
      PartialValueFunctionService
    ) {
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
        link: function(scope) {
          scope.isPVFDefined = isPVFDefined;

          scope.pvf = PartialValueFunctionService;

          function isPVFDefined(dataSource) {
            return dataSource.pvf && dataSource.pvf.type;
          }
        }
      };
    };
    return dependencies.concat(TradeOffDirective);
  });
