'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');

  var dependencies = ['$http', 'PataviService'];

  var MCDAResultsService = function($http, PataviService) {

    function run($scope, inState) {
      var state = angular.copy(inState);

      function successHandler(results) {
        state.results = results;
        return state;
      }

      function pataviErrorHandler(pataviError) {
        $scope.$root.$broadcast('error', {
          type: 'PATAVI',
          message: pataviError.desc
        });
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

      state.resultsPromise = $http.post('/patavi', state.problem).then(function(result) {
          var uri = result.headers('Location');
          if (result.status === 201 && uri) {
            return uri;
          }
        }, function(error) {
          console.error(error);
          $scope.$root.$broadcast('error', {
            type: 'BACK_END_ERROR',
            code: error.code || undefined,
            message: 'unable to submit the problem to the server'
          });
        })
        .then(PataviService.listen)
        .then(successHandler, pataviErrorHandler, updateHandler);

      return state;
    }

    function alternativeTitle(id, problem) {
      return problem.alternatives[id].title;
    }

    var getCentralWeights = _.memoize(function(state) {
      if (!state.results) {
        return [];
      }
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
          key: alternativeTitle(alternative[0], problem),
          labels: labels,
          values: values
        });
      });
      return result;
    }, function(val) {
      if (val.results) {
        return 31 * val.selectedAlternative.hashCode() + angular.toJson(val.results).hashCode();
      } else {
        return 31 * val.selectedAlternative.hashCode();
      }
    });

    var getAlterativesByRank = _.memoize(function(state) {
      if (!state.results) {
        return [];
      }
      var data = state.results.ranks.data;
      var rank = parseInt(state.selectedRank);
      var values = _.map(_.toPairs(data), function(alternative) {
        return {
          label: alternativeTitle(alternative[0], state.problem),
          value: alternative[1][rank]
        };
      });
      var name = 'Alternatives for rank ' + (rank + 1);
      return [{
        key: name,
        values: values
      }];
    }, function(val) { // Hash function
      if (val.results) {
        return 31 * val.selectedRank.hashCode() + angular.toJson(val.results).hashCode();
      } else {
        return 31 * val.selectedAlternative.hashCode();
      }
    });

    var getRanksByAlternative = _.memoize(function(state) {
      if (!state.results) {
        return [];
      }
      var data = state.results.ranks.data;
      var alternative = state.selectedAlternative;
      var values = [];
      _.each(data[alternative], function(rank, index) {
        values.push({
          label: 'Rank ' + (index + 1),
          value: [rank]
        });
      });
      return [{
        key: alternativeTitle(alternative, state.problem),
        values: values
      }];
    }, function(val) {
      if (val.results) {
        return 31 * val.selectedAlternative.hashCode() + angular.toJson(val.results).hashCode();
      } else {
        return 31 * val.selectedAlternative.hashCode();
      }
    });

    function getResults(scope, state) {
      var nextState = {
        problem: _.merge({}, state.problem, {
          preferences: state.prefs,
          method: 'smaa'
        }),
        selectedAlternative: _.keys(state.problem.alternatives)[0],
        selectedRank: '0',
        ranksByAlternative: getRanksByAlternative,
        alternativesByRank: getAlterativesByRank,
        centralWeights: getCentralWeights,

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

    function pataviResultToValueProfile(result, criteria, alternatives) {
      return _.map(criteria, function(criterion) {
        return {
          key: criterion.title,
          values: _.map(alternatives, function(alternative) {
            return {
              x: alternative.title,
              y: result.value.data[alternative.id][criterion.id]
            };
          })
        };
      });
    }

    function pataviResultToLineValues(results, alternatives) {
      return _.map(alternatives, function(alternative) {
        return {
          key: alternative.title,
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
        problem: _.merge({}, state.problem, {
          preferences: state.prefs,
          method: 'deterministic'
        })
      };
      return run(scope, nextState);
    }

    function getRecalculatedDeterministicResulsts(scope, state) {
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
        problem: _.merge({}, state.problem, {
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
        problem: _.merge({}, state.problem, {
          preferences: state.prefs,
          method: 'sensitivityWeightPlot',
          sensitivityAnalysis: {
            criterion: scope.sensitivityMeasurements.preferencesCriterion.id

          }
        })
      };
      return run(scope, nextState);
    }

    return {
      getResults: getResults,
      resetModifiableScales: resetModifiableScales,
      pataviResultToValueProfile: pataviResultToValueProfile,
      pataviResultToLineValues: pataviResultToLineValues,
      getDeterministicResults: getDeterministicResults,
      getRecalculatedDeterministicResulsts: getRecalculatedDeterministicResulsts,
      getMeasurementsSensitivityResults: getMeasurementsSensitivityResults,
      getPreferencesSensitivityResults: getPreferencesSensitivityResults
    };
  };

  return dependencies.concat(MCDAResultsService);
});