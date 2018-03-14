'use strict';
define(['lodash'], function(_) {
  var dependencies = [];

  var EffectsTableService = function() {
    function flattenValueTreeChildren(child) {
      if (child.criteria) {
        return child.criteria;
      } else {
        return _.flatten(_.map(child.children, 'criteria'));
      }
    }

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
        var orderedFavorableCriteria = pickOrderedIds(criteria, flattenValueTreeChildren(problem.valueTree.children[0]));
        var orderedUnfavorableCriteria = pickOrderedIds(criteria, flattenValueTreeChildren(problem.valueTree.children[1]));
        return [].concat(
          favorabilityHeader,
          orderedFavorableCriteria,
          unFavorabilityHeader,
          orderedUnfavorableCriteria);
      } else {
        return _.map(criteria, 'id');
      }
    }

    function createEffectsTableInfo(performanceTable) {
      return _.reduce(performanceTable, function(accum, tableEntry) {
        if (accum[criterionId]) { return accum; }
        var criterionId = tableEntry.criterion;
        if (tableEntry.performance.type === 'exact') {
          accum[criterionId] = {
            distributionType: 'exact',
            hasStudyData: false
          };
        } else if (tableEntry.alternative) {
          accum[criterionId] = {
            distributionType: tableEntry.performance.type,
            hasStudyData: true,
            studyDataLabels: _(performanceTable)
              .filter(function(tableEntry) {
                return criterionId === tableEntry.criterion;
              })
              .reduce(function(accum, entryForCriterion) {
                var label;
                var parameters = entryForCriterion.performance.parameters;
                switch (entryForCriterion.performance.type) {
                  case 'dt':
                    label = parameters.mu + ' ± ' + parameters.stdErr + ' (' + (parameters.dof + 1) + ')';
                    break;
                  case 'dnorm':
                    label = parameters.mu + ' ± ' + parameters.sigma;
                    break;
                  case 'dbeta':
                    label = (parameters.alpha - 1) + ' / ' + (parameters.beta + parameters.alpha - 2);
                    break;
                  case 'dsurv':
                    label = (parameters.alpha - 0.001) + ' / ' + (parameters.beta - 0.001);
                    break;
                }
                accum[entryForCriterion.alternative] = label;
                return accum;
              }, {})
          };
        } else {
          accum[tableEntry.criterion] = {
            distributionType: 'relative',
            hasStudyData: false
          };
        }
        return accum;
      }, {});
    }

    function isStudyDataAvailable(effectsTableInfo){
      return _.find(effectsTableInfo, function(infoEntry) {
        return !!(infoEntry.distributionType !== 'exact' && infoEntry.distributionType !== 'relative');
      });
    }

    return {
      buildEffectsTable: buildEffectsTable,
      createEffectsTableInfo: createEffectsTableInfo,
      isStudyDataAvailable:isStudyDataAvailable
    };
  };

  return dependencies.concat(EffectsTableService);
});