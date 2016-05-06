'use strict';
define(function(require) {
  var angular = require('angular');

  var dependencies = ['elicit.util'];

  var EffectsTableService = function(ValueTreeUtil) {
    function buildEffectsTableData(problem, valueTree) {
      var criteriaNodes = ValueTreeUtil.findCriteriaNodes(valueTree);
      var effectsTable = [];

      angular.forEach(criteriaNodes, function(criteriaNode) {
        var path = ValueTreeUtil.findTreePath(criteriaNode, valueTree);
        effectsTable.push({
          path: path.slice(1), // omit top-level node
          criteria: _.map(criteriaNode.criteria, function(criterionKey) {
            return {
              key: criterionKey,
              value: problem.criteria[criterionKey]
            };
          })
        });
      });

      return effectsTable;
    }
    return {
      buildEffectsTableData: buildEffectsTableData
    };
  };

  return angular.module('elicit.effectsTableService', dependencies).factory('EffectsTableService', EffectsTableService);
});
