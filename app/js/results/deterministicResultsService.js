'use strict';
define(['lodash', 'angular', 'jquery'], function(_, angular, $) {
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
      return _.map(criteria, function(criterion) {
        return {
          key: criterion.title,
          values: _.map(alternatives, function(alternative) {
            return {
              x: legend ? legend[alternative.id].newTitle : alternative.title,
              y: result.value.data[alternative.id][criterion.id]
            };
          })
        };
      });
    }

    function pataviResultToLineValues(results, alternatives, legend) {
      return _.map(alternatives, function(alternative) {
        return {
          key: legend ? legend[alternative.id].newTitle : alternative.title,
          values: _(results.total.data[alternative.id]).map(function(entryValue, entryKey) {
            return {
              x: parseFloat(entryKey),
              y: entryValue
            };
          })
            .sortBy('x')
            .value()
        };
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

    function getMeasurementsSensitivityResults(scope, state) {
      var nextState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'sensitivityMeasurementsPlot',
          sensitivityAnalysis: {
            alternative: scope.sensitivityMeasurements.measurementsAlternative.id,
            criterion: scope.sensitivityMeasurements.measurementsCriterion.id
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
            criterion: scope.sensitivityMeasurements.preferencesCriterion.id
          }
        })
      };
      return run(scope, nextState);
    }

    function percentifySensitivityResult(values, coordinate) {
      return _.map(values, function(line) {
        var newLine = angular.copy(line);
        newLine.values = _.map(newLine.values, function(coordinates) {
          coordinates[coordinate] *= 100;
          return coordinates;
        });
        return newLine;
      });
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

    return {
      getResults: getResults,
      resetModifiableScales: resetModifiableScales,
      pataviResultToValueProfile: pataviResultToValueProfile,
      pataviResultToLineValues: pataviResultToLineValues,
      getDeterministicResults: getDeterministicResults,
      getRecalculatedDeterministicResults: getRecalculatedDeterministicResults,
      getMeasurementsSensitivityResults: getMeasurementsSensitivityResults,
      getPreferencesSensitivityResults: getPreferencesSensitivityResults,
      percentifySensitivityResult: percentifySensitivityResult,
      createDeterministicScales: createDeterministicScales
    };
  };

  return dependencies.concat(DeterministicResulstsService);
});
