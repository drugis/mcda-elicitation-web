'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    'significantDigits'
  ];

  var EffectsTableService = function(significantDigits) {
    var NOT_ENTERED = '';

    function buildEffectsTable(criteria) {
      var tableRows = angular.copy(criteria);
      var useFavorability = _.find(criteria, function(criterion) {
        return criterion.hasOwnProperty('isFavorable');
      });
      if (useFavorability) {
        var favorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Favorable effects'
        };
        var unFavorabilityHeader = {
          isHeaderRow: true,
          headerText: 'Unfavorable effects'
        };
        var partition = _.partition(tableRows, ['isFavorable', true]);
        var orderedFavorableCriteria = partition[0];
        var orderedUnfavorableCriteria = partition[1];
        tableRows = [].concat(
          [favorabilityHeader],
          orderedFavorableCriteria,
          [unFavorabilityHeader],
          orderedUnfavorableCriteria);
      }
      tableRows = buildTableRows(tableRows);
      return tableRows;
    }

    function buildTableRows(rows) {
      return _.reduce(rows, function(accum, row) {
        if (row.isHeaderRow) {
          return accum.concat(row);
        }
        var criterion = _.omit(row, ['dataSources']);
        criterion.numberOfDataSources = row.dataSources.length;
        accum = accum.concat(_.map(row.dataSources, function(dataSource, index) {
          var newDataSource = angular.copy(dataSource);
          return {
            criterion: criterion,
            isFirstRow: index === 0,
            dataSource: newDataSource
          };
        }));
        return accum;
      }, []);
    }

    function createEffectsTableInfo(performanceTable) {
      return _.reduce(performanceTable, function(accum, tableEntry) {
        var dataSourceId = tableEntry.dataSource;
        if (accum[dataSourceId]) {
          return accum;
        } else if (tableEntry.alternative) {
          accum[dataSourceId] = createAbsoluteInfo(dataSourceId, performanceTable);
        } else {
          accum[dataSourceId] = createRelativeInfo();
        }
        return accum;
      }, {});
    }

    function createRelativeInfo() {
      return {
        isAbsolute: false,
        hasUncertainty: true
      };
    }

    function createAbsoluteInfo(dataSourceId, performanceTable) {
      return {
        isAbsolute: true,
        studyDataLabelsAndUncertainty: createStudyDataLabelsAndUncertainty(dataSourceId, performanceTable)
      };
    }

    function createStudyDataLabelsAndUncertainty(dataSourceId, performanceTable) {
      return _(performanceTable)
        .filter(['dataSource', dataSourceId])
        .reduce(buildLabels, {});
    }

    function buildLabels(accum, entryForCriterion) {
      accum[entryForCriterion.alternative] = buildLabel(entryForCriterion);
      return accum;
    }

    function isStudyDataAvailable(effectsTableInfo) {
      return !!(_.find(effectsTableInfo, function(infoEntry) {
        return infoEntry.distributionType !== 'relative';
      }));
    }

    function buildLabel(entry) {
      var performance = entry.performance;
      var hasUncertainty = determineUncertainty(performance.distribution);
      var effectLabel = buildEffectLabel(performance);
      var effectValue = buildEffectValueLabel(performance);
      var distributionLabel = buildDistributionLabel(performance.distribution);

      return {
        effectLabel: effectLabel,
        effectValue: effectValue,
        distributionLabel: distributionLabel,
        hasUncertainty: hasUncertainty
      };
    }

    function determineUncertainty(distribution) {
      return !!distribution &&
        distribution.type !== 'empty' &&
        distribution.type !== 'exact';
    }

    function buildEffectValueLabel(performance) {
      if (performance.effect && performance.effect.type !== 'empty') {
        return performance.effect.value;
      } else {
        return '';
      }
    }

    function buildDistributionLabel(distribution) {
      if (!distribution) {
        return NOT_ENTERED;
      } else if (distribution.type === 'dt') {
        return buildStudentsTLabel(distribution.parameters);
      } else if (distribution.type === 'dnorm') {
        return buildNormalLabel(distribution.parameters);
      } else if (distribution.type === 'dbeta') {
        return buildBetaLabel(distribution.parameters);
      } else if (distribution.type === 'dsurv' || distribution.type === 'dgamma') {
        return buildGammaLabel(distribution.parameters);
      } else if (distribution.type === 'exact') {
        return distribution.value + '';
      } else if (distribution.type === 'empty') {
        return distribution.value ? distribution.value : '';
      }
    }

    function buildStudentsTLabel(parameters) {
      return 'Student\'s t(' +
        significantDigits(parameters.mu) + ', ' +
        significantDigits(parameters.stdErr) + ', ' +
        significantDigits(parameters.dof) + ')';
    }

    function buildNormalLabel(parameters) {
      return 'Normal(' +
        significantDigits(parameters.mu) + ', ' +
        significantDigits(parameters.sigma) + ')';
    }

    function buildBetaLabel(parameters) {
      return 'Beta(' +
        significantDigits(parameters.alpha) + ', ' +
        significantDigits(parameters.beta) + ')';
    }

    function buildGammaLabel(parameters) {
      return 'Gamma(' +
        significantDigits(parameters.alpha) + ', ' +
        significantDigits(parameters.beta) + ')';
    }

    function buildEffectLabel(performance) {
      if (!performance.effect) {
        if (performance.distribution.input && performance.distribution.type !== 'dt') {
          return buildEffectInputLabel(performance.distribution.input);
        } else if (performance.distribution.type === 'exact') {
          return performance.distribution.value;
        } else {
          return NOT_ENTERED;
        }
      } else if (performance.effect.input) {
        return buildEffectInputLabel(performance.effect.input);
      } else if (performance.effect.type === 'empty') {
        return performance.effect.value !== undefined ? performance.effect.value : '';
      } else {
        return performance.effect.value;
      }
    }

    function buildEffectInputLabel(input) {
      var percentage = input.scale === 'percentage' ? '%' : '';
      if (input.stdErr) {
        return input.value + percentage + ' (' + input.stdErr + percentage + ')';
      } else if (input.lowerBound && input.upperBound) {
        return input.value + percentage + ' (' + input.lowerBound + percentage + '; ' + input.upperBound + percentage + ')';
      } else if (input.value && input.sampleSize) {
        return input.value + percentage + ' / ' + input.sampleSize;
      } else if (input.events && input.sampleSize) {
        return input.events + ' / ' + input.sampleSize;
      } else {
        return input.value + percentage;
      }
    }

    function createIsCellAnalysisViable(rows, alternatives, effectsTableInfo, scales) {
      return _.reduce(rows, function(accum, row) {
        if (row.isHeaderRow) {
          return accum;
        } else {
          accum[row.dataSource.id] = createViabilityRows(row.dataSource.id, alternatives, effectsTableInfo, scales);
          return accum;
        }
      }, {});
    }

    function createIsCellAnalysisViableForCriterionCard(criterion, alternatives, effectsTableInfo, scales) {
      return _.reduce(criterion.dataSources, function(accum, dataSource) {
        accum[dataSource.id] = createViabilityRows(dataSource.id, alternatives, effectsTableInfo, scales);
        return accum;
      }, {});
    }

    function createViabilityRows(dataSourceId, alternatives, effectsTableInfo, scales) {
      return _.reduce(alternatives, function(accum, alternative) {
        accum[alternative.id] = isCellViable(dataSourceId, alternative.id, effectsTableInfo, scales);
        return accum;
      }, {});
    }

    function isCellViable(dataSourceId, alternativeId, effectsTableInfo, scales) {
      return isRelative(dataSourceId, effectsTableInfo) ||
        hasEffectValueLabel(dataSourceId, alternativeId, effectsTableInfo) ||
        hasScaleValue(dataSourceId, alternativeId, scales);
    }

    function isRelative(dataSourceId, effectsTableInfo) {
      return !effectsTableInfo[dataSourceId].isAbsolute;
    }

    function hasEffectValueLabel(dataSourceId, alternativeId, effectsTableInfo) {
      return effectsTableInfo[dataSourceId].studyDataLabelsAndUncertainty[alternativeId].effectValue !== '';
    }

    function hasScaleValue(dataSourceId, alternativeId, scales) {
      var smaaValue;
      if (scales) {
        smaaValue = scales[dataSourceId][alternativeId]['50%'];
      }
      return !!scales && !isNaN(smaaValue) && smaaValue !== null;
    }

    return {
      buildEffectsTable: buildEffectsTable,
      createEffectsTableInfo: createEffectsTableInfo,
      isStudyDataAvailable: isStudyDataAvailable,
      buildTableRows: buildTableRows,
      createIsCellAnalysisViable: createIsCellAnalysisViable,
      createIsCellAnalysisViableForCriterionCard: createIsCellAnalysisViableForCriterionCard
    };
  };

  return dependencies.concat(EffectsTableService);
});
