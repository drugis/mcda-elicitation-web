'use strict';
define([
  'lodash',
  'angular',
  'jquery',
  'd3'
], function(
  _,
  angular,
  $,
  d3
) {
  var dependencies = ['PataviResultsService'];

  var DeterministicResulstsService = function(PataviResultsService) {
    function run($scope, inState) {
      var state = angular.copy(inState);
      state.problem.criteria = mergeDataSourceOntoCriterion(state.problem.criteria);

      var updateCallback = _.throttle(function(update) {
        if (update && update.eventType === 'progress' && update.eventData && $.isNumeric(update.eventData)) {
          var progress = parseInt(update.eventData);
          if (progress > $scope.progress) {
            $scope.progress = progress;
          }
        }
      }, 30);
      $scope.progress = 0;

      state.resultsPromise = PataviResultsService.postAndHandleResults(state.problem, _.partial(succesCallback, state), updateCallback);
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

    function getResults(scope, state) {
      var nextState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'smaa'
        }),
        selectedAlternative: _.keys(state.problem.alternatives)[0],
        selectedRank: '0'
      };
      return run(scope, nextState);
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
        return result.value.data[alternative.id][criterion.id];
      }));
    }

    function pataviResultToLineValues(results, alternatives, legend) {
      var plotValues = getLineXValues(results, alternatives);
      return plotValues.concat(getLineYValues(alternatives, legend, results));
    }

    function getLineXValues(results, alternatives) {
      return [['x'].concat(_.keys(results.total.data[alternatives[0].id]))];
    }

    function getLineYValues(alternatives, legend, results) {
      return _.map(alternatives, function(alternative) {
        return [legend ? legend[alternative.id].newTitle : alternative.title].concat(_.values(results.total.data[alternative.id]));
      });
    }

    function getDeterministicResults(scope, state) {
      var deterministicResultsState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'deterministic'
        })
      };
      return run(scope, deterministicResultsState);
    }

    function getRecalculatedDeterministicResults(scope, state) {
      var nextState = {
        problem: _.merge({}, state.problem, {
          preferences: state.prefs,
          method: 'sensitivityMeasurements',
          sensitivityAnalysis: {
            meas: scope.sensitivityMeasurements.alteredTableCells
          }
        })
      };
      return run(scope, nextState);
    }

    function getMeasurementSensitivityResults(scope, state) {
      var nextState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'sensitivityMeasurementsPlot',
          sensitivityAnalysis: {
            alternative: scope.measurementsAlternative.id,
            criterion: scope.measurementsCriterion.id
          }
        })
      };
      return run(scope, nextState);
    }

    function getPreferencesSensitivityResults(scope, state) {
      var nextState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'sensitivityWeightPlot',
          sensitivityAnalysis: {
            criterion: scope.selectedCriterion.id
          }
        })
      };
      return run(scope, nextState);
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
            min: values[0][1],
            max: values[0][values[0].length - 1],
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
      getResults: getResults,
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
