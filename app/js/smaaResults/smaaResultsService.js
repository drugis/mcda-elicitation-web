'use strict';
define(['lodash', 'angular', 'd3'], function (_, angular, d3) {
  var dependencies = ['PataviResultsService'];

  var SmaaResultsService = function (PataviResultsService) {
    const NON_EXACT_PREFERENCE_TYPES = ['ordinal', 'ratio bound'];

    function getResults(uncertaintyOptions, state) {
      var nextState = {
        problem: _.merge({}, getProblem(state.problem), {
          preferences: state.prefs,
          method: 'smaa',
          uncertaintyOptions: uncertaintyOptions
        })
      };
      return run(nextState);
    }

    function getProblem(problem) {
      var newProblem = angular.copy(problem);
      newProblem.performanceTable = _.map(
        problem.performanceTable,
        createEntry
      );
      return newProblem;
    }

    function createEntry(entry) {
      var newEntry = angular.copy(entry);
      if (
        entry.performance.distribution &&
        entry.performance.distribution.type !== 'empty'
      ) {
        newEntry.performance = entry.performance.distribution;
      } else {
        newEntry.performance = entry.performance.effect;
      }
      return newEntry;
    }

    function run(inState) {
      var state = angular.copy(inState);
      state.problem.criteria = mergeDataSourceOntoCriterion(
        state.problem.criteria
      );
      state.resultsPromise = PataviResultsService.postAndHandleResults(
        state.problem,
        _.partial(succesCallback, state)
      );
      return state;
    }

    function succesCallback(state, results) {
      state.results = results;
      return state;
    }

    function mergeDataSourceOntoCriterion(criteria) {
      return _.mapValues(criteria, function (criterion) {
        if (criterion.dataSources) {
          return _.merge(
            {},
            _.omit(criterion, ['dataSources']),
            _.omit(criterion.dataSources[0]),
            []
          );
        }
        return criterion;
      });
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
      var data = state.results.cw;
      var result = [];
      _.each(_.toPairs(data), function (alternative) {
        var values = _.map(
          _.toPairs(alternative[1].w),
          function (criterion, index) {
            return {
              x: index,
              label: criterion[0],
              y: criterion[1]
            };
          }
        );
        var labels = _.map(_.map(values, 'label'), function (id) {
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
      var data = state.results.ranks;
      var ranks = _.range(_.size(state.problem.alternatives));
      return _.map(ranks, function (rank) {
        var values = _.map(_.toPairs(data), function (alternative) {
          var id = alternative[0];
          return {
            label: state.problem.alternatives[id].title,
            value: alternative[1][rank]
          };
        });
        var name = 'Alternatives for rank ' + (rank + 1);
        return [
          {
            key: name,
            values: values
          }
        ];
      });
    }

    function getRanksByAlternatives(state) {
      var data = state.results.ranks;
      return _.reduce(
        state.problem.alternatives,
        function (accum, alternative, alternativeKey) {
          var values = [];
          _.each(data[alternativeKey], function (rank, index) {
            values.push({
              label: 'Rank ' + (index + 1),
              value: [rank]
            });
          });
          accum[alternativeKey] = [
            {
              key: alternative.title,
              values: values
            }
          ];
          return accum;
        },
        {}
      );
    }

    function smaaResultsToRankPlotValues(results, alternatives, legend) {
      var values = getRankPlotTitles(alternatives, legend);
      return values.concat(getRankPlotValues(results, alternatives));
    }

    function getRankPlotTitles(alternatives, legend) {
      return [
        ['x'].concat(
          _.map(alternatives, function (alternative) {
            return legend ? legend[alternative.id].newTitle : alternative.title;
          })
        )
      ];
    }

    function getRankPlotValues(results, alternatives) {
      var values = _.map(alternatives, function (alternative, index) {
        return ['Rank ' + (index + 1)];
      });

      _.forEach(alternatives, function (alternative, index) {
        _.forEach(results[alternative.id], function (rankResult, key) {
          values[key][index + 1] = rankResult;
        });
      });

      return values;
    }

    function getRankPlotSettings(results, alternatives, legend, root) {
      var rankTitles = _.map(alternatives, function (alternative, index) {
        return 'Rank ' + (index + 1);
      });
      var values = smaaResultsToRankPlotValues(results, alternatives, legend);
      var settings = {
        bindto: root,
        data: {
          x: 'x',
          columns: values,
          type: 'bar',
          groups: [rankTitles]
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
            min: 0,
            max: 1,
            padding: {
              top: 0,
              bottom: 0
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
        legend: {
          position: 'bottom'
        }
      };
      return settings;
    }

    function getCentralWeightsPlotSettings(results, root) {
      var values = smaaResultsToCentralWeightsChartValues(results);
      var settings = {
        bindto: root,
        data: {
          x: 'x',
          columns: values,
          type: 'bar'
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
        legend: {
          position: 'bottom'
        }
      };
      return settings;
    }

    function smaaResultsToCentralWeightsChartValues(results) {
      var values = [['x'].concat(results[0].labels)];
      return values.concat(getCentralWeightsValues(results));
    }

    function getCentralWeightsValues(results) {
      return _.map(results, function (result) {
        return [result.key].concat(_.map(result.values, 'y'));
      });
    }

    function hasNoStochasticMeasurements(aggregateState) {
      return !_.some(
        aggregateState.problem.performanceTable,
        function (tableEntry) {
          return (
            tableEntry.performance.distribution &&
            tableEntry.performance.distribution.type !== 'exact' &&
            tableEntry.performance.distribution.type !== 'empty'
          );
        }
      );
    }

    function hasNoStochasticWeights(aggregateState) {
      return (
        aggregateState.prefs &&
        !_.isEmpty(aggregateState.prefs) &&
        areAllPreferencesExact(aggregateState)
      );
    }

    function areAllPreferencesExact(aggregateState) {
      return !_.some(aggregateState.prefs, function (pref) {
        return NON_EXACT_PREFERENCE_TYPES.indexOf(pref.type) >= 0;
      });
    }

    return {
      getCentralWeightsPlotSettings: getCentralWeightsPlotSettings,
      getRankPlotSettings: getRankPlotSettings,
      getResults: getResults,
      hasNoStochasticMeasurements: hasNoStochasticMeasurements,
      hasNoStochasticWeights: hasNoStochasticWeights,
      addSmaaResults: addSmaaResults
    };
  };

  return dependencies.concat(SmaaResultsService);
});
