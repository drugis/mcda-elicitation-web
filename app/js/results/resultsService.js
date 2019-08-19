'use strict';
define(['lodash', 'angular', 'jquery'], function(_, angular, $) {
  var dependencies = ['PataviResultsService'];

  var MCDAResultsService = function(PataviResultsService) {

    function run($scope, inState) {
      var state = angular.copy(inState);
      state.problem.criteria = _.mapValues(state.problem.criteria, function(criterion) {
        if (criterion.dataSources) {
          return _.merge({}, _.omit(criterion, ['dataSources']), _.omit(criterion.dataSources[0]), []);
        }
        return criterion;
      });

      function successHandler(results) {
        state.results = results;
        return state;
      }

      var updateHandler = _.throttle(function(update) {
        if (update && update.eventType === 'progress' && update.eventData && $.isNumeric(update.eventData)) {
          var progress = parseInt(update.eventData);
          if (progress > $scope.progress) {
            $scope.progress = progress;
          }
        }
      }, 30);
      $scope.progress = 0;

      state.resultsPromise = PataviResultsService.postAndHandleResults(state.problem, successHandler, updateHandler);
      return state;
    }

    function addSmaaResults(state) {
      var newState = _.cloneDeep(state);
      newState.alternativesByRank = getAlternativesByRank(state);
      newState.centralWeights = getCentralWeights(state);
      newState.ranksByAlternatives = getRanksByAlternatives(state);
      return newState;
    }

    function getCentralWeights(state) {
      var problem = state.problem;
      var data = state.results.cw.data;
      var result = [];
      _.each(_.toPairs(data), function(alternative) {
        var values = _.map(_.toPairs(alternative[1].w), function(criterion, index) {
          return {
            x: index,
            label: criterion[0],
            y: criterion[1]
          };
        });
        var labels = _.map(_.map(values, 'label'), function(id) {
          return problem.criteria[id].title;
        });
        result.push({
          key: problem.alternatives[alternative[0]].title,
          labels: labels,
          values: values
        });
      });
      return result;
    }

    function getAlternativesByRank(state) {
      var data = state.results.ranks.data;
      var ranks = _.range(_.size(state.problem.alternatives));
      return _.map(ranks, function(rank) {
        var values = _.map(_.toPairs(data), function(alternative) {
          var id = alternative[0];
          return {
            label: state.problem.alternatives[id].title,
            value: alternative[1][rank]
          };
        });
        var name = 'Alternatives for rank ' + (rank + 1);
        return [{
          key: name,
          values: values
        }];
      });
    }

    function getRanksByAlternatives(state) {
      var data = state.results.ranks.data;
      return _.reduce(state.problem.alternatives, function(accum, alternative, alternativeKey) {
        var values = [];
        _.each(data[alternativeKey], function(rank, index) {
          values.push({
            label: 'Rank ' + (index + 1),
            value: [rank]
          });
        });
        accum[alternativeKey] = [{
          key: alternative.title,
          values: values
        }];
        return accum;
      }, {});
    }

    function getResults(scope, state) {
      if (_.some(state.problem.performanceTable, function(entry) { return entry.performance.distribution; })) {
        return getResultForType(scope, state, 'distribution');
      } else {
        return getResultForType(scope, state, 'effect');
      }
    }

    function getResultForType(scope, state, type) {
      var nextState = {
        problem: _.merge({}, getProblemForResultType(state.problem, type), {
          preferences: state.prefs,
          method: 'smaa'
        }),
        selectedAlternative: _.keys(state.problem.alternatives)[0],
        selectedRank: '0'
      };
      return run(scope, nextState);
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
      var nextState = {
        problem: _.merge({}, getProblemForResultType(state.problem, 'effect'), {
          preferences: state.prefs,
          method: 'deterministic'
        })
      };
      return run(scope, nextState);
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
        problem: _.merge({}, getProblemForResultType(state.problem, 'effect'), {
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
        problem: _.merge({}, getProblemForResultType(state.problem, 'effect'), {
          preferences: state.prefs,
          method: 'sensitivityWeightPlot',
          sensitivityAnalysis: {
            criterion: scope.sensitivityMeasurements.preferencesCriterion.id
          }
        })
      };
      return run(scope, nextState);
    }

    function replaceAlternativeNames(legend, state) {
      if (!legend) {
        return state;
      }
      var newState = _.cloneDeep(state);
      newState.problem.alternatives = _.reduce(state.problem.alternatives, function(accum, alternative, alternativeKey) {
        var newAlternative = _.cloneDeep(alternative);
        newAlternative.title = legend[alternativeKey].newTitle;
        accum[alternativeKey] = newAlternative;
        return accum;
      }, {});
      return newState;
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

    function getProblemForResultType(problem, resultType) {
      var newProblem = angular.copy(problem);
      newProblem.performanceTable = _.map(problem.performanceTable, function(entry) {
        var newEntry = angular.copy(entry);
        if (entry.performance[resultType]) {
          newEntry.performance = entry.performance[resultType];
        } else {
          newEntry.performance = entry.performance.distribution;
        }
        return newEntry;
      });
      return newProblem;
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
      addSmaaResults: addSmaaResults,
      replaceAlternativeNames: replaceAlternativeNames,
      percentifySensitivityResult: percentifySensitivityResult,
      createDeterministicScales: createDeterministicScales
    };
  };

  return dependencies.concat(MCDAResultsService);
});
