'use strict';
define(['lodash'], function(_) {
  var dependencies = [];

  var EffectsTableService = function() {
    function buildEffectsTable(criteria) {
      var tableRows = criteria;
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
        var partition = _.partition(criteria, ['isFavorable', true]);
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
        var rowCriterion = _.omit(row, ['dataSources']);
        rowCriterion.numberOfDataSources = row.dataSources.length;
        accum = accum.concat(_.map(row.dataSources, function(dataSource, index) {
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
      return _.reduce(performanceTable, function(accum, tableEntry) {
        var dataSourceId = tableEntry.dataSource;
        if (accum[dataSourceId]) { return accum; }
        if (tableEntry.alternative) {
          accum[dataSourceId] = {
            distributionType: tableEntry.performance.type,
            hasStudyData: true,
            studyDataLabelsAndUncertainty: _(performanceTable)
              .filter(['dataSource', dataSourceId])
              .reduce(function(accum, entryForCriterion) {
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
      return !!(_.find(effectsTableInfo, function(infoEntry) {
        return infoEntry.distributionType !== 'relative';
      }));
    }

    function buildLabel(entryForCriterion) {
      var label = '';
      var performance = entryForCriterion.performance;
      var hasUncertainty = performance.type !== 'empty';
      var parameters = performance.parameters;
      if (performance.input) {
        var input = performance.input;
        switch (performance.type) {
          case 'exact':
            hasUncertainty = false;
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
            break;
          case 'dt':
            label = input.mu + ' (' + roundToThreeDigits(parameters.stdErr) + '), ' + (input.sampleSize);
            break;
          case 'dnorm':
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
            break;
          case 'dbeta':
            label = input.events + ' / ' + input.sampleSize;
            break;
        }
      } else {
        switch (performance.type) {
          case 'exact':
            hasUncertainty = false;
            label = performance.value;
            break;
          case 'dt':
            label = parameters.mu + ' (' + roundToThreeDigits(parameters.stdErr) + '), ' + (parameters.dof + 1);
            break;
          case 'dnorm':
            label = parameters.mu + ' (' + roundToThreeDigits(parameters.sigma) + ')';
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
      }
      return {
        label: label,
        hasUncertainty: hasUncertainty
      };
    }

    //private
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
