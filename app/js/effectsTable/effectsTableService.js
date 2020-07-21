'use strict';
define(['lodash', 'angular'], function (_, angular) {
  var dependencies = [
    '$filter',
    'WorkspaceSettingsService',
    'significantDigits'
  ];

  var EffectsTableService = function (
    $filter,
    WorkspaceSettingsService,
    significantDigits
  ) {
    var NOT_ENTERED = '';

    function buildEffectsTable(criteria) {
      var tableRows = angular.copy(criteria);
      var useFavorability = _.find(criteria, function (criterion) {
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
          orderedUnfavorableCriteria
        );
      }
      tableRows = buildTableRows(tableRows);
      return tableRows;
    }

    function buildTableRows(rows) {
      return _.reduce(
        rows,
        function (accum, row) {
          if (row.isHeaderRow) {
            return accum.concat(row);
          }
          var criterion = _.omit(row, ['dataSources']);
          criterion.numberOfDataSources = row.dataSources.length;
          accum = accum.concat(createRow(row.dataSources, criterion));
          return accum;
        },
        []
      );
    }

    function createRow(dataSources, criterion) {
      return _.map(dataSources, function (dataSource, index) {
        var newDataSource = angular.copy(dataSource);
        newDataSource.scale = getScale(dataSource.scale);
        return {
          criterion: criterion,
          isFirstRow: index === 0,
          dataSource: newDataSource
        };
      });
    }

    function getScale(scale) {
      var newScale = [];
      if (_.isNull(scale[0])) {
        newScale[0] = -Infinity;
      } else {
        newScale[0] = scale[0];
      }
      if (_.isNull(scale[1])) {
        newScale[1] = Infinity;
      } else {
        newScale[1] = scale[1];
      }
      return newScale;
    }

    function createEffectsTableInfo(performanceTable) {
      return _.reduce(
        performanceTable,
        function (accum, tableEntry) {
          var dataSourceId = tableEntry.dataSource;
          if (accum[dataSourceId]) {
            return accum;
          } else if (tableEntry.alternative) {
            accum[dataSourceId] = createAbsoluteInfo(
              dataSourceId,
              performanceTable
            );
          } else {
            accum[dataSourceId] = createRelativeInfo();
          }
          return accum;
        },
        {}
      );
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
        studyDataLabelsAndUncertainty: createStudyDataLabelsAndUncertainty(
          dataSourceId,
          performanceTable
        )
      };
    }

    function createStudyDataLabelsAndUncertainty(
      dataSourceId,
      performanceTable
    ) {
      return _(performanceTable)
        .filter(['dataSource', dataSourceId])
        .reduce(buildLabels, {});
    }

    function buildLabels(accum, entryForCriterion) {
      accum[entryForCriterion.alternative] = buildLabel(entryForCriterion);
      return accum;
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
      return (
        !!distribution &&
        distribution.type !== 'empty' &&
        distribution.type !== 'exact'
      );
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
        return buildNormalLabel(distribution);
      } else if (distribution.type === 'dbeta') {
        return buildBetaLabel(distribution.parameters);
      } else if (
        distribution.type === 'dsurv' ||
        distribution.type === 'dgamma'
      ) {
        return buildGammaLabel(distribution.parameters);
      } else if (distribution.type === 'exact') {
        return buildExactDistributionLabel(distribution);
      } else if (distribution.type === 'range') {
        return buildRangeDistributionLabel(distribution.parameters);
      } else if (distribution.type === 'empty') {
        return distribution.value ? distribution.value : '';
      }
    }

    function buildExactDistributionLabel(distribution) {
      if (distribution.input) {
        return buildEffectInputLabel(distribution.input);
      } else {
        return distribution.value + '';
      }
    }

    function buildRangeDistributionLabel(parameters) {
      return (
        '[' +
        significantDigits(parameters.lowerBound) +
        ', ' +
        significantDigits(parameters.upperBound) +
        ']'
      );
    }

    function buildStudentsTLabel(parameters) {
      return (
        "Student's t(" +
        significantDigits(parameters.mu) +
        ', ' +
        significantDigits(parameters.stdErr) +
        ', ' +
        significantDigits(parameters.dof) +
        ')'
      );
    }

    function buildNormalLabel(distribution) {
      if (hasPercentageNormalInput(distribution.input)) {
        return (
          'Normal(' +
          significantDigits(distribution.input.mu) +
          '%, ' +
          significantDigits(distribution.input.sigma) +
          '%)'
        );
      } else {
        return (
          'Normal(' +
          significantDigits(distribution.parameters.mu) +
          ', ' +
          significantDigits(distribution.parameters.sigma) +
          ')'
        );
      }
    }

    function hasPercentageNormalInput(input) {
      return (
        input &&
        input.scale === 'percentage' &&
        input.hasOwnProperty('mu') &&
        input.hasOwnProperty('sigma')
      );
    }

    function buildBetaLabel(parameters) {
      return (
        'Beta(' +
        significantDigits(parameters.alpha) +
        ', ' +
        significantDigits(parameters.beta) +
        ')'
      );
    }

    function buildGammaLabel(parameters) {
      return (
        'Gamma(' +
        significantDigits(parameters.alpha) +
        ', ' +
        significantDigits(parameters.beta) +
        ')'
      );
    }

    function buildEffectLabel(performance) {
      if (!performance.effect) {
        return buildEffectLabelFromDistribution(performance);
      } else if (performance.effect.input) {
        return buildEffectInputLabel(performance.effect.input);
      } else if (performance.effect.type === 'empty') {
        return performance.effect.value !== undefined
          ? performance.effect.value
          : '';
      } else {
        return performance.effect.value;
      }
    }

    function buildEffectLabelFromDistribution(performance) {
      if (isPercentageNormalDistribution(performance)) {
        return '';
      } else if (isOldNormalDistributionFromEffect(performance)) {
        return buildEffectInputLabel(performance.distribution.input);
      } else if (performance.distribution.type === 'exact') {
        return performance.distribution.value;
      } else {
        return NOT_ENTERED;
      }
    }

    function isOldNormalDistributionFromEffect(performance) {
      return (
        performance.distribution.input && performance.distribution.type !== 'dt'
      );
    }

    function isPercentageNormalDistribution(performance) {
      return (
        performance.distribution.input && performance.distribution.input.mu
      );
    }

    function buildEffectInputLabel(input) {
      var percentage = input.scale === 'percentage' ? '%' : '';

      if (input.hasOwnProperty('stdErr')) {
        return createSELabel(input, percentage);
      } else if (isValueCI(input)) {
        return createCILabel(input, percentage);
      } else if (isRange(input)) {
        return createRangeLabel(input, percentage);
      } else if (isValueSampleSize(input)) {
        return createValueSampleSizeLabel(input, percentage);
      } else if (isEventsSampleSize(input)) {
        return input.events + ' / ' + input.sampleSize;
      } else {
        return input.value + percentage;
      }
    }

    function createSELabel(input, percentage) {
      return input.value + percentage + ' (' + input.stdErr + percentage + ')';
    }

    function createValueSampleSizeLabel(input, percentage) {
      return input.value + percentage + ' / ' + input.sampleSize;
    }

    function createRangeLabel(input, percentage) {
      return (
        '[' +
        input.lowerBound +
        percentage +
        ', ' +
        input.upperBound +
        percentage +
        ']'
      );
    }

    function createCILabel(input, percentage) {
      return (
        input.value +
        percentage +
        ' (' +
        input.lowerBound +
        percentage +
        '; ' +
        input.upperBound +
        percentage +
        ')'
      );
    }

    function isValueCI(input) {
      return (
        input.hasOwnProperty('lowerBound') &&
        input.hasOwnProperty('upperBound') &&
        input.hasOwnProperty('value')
      );
    }

    function isRange(input) {
      return (
        input.hasOwnProperty('lowerBound') && input.hasOwnProperty('upperBound')
      );
    }

    function isValueSampleSize(input) {
      return input.value && input.sampleSize;
    }

    function isEventsSampleSize(input) {
      return input.events && input.sampleSize;
    }

    function createIsCellAnalysisViable(
      rows,
      alternatives,
      effectsTableInfo,
      scales
    ) {
      return _.reduce(
        rows,
        function (accum, row) {
          if (row.isHeaderRow) {
            return accum;
          } else {
            accum[row.dataSource.id] = createViabilityRows(
              row.dataSource.id,
              alternatives,
              effectsTableInfo,
              scales
            );
            return accum;
          }
        },
        {}
      );
    }

    function createIsCellAnalysisViableForCriterionCard(
      criterion,
      alternatives,
      effectsTableInfo,
      scales
    ) {
      return _.reduce(
        criterion.dataSources,
        function (accum, dataSource) {
          accum[dataSource.id] = createViabilityRows(
            dataSource.id,
            alternatives,
            effectsTableInfo,
            scales
          );
          return accum;
        },
        {}
      );
    }

    function createViabilityRows(
      dataSourceId,
      alternatives,
      effectsTableInfo,
      scales
    ) {
      return _.reduce(
        alternatives,
        function (accum, alternative) {
          accum[alternative.id] = isCellViable(
            dataSourceId,
            alternative.id,
            effectsTableInfo,
            scales
          );
          return accum;
        },
        {}
      );
    }

    function isCellViable(
      dataSourceId,
      alternativeId,
      effectsTableInfo,
      scales
    ) {
      return (
        isRelative(dataSourceId, effectsTableInfo) ||
        hasEffectValueLabel(dataSourceId, alternativeId, effectsTableInfo) ||
        hasScaleValue(dataSourceId, alternativeId, scales)
      );
    }

    function isRelative(dataSourceId, effectsTableInfo) {
      return !effectsTableInfo[dataSourceId].isAbsolute;
    }

    function hasEffectValueLabel(
      dataSourceId,
      alternativeId,
      effectsTableInfo
    ) {
      return (
        effectsTableInfo[dataSourceId].studyDataLabelsAndUncertainty[
          alternativeId
        ].effectValue !== ''
      );
    }

    function hasScaleValue(dataSourceId, alternativeId, scales) {
      var smaaValue;
      if (scales) {
        smaaValue = scales[dataSourceId][alternativeId]['50%'];
      }
      return !!scales && !isNaN(smaaValue) && smaaValue !== null;
    }

    function getRoundedValue(value) {
      return $filter('number')(value);
    }

    function getRoundedScales(scales) {
      return _.mapValues(scales, function (scalesByAlternatives) {
        return _.mapValues(scalesByAlternatives, function (alternative) {
          return {
            '2.5%': getRoundedValue(alternative['2.5%']),
            '50%': getRoundedValue(alternative['50%']),
            '97.5%': getRoundedValue(alternative['97.5%'])
          };
        });
      });
    }

    function getMedian(scales) {
      if (
        WorkspaceSettingsService.setWorkspaceSettings().calculationMethod ===
        'mode'
      ) {
        return getMode(scales);
      } else {
        return getRoundedValue(scales['50%']);
      }
    }

    function getMode(scales) {
      if (scales.mode !== null && scales.mode !== undefined) {
        return getRoundedValue(scales.mode);
      } else {
        return 'NA';
      }
    }

    return {
      buildEffectsTable: buildEffectsTable,
      createEffectsTableInfo: createEffectsTableInfo,
      buildTableRows: buildTableRows,
      createIsCellAnalysisViable: createIsCellAnalysisViable,
      createIsCellAnalysisViableForCriterionCard: createIsCellAnalysisViableForCriterionCard,
      getRoundedValue: getRoundedValue,
      getRoundedScales: getRoundedScales,
      getMedian: getMedian
    };
  };

  return dependencies.concat(EffectsTableService);
});
