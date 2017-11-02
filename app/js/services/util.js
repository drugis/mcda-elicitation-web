'use strict';
define(['lodash', 'angular'], function(_, angular) {

  return angular.module('elicit.util', [])
    .factory('intervalHull', function() {

      return function(scaleRanges) {
        if (!scaleRanges) {
          return [-Infinity, +Infinity];
        }
        return [
          Math.min.apply(null, _.map(_.values(scaleRanges), function(alt) {
            return alt['2.5%'];
          })),
          Math.max.apply(null, _.map(_.values(scaleRanges), function(alt) {
            return alt['97.5%'];
          }))
        ];
      };
    })

    .factory('addKeyHashToObject', function() {
      return function(object, key) {
        var newObject = _.cloneDeep(object);
        newObject.hash = _.map(key, function(f) {
          return f.charCodeAt(0);
        }).join('');
        newObject.id = key;
        return newObject;
      };
    })

    .factory('sortCriteriaWithW', function() {
      return function(criteria) {
        return _.sortBy(_.map(_.toPairs(criteria), function(crit, idx) {
          return _.extend({}, crit[1], {
            id: crit[0],
            w: 'w_' + (idx + 1)
          });
        }), 'w');
      };
    })

    .factory('ValueTreeUtil', function() {
      function findCriteriaNodes(valueTree) {
        // FIXME: eliminate this internal function
        function findCriteriaNodesInternal(valueTree, criteriaNodes) {
          if (valueTree.criteria) {
            criteriaNodes.push(valueTree);
          } else {
            angular.forEach(valueTree.children, function(childNode) {
              findCriteriaNodesInternal(childNode, criteriaNodes);
            });
          }
        }

        var criteriaNodes = [];
        findCriteriaNodesInternal(valueTree, criteriaNodes);
        return criteriaNodes;
      }


      function findTreePath(criteriaNode, valueTree) {
        if (valueTree.title === criteriaNode.title) {
          return [criteriaNode];
        } else if (valueTree.criteria) {
          // leaf node that we're not looking for
          return [];
        } else {
          var children = [];
          angular.forEach(valueTree.children, function(childNode) {
            var childPaths = findTreePath(criteriaNode, childNode);
            if (childPaths.length > 0) {
              children = [valueTree].concat(childPaths);
            }
          });
          return children;
        }
      }

      /**
       * Insert the criteria objects into the value tree.
       * valueTree: a value tree in which criteria are addressed by key.
       * criteria: a key-value map of criteria
       * returns: a value tree in which the key references are replaced by their values.
       */
      function addCriteriaToValueTree(valueTree, criteria) {
        var tree = angular.copy(valueTree);
        var criteriaNodes = findCriteriaNodes(tree);
        angular.forEach(criteriaNodes, function(criteriaNode) {
          criteriaNode.children = _.map(criteriaNode.criteria, function(key) {
            return criteria[key];
          });
        });
        return tree;
      }

      return {
        findCriteriaNodes: findCriteriaNodes,
        findTreePath: findTreePath,
        addCriteriaToValueTree: addCriteriaToValueTree
      };
    });
});