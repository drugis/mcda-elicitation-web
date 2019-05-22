'use strict';
define(['lodash', 'angular'], function (_, angular) {
  var dependencies = [];

  var EffectsTableService = function () {
    function buildEffectsTable(criteria) {
      var tableRows = addCanBePercentageToCriteria(angular.copy(criteria));
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
          orderedUnfavorableCriteria);
      }
      tableRows = buildTableRows(tableRows);
      return tableRows;
    }

    function addCanBePercentageToCriteria(criteria) {
      return _.mapValues(criteria, function (criterion) {
        criterion.canBePercentage = canBePercentage(criterion);
        return criterion;
      });
    }

    function canBePercentage(criterion) {
      return !!_.find(criterion.dataSources, function (dataSource) {
        return _.isEqual(dataSource.scale, [0, 1]) || _.isEqual(dataSource.scale, [0, 100]);
      });
    }

    function buildTableRows(rows) {
      return _.reduce(rows, function (accum, row) {
        if (row.isHeaderRow) {
          return accum.concat(row);
        }
        var rowCriterion = _.omit(row, ['dataSources']);
        rowCriterion.numberOfDataSources = row.dataSources.length;
        accum = accum.concat(_.map(row.dataSources, function (dataSource, index) {
          return {
            criterion: rowCriterion,
            isFirstRow: index === 0,
            dataSource: dataSource
          };
        }));
        return accum;
      }, []);
    }

    function createEffectsTableInfo(performanceTable) {
      return _.reduce(performanceTable, function (accum, tableEntry) {
        var dataSourceId = tableEntry.dataSource;
        if (accum[dataSourceId]) { return accum; }
        if (tableEntry.alternative) {
          accum[dataSourceId] = {
            distributionType: tableEntry.performance.type,
            hasStudyData: true,
            studyDataLabelsAndUncertainty: _(performanceTable)
              .filter(['dataSource', dataSourceId])
              .reduce(function (accum, entryForCriterion) {
                accum[entryForCriterion.alternative] = buildLabel(entryForCriterion);
                return accum;
              }, {})
          };
        } else {
          accum[tableEntry.dataSource] = {
            distributionType: 'relative',
            hasStudyData: false
          };
        }
        return accum;
      }, {});
    }

    function isStudyDataAvailable(effectsTableInfo) {
      return !!(_.find(effectsTableInfo, function (infoEntry) {
        return infoEntry.distributionType !== 'relative';
      }));
    }



    function buildLabel(entryForCriterion) {
      var label;
      var performance = entryForCriterion.performance;
      var hasUncertainty = determineUncertainty(performance.type);
      if (performance.input) {
        label = buildLabelBasedOnInput(performance);
      } else {
        label = buildLabelBasedOnParameters(performance);
      }
      return {
        label: label,
        hasUncertainty: hasUncertainty
      };
    }

    function determineUncertainty(type) {
      return !_.includes(type, 'empty') && !_.includes(type, 'exact');
    }

    function buildLabelBasedOnParameters(performance) {
      var label = '';
      var parameters = performance.parameters;
      if (_.includes(performance.type, 'exact')) {
        label = performance.value;
      } else if (_.includes(performance.type, 'dt')) {
        label = parameters.mu + ' (' + roundToThreeDigits(parameters.stdErr) + '), ' + (parameters.dof + 1);
      } else if (_.includes(performance.type, 'dnorm')) {
        label = parameters.mu + ' (' + roundToThreeDigits(parameters.sigma) + ')';
      } else if (_.includes(performance.type, 'dbeta')) {
        label = (parameters.alpha - 1) + ' / ' + (parameters.beta + parameters.alpha - 2);
      } else if (_.includes(performance.type, 'dgamma')) {
        label = (parameters.alpha) + ' / ' + (parameters.beta);
      } else if (_.includes(performance.type, 'dsurv')) {
        label = (parameters.alpha - 0.001) + ' / ' + (parameters.beta - 0.001);
      }
      return label;
    }

    function buildLabelBasedOnInput(performance) {
      var label = '';
      var type = performance.type;
      var input = performance.input;
      if (_.includes(type, 'exact')) {
        label = buildExactLabel(input);
      } else if (_.includes(type, 'dt')) {
        label = buildStudentsTLabel(input);
      } else if (_.includes(type, 'dnorm')) {
        label = buildNormalLabel(input);
      } else if (_.includes(type, 'dbeta')) {
        label = buildBetaLabel(input);
      }
      return label;
    }

    function buildBetaLabel(input){
      return input.events + ' / ' + input.sampleSize;
    }

    function buildNormalLabel(input) {
      var label = '';
      if (input.events && input.sampleSize) {
        label = input.events + ' / ' + input.sampleSize;
      } else if (input.value && input.sampleSize && input.scale === 'percentage') { //dichotomous
        label = input.value + '% (' + input.sampleSize + ')';
      } else if (input.value && input.sampleSize) { //dichotomous
        label = input.value + ' (' + input.sampleSize + ')';
      } else if (input.stdErr) {//with stdErr
        label = input.value ? input.value : input.mu; //exact to dist  vs manual normal dist
        label += ' (' + input.stdErr + ')';
      } else if (input.lowerBound) {//with confidence interval
        label = input.value + ' (' + input.lowerBound + '; ' + input.upperBound + ')';
      }
      return label;
    }

    function buildStudentsTLabel(performance) {
      return performance.input.mu + ' (' +
        roundToThreeDigits(performance.parameters.stdErr) +
        '), ' + (performance.input.sampleSize);
    }

    function buildExactLabel(input) {
      var label = '';
      if (input.events) {
        label = input.events + ' / ' + input.sampleSize;
      } else if (input.scale === 'percentage') {
        label = input.value + '%';
        label = input.lowerBound ? label + ' (' + input.lowerBound + '%; ' +
          input.upperBound + '%)' : label;
        label = input.sampleSize ? label + ' (' + input.sampleSize + ')' : label;
      } else {
        label = input.value;
        label = input.stdErr ? label + ' (' + input.stdErr + ')' : label;
        label = input.lowerBound ? label + ' (' + input.lowerBound + '; ' +
          input.upperBound + ')' : label;
        label = input.sampleSize ? label + ' (' + input.sampleSize + ')' : label;
      }
      return label;
    }

    function roundToThreeDigits(value) {
      return Math.round(value * 1000) / 1000;
    }

    return {
      buildEffectsTable: buildEffectsTable,
      createEffectsTableInfo: createEffectsTableInfo,
      isStudyDataAvailable: isStudyDataAvailable,
      buildTableRows: buildTableRows
    };
  };

  return dependencies.concat(EffectsTableService);
});
