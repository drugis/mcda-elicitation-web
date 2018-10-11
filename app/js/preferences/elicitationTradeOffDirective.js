'use strict';
define(['lodash'],
  function(_) {
    var dependencies = ['PartialValueFunctionService'];
    var PreferenceElicitationRow = function(pvf) {
      return {
        restrict: 'E',
        scope: {
          mostImportantCriterion: '=',
          secondaryCriterion: '='
        },
        templateUrl: './elicitationTradeOffDirective.html',
        link: function(scope) {
          scope.openElicitation = openElicitation;
          scope.pvf = pvf;

          scope.mostImportantCriterionValue = _.sum(scope.mostImportantCriterion.dataSources[0].pvf.range) / 2;
          scope.secondaryCriterionValue = _.sum(scope.secondaryCriterion.dataSources[0].pvf.range) / 2;

          function openElicitation() {
            scope.showElicitation = true;
          }
        }
      };
    };
    return dependencies.concat(PreferenceElicitationRow);
  });