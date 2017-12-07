'use strict';
define(['lodash'], function(_) {
  var dependencies = ['OrderingResource'];
  var OrderingService = function(OrderingResource) {

    function getOrderedCriteriaAndAlternatives(problem, stateParams) {
      return OrderingResource.get(stateParams).$promise.then(function(ordering) {
        var orderedAlternatives = _(ordering.alternatives)
          .filter(function(alternativeId) {
            return problem.alternatives[alternativeId];
          })
          .map(function(alternativeId) {
            return _.extend({}, problem.alternatives[alternativeId], {
              id: alternativeId
            });
          })
          .value();
        var orderedCriteria = _(ordering.criteria)
          .filter(function(criterionId) {
            return problem.criteria[criterionId];
          })
          .map(function(criterionId) {
            return _.extend({}, problem.criteria[criterionId], {
              id: criterionId
            });
          })
          .value();
          return {
            alternatives: orderedAlternatives,
            criteria: orderedCriteria
          };
      });
    }

    return {
      getOrderedCriteriaAndAlternatives: getOrderedCriteriaAndAlternatives
    };
  };
  return dependencies.concat(OrderingService);
});