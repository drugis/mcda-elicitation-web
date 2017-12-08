'use strict';
define(['lodash'], function(_) {
  var dependencies = [];

  var EffectsTableService = function() {
    function pickOrderedIds(criteria, ids) {
      return _(criteria).
      filter(function(criterion) {
          return ids.indexOf(criterion.id) >= 0;
        })
        .map('id')
        .value();
    }

    function buildEffectsTable(problem, criteria) {
      if (problem.valueTree) {
        var favorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Favorable effects'
        };
        var unFavorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Unfavorable effects'
        };
        var orderedFavorableCriteria = pickOrderedIds(criteria, problem.valueTree.children[0].criteria);
        var orderedUnfavorableCriteria = pickOrderedIds(criteria, problem.valueTree.children[1].criteria);
        return [].concat(
          favorabilityHeader,
          orderedFavorableCriteria,
          unFavorabilityHeader,
          orderedUnfavorableCriteria);
      } else {
        return _.map(criteria, 'id');
      }
    }
    return {
      buildEffectsTable: buildEffectsTable
    };
  };

  return dependencies.concat(EffectsTableService);
});