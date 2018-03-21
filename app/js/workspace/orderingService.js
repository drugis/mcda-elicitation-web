'use strict';
define(['lodash'], function(_) {
  var dependencies = ['OrderingResource'];
  var OrderingService = function(OrderingResource) {

    function getOrderedCriteriaAndAlternatives(problem, stateParams) {
      return OrderingResource.get(stateParams).$promise.then(function(response) {
        var ordering = response.ordering;
        if (!ordering) {
          return getNewOrdering(problem);
        }

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

    function getNewOrdering(problem) {
      return {
        alternatives: _.map(problem.alternatives, function(alternative, alternativeId) {
          return _.extend({}, alternative, { id: alternativeId });
        }),
        criteria: getOrderedCriteria(problem)
      };
    }

    function saveOrdering(stateParams, criteria, alternatives) {
      return OrderingResource.put(stateParams, {
        criteria: _.map(criteria, 'id'),
        alternatives: _.map(alternatives, 'id')
      }).$promise;
    }

    function getOrderedCriteria(problem) {
      if (!problem.valueTree) {
        return _.map(problem.criteria, function(criterion, criterionId) {
          return _.extend({}, criterion, { id: criterionId });
        });
      }
      var criterionIds;
      if (problem.valueTree.children[0].criteria) {
        criterionIds = problem.valueTree.children[0].criteria;
      } else {
        criterionIds = _.flatten(_.map(problem.valueTree.children[0].children, 'criteria'));
      }
      return getSpecificFavorabilityCriteria(problem.criteria, criterionIds)
        .concat(getSpecificFavorabilityCriteria(problem.criteria, problem.valueTree.children[1].criteria));
    }

    function getSpecificFavorabilityCriteria(criteria, ids) {
      return _.reduce(criteria, function(accum, criterion, criterionId) {
        if (ids.indexOf(criterionId) >= 0) {
          accum.push(_.merge({}, criterion, { id: criterionId }));
        }
        return accum;
      }, []);
    }

    return {
      getOrderedCriteriaAndAlternatives: getOrderedCriteriaAndAlternatives,
      saveOrdering: saveOrdering,
      getNewOrdering: getNewOrdering
    };
  };
  return dependencies.concat(OrderingService);
});