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
        .value();
    }

    function buildEffectsTable(valueTree, criteria) {
      if (valueTree) {
        var favorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Favorable effects'
        };
        var unFavorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Unfavorable effects'
        };
        var orderedFavorableCriteria = pickOrderedIds(criteria, flattenValueTreeChildren(valueTree.children[0]));
        var orderedUnfavorableCriteria = pickOrderedIds(criteria, flattenValueTreeChildren(valueTree.children[1]));
        return [].concat(
          favorabilityHeader,
          orderedFavorableCriteria,
          unFavorabilityHeader,
          orderedUnfavorableCriteria);
      } else {
        return criteria;
      }
    }

    function createEffectsTableInfo(performanceTable) {
      return _.reduce(performanceTable, function(accum, tableEntry) {
        var criterionId = tableEntry.criterion;
        if (accum[criterionId]) { return accum; }
        if (tableEntry.alternative) {
          accum[criterionId] = {
            distributionType: tableEntry.performance.type,
            hasStudyData: true,
            studyDataLabelsAndUncertainty: _(performanceTable)
              .filter(function(tableEntry) {
                return criterionId === tableEntry.criterion;
              })
              .reduce(function(accum, entryForCriterion) {
                var label;
                var parameters = entryForCriterion.performance.parameters;
                var hasUncertainty = true;
                switch (entryForCriterion.performance.type) {
                  case 'exact':
                    var performance = entryForCriterion.performance;
                    if (performance.stdErr !== undefined) {
                      label = performance.value + ' (' + Math.round(performance.stdErr * 1000) / 1000 + ')';
                    } else if (performance.lowerBound !== undefined && performance.upperBound !== undefined) {
                      label = performance.value + ' (' + performance.lowerBound +
                        '; ' + performance.upperBound + ')';
                    } else {
                      label = performance.value;
                      hasUncertainty = false;
                    }
                    if (!performance.isNormal) {
                      hasUncertainty = false;
                    }
                    break;
                  case 'dt':
                    label = parameters.mu + ' (' + Math.round(parameters.stdErr * 1000) / 1000 + '), ' + (parameters.dof + 1);
                    break;
                  case 'dnorm':
                    label = parameters.mu + ' (' + Math.round(parameters.sigma * 1000) / 1000 + ')';
                    break;
                  case 'dbeta':
                    label = (parameters.alpha - 1) + ' / ' + (parameters.beta + parameters.alpha - 2);
                    break;
                  case 'dgamma':
                    label = (parameters.alpha) + ' / ' + (parameters.beta);
                    break;
                  case 'dsurv':
                    label = (parameters.alpha - 0.001) + ' / ' + (parameters.beta - 0.001);
                    break;
                }
                accum[entryForCriterion.alternative] = {
                  label: label,
                  hasUncertainty: hasUncertainty
                };
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

    function isStudyDataAvailable(effectsTableInfo) {
      return !!(_.find(effectsTableInfo, function(infoEntry) {
        return infoEntry.distributionType !== 'relative' &&
          _.find(infoEntry.studyDataLabelsAndUncertainty, function(labelAndUncertainty) {
            return labelAndUncertainty.hasUncertainty;
          });
      }));
    }

    return {
      buildEffectsTable: buildEffectsTable,
      createEffectsTableInfo: createEffectsTableInfo,
      isStudyDataAvailable: isStudyDataAvailable
    };
  };

  return dependencies.concat(EffectsTableService);
});
