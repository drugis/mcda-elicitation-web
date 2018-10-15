'use strict';
define(['lodash'],
  function(_) {
    var dependencies = ['$modal', 'PartialValueFunctionService', 'significantDigits'];
    var PreferenceElicitationTable = function($modal, pvf, significantDigits) {
      return {
        restrict: 'E',
        scope: {
          criteria: '=',
          mostImportantCriterionId: '=',
          values: '='
        },
        templateUrl: './preferenceElicitationTableDirective.html',
        link: function(scope) {
          scope.openElicitation = openElicitation;
          scope.pvf = pvf;
          scope.significantDigits = significantDigits;

          var criteriaById = _.keyBy(scope.criteria, 'id');

          scope.isValueSet = _.mapValues(scope.criteria, function(criterion) {
            return criterion.id === scope.mostImportantCriterionId;
          });

          scope.mostImportantCriterion = _.find(scope.criteria, ['id', scope.mostImportantCriterionId]);
          scope.values[scope.mostImportantCriterionId] = 100;

          function openElicitation(criterionId) {
            $modal.open({
              templateUrl: './setMatchingWeight.html',
              controller: 'SetMatchingWeightController',
              size: 'large',
              resolve: {
                mostImportantCriterion: function() {
                  return scope.mostImportantCriterion;
                },
                secondaryCriterion: function() {
                  return criteriaById[criterionId];
                },
                callback: function() {
                  return function(weight) {
                    scope.isValueSet[criterionId] = true;
                    scope.values[criterionId] = weight;
                  };
                }
              }
            });
          }
        }
      };
    };
    return dependencies.concat(PreferenceElicitationTable);
  });
