'use strict';
define([
  'lodash',
  'angular',
  'd3'
], function(
  _,
  angular,
  d3
) {
  var dependencies = ['PataviResultsService'];

  var DeterministicResulstsService = function(PataviResultsService) {
    function run(inState) {
      var state = angular.copy(inState);
      state.problem.criteria = mergeDataSourceOntoCriterion(state.problem.criteria);
      state.resultsPromise = PataviResultsService.postAndHandleResults(state.problem, _.partial(succesCallback, state));
      return state;
    }

    function succesCallback(state, results) {
      state.results = results;
      return state;
    }

    function mergeDataSourceOntoCriterion(criteria) {
      return _.mapValues(criteria, function(criterion) {
        if (criterion.dataSources) {
          return _.merge({}, _.omit(criterion, ['dataSources']), _.omit(criterion.dataSources[0]), []);
        }
        return criterion;
      });
    }

    function getProblem(problem) {
      var newProblem = angular.copy(problem);
      newProblem.performanceTable = _.map(problem.performanceTable, createEntry);
      return newProblem;
    }

    function createEntry(entry) {
      var newEntry = angular.copy(entry);
      if (entry.performance.effect) {
        newEntry.performance = entry.performance.effect;
      } else {
        newEntry.performance = entry.performance.distribution;
      }
      return newEntry;
    }

    function resetModifiableScales(observed, alternatives) {
      var modifiableScales = _.cloneDeep(observed);
      modifiableScales = _.reduce(modifiableScales, function(accum, criterion, criterionKey) {
        accum[criterionKey] = _.reduce(criterion, function(accum, scale, key) {
          if (alternatives[key]) {
            accum[key] = scale;
            return accum;
          } else {
            return accum;
          }
        }, {});
        return accum;
      }, {});
      return modifiableScales;
    }

    function pataviResultToValueProfile(result, criteria, alternatives, legend) {
      var plotValues = getAlternativesTitles(alternatives, legend);
      return plotValues.concat(getProfilePlotValues(criteria, alternatives, result));
    }

    function getAlternativesTitles(alternatives, legend) {
      return [['x'].concat(_.map(alternatives, function(alternative) {
        return legend ? legend[alternative.id].newTitle : alternative.title;
      }))];
    }

    function getProfilePlotValues(criteria, alternatives, result) {
      return _.map(criteria, function(criterion) {
        return getValueData(criterion, alternatives, result);
      });
    }

    function getValueData(criterion, alternatives, result) {
      return [criterion.title].concat(_.map(alternatives, function(alternative) {
        return result.value[alternative.id][criterion.id];
      }));
    }

    function pataviResultToLineValues(results, alternatives, legend) {
      var plotValues = getLineXValues(results, alternatives);
      return plotValues.concat(getLineYValues(alternatives, legend, results));
    }

    function getLineXValues(results, alternatives) {
      return [['x'].concat(_.keys(results.total[alternatives[0].id]))];
    }

    function getLineYValues(alternatives, legend, results) {
      return _.map(alternatives, function(alternative) {
        return [legend ? legend[alternative.id].newTitle : alternative.title].concat(_.values(results.total[alternative.id]));
      });
    }

    function getDeterministicResults(state) {
      var deterministicResultsState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'deterministic'
        })
      };
      return run(deterministicResultsState);
    }

    function getRecalculatedDeterministicResults(alteredTableCells, state) {
      var nextState = {
        problem: _.merge({}, state.problem, {
          preferences: state.prefs,
          method: 'sensitivityMeasurements',
          sensitivityAnalysis: {
            meas: alteredTableCells
          }
        })
      };
      return run(nextState);
    }

    function getMeasurementSensitivityResults(measurementsAlternativeId, measurementsCriterionId, state) {
      var nextState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'sensitivityMeasurementsPlot',
          sensitivityAnalysis: {
            alternative: measurementsAlternativeId,
            criterion: measurementsCriterionId
          }
        })
      };
      return run(nextState);
    }

    function getPreferencesSensitivityResults(selectedCriterionId, state) {
      var nextState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'sensitivityWeightPlot',
          sensitivityAnalysis: {
            criterion: selectedCriterionId
          }
        })
      };
      return run(nextState);
    }

    function percentifySensitivityResult(values) {
      var newValues = angular.copy(values);
      newValues[0] = _.map(values[0], function(value) {
        if (value === 'x') {
          return value;
        } else {
          return value * 100;
        }
      });
      return newValues;
    }

    function createDeterministicScales(performanceTable, smaaScales) {
      return _.reduce(performanceTable, function(accum, entry) {
        if (!accum[entry.dataSource]) {
          accum[entry.dataSource] = {};
        }
        if (entry.performance.effect) {
          accum[entry.dataSource][entry.alternative] = {
            '50%': entry.performance.effect.value
          };
        } else if (entry.alternative) {
          accum[entry.dataSource][entry.alternative] = smaaScales[entry.dataSource][entry.alternative];
        } else {
          accum[entry.dataSource] = smaaScales[entry.dataSource];
        }
        return accum;
      }, {});
    }

    function getSensitivityLineChartSettings(root, values, options) {
      return {
        bindto: root,
        data: {
          x: 'x',
          columns: values
        },
        axis: {
          x: {
            label: {
              text: options.labelXAxis,
              position: 'outer-center'
            },
            min: getLineChartMin(values[0]),
            max: getLineChartMax(values[0]),
            padding: {
              left: 0,
              right: 0
            },
            tick: {
              count: 5,
              format: d3.format(',.3g')
            }
          },
          y: {
            label: {
              text: options.labelYAxis,
              position: 'outer-middle'
            }
          }
        },
        grid: {
          x: {
            show: false
          },
          y: {
            show: true
          }
        },
        point: {
          show: false
        },
        tooltip: {
          show: options.useTooltip
        }
      };
    }

    function getLineChartMin(xValues) {
      return _.reduce(xValues, function(accum, value, idx) {
        if (idx !== 0 && parseFloat(value) < parseFloat(accum)) {
          return parseFloat(value);
        } else {
          return accum;
        }
      }, Infinity);
    }

    function getLineChartMax(xValues) {
      return _.reduce(xValues, function(accum, value, idx) {
        if (idx !== 0 && parseFloat(value) > parseFloat(accum)) {
          return parseFloat(value);
        } else {
          return accum;
        }
      }, -Infinity);
    }

    function getValueProfilePlotSettings(results, criteria, alternatives, alternativesLegend, root) {
      var plotValues = pataviResultToValueProfile(
        results,
        criteria,
        alternatives,
        alternativesLegend
      );
      var criteriaTitles = _.map(criteria, 'title');
      return {
        bindto: root,
        data: {
          x: 'x',
          columns: plotValues,
          type: 'bar',
          groups: [criteriaTitles]
        },
        axis: {
          x: {
            type: 'category',
            tick: {
              centered: true
            }
          },
          y: {
            tick: {
              count: 5,
              format: d3.format(',.3g')
            },
          }
        },
        grid: {
          x: {
            show: false
          },
          y: {
            show: true
          }
        },
        legend: {
          position: 'bottom'
        }
      };
    }

    return {
      resetModifiableScales: resetModifiableScales,
      getSensitivityLineChartSettings: getSensitivityLineChartSettings,
      getValueProfilePlotSettings: getValueProfilePlotSettings,
      pataviResultToLineValues: pataviResultToLineValues,
      getDeterministicResults: getDeterministicResults,
      getRecalculatedDeterministicResults: getRecalculatedDeterministicResults,
      getMeasurementSensitivityResults: getMeasurementSensitivityResults,
      getPreferencesSensitivityResults: getPreferencesSensitivityResults,
      percentifySensitivityResult: percentifySensitivityResult,
      createDeterministicScales: createDeterministicScales
    };
  };

  return dependencies.concat(DeterministicResulstsService);
});
