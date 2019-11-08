'use strict';
define([],
  function() {
    var dependencies = [];
    var PartialValueFunctionDirective = function() {
      return {
        restrict: 'E',
        scope: {
          criteria: '=',
          editMode: '=',
          isAccessible: '=',
          isSafe: '=',
          pvfCoordinates: '=',
          tasks: '='
        },
        templateUrl: './partialValueFunctionDirective.html',
        link: function(scope) {
          scope.isPVFDefined = isPVFDefined;

          function isPVFDefined(dataSource) {
            return dataSource.pvf && dataSource.pvf.type;
          }
        }
      };
    };
    return dependencies.concat(PartialValueFunctionDirective);
  });