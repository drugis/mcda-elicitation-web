'use strict';
define(['lodash'],
  function(_) {
    var dependencies = ['PartialValueFunctionService'];
    var PreferenceElicitationTable = function(pvf) {
      return {
        restrict: 'E',
        scope: {
          criteria: '=',
          mostImportantCriterionId: '='
        },
        templateUrl: './preferenceElicitationTableDirective.html',
        link: function(scope) {
          scope.openElicitation = updateShownElicitations;
          scope.pvf = pvf;
          var criteriaById = _.keyBy(scope.criteria, 'id');

          scope.mostImportantCriterion = _.find(scope.criteria, ['id', scope.mostImportantCriterionId]);

          function updateShownElicitations(criterionId) {
            scope.showElicitation = _.mapValues(criteriaById, function(criterion) {
              return criterion.id === criterionId;
            });
          }
        }
      };
    };
    return dependencies.concat(PreferenceElicitationTable);
  });