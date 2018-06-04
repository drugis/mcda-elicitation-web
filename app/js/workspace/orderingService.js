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

        var orderedAlternatives = order(ordering.alternatives, problem.alternatives);
        var orderedCriteria = order(ordering.criteria, problem.criteria);
        if (ordering.dataSources) {
          orderedCriteria = orderDataSources(ordering.dataSources, orderedCriteria);
        }
        return {
          alternatives: orderedAlternatives,
          criteria: orderedCriteria
        };
      });
    }

    function saveOrdering(stateParams, criteria, alternatives) {
      return OrderingResource.put(stateParams, {
        criteria: _.map(criteria, 'id'),
        alternatives: _.map(alternatives, 'id'),
        dataSources: _.reduce(criteria, function(accum, criterion) {
          return accum.concat(_.map(criterion.dataSources, 'id'));
        }, [])
      }).$promise;
    }

    function getNewOrdering(problem) {
      var ordering = {
        alternatives: _.map(problem.alternatives, function(alternative, alternativeId) {
          return _.extend({}, alternative, { id: alternativeId });
        }),
        criteria: getOrderedCriteria(problem)
      };
      return ordering;
    }

    // private
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

    function order(ordering, objectsToOrder) {
      return _(ordering)
        .filter(function(id) {
          return objectsToOrder[id];
        })
        .map(function(id) {
          return _.extend({}, objectsToOrder[id], {
            id: id
          });
        })
        .value();
    }

    function orderDataSources(ordering, criteria) {
      return _.map(criteria, function(criterion) {
        var newCriterion = _.cloneDeep(criterion);
        newCriterion.dataSources = _(ordering)
          .filter(function(dataSourceId) {
            return _.find(criterion.dataSources, ['id', dataSourceId]);
          })
          .map(function(dataSourceId) {
            return _.find(criterion.dataSources, ['id', dataSourceId]);
          })
          .value();
        return newCriterion;
      });
    }
    return {
      getOrderedCriteriaAndAlternatives: getOrderedCriteriaAndAlternatives,
      saveOrdering: saveOrdering,
      getNewOrdering: getNewOrdering
    };
  };
  return dependencies.concat(OrderingService);
});
