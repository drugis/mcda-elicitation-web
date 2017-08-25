'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');

  var dependencies = ['$http', 'PataviService'];

  var MCDAResultsService = function($http, PataviService) {

    function run($scope, inState) {
      var state = angular.copy(inState);
      var data = _.merge({}, state.problem, {
        'preferences': state.prefs, //Does this do anything?
        'method': 'smaa'
      });

      function successHandler(results) {
        state.results = results;
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

      $http.post('/patavi', data).then(function(result) {
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
    });

    var getAlterativesByRank = _.memoize(function(state) {
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
      return 31 * val.selectedRank.hashCode() + angular.toJson(val.results).hashCode();
    });

    var getRanksByAlternative = _.memoize(function(state) {
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
      return 31 * val.selectedAlternative.hashCode() + angular.toJson(val.results).hashCode();
    });

    function getResults(scope, state) {
      var nextState = {
        problem: state.problem,
        prefs: state.prefs,
        selectedAlternative: _.keys(state.problem.alternatives)[0],
        selectedRank: '0',
        ranksByAlternative: getRanksByAlternative,
        alternativesByRank: getAlterativesByRank,
        centralWeights: getCentralWeights
      };
      return run(scope, nextState);
    }

    function resetModifiableScales(observed, alternatives) {
      var modifiableScales = _.cloneDeep(observed);
      modifiableScales = _.reduce(modifiableScales, function(accum, criterion, criterionKey) {
        accum[criterionKey] = _.reduce(criterion, function(accum, scale, key) {
          if (_.find(alternatives, function(alternative, alternativeKey) {
              return alternativeKey === key;
            })) {
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

    return {
      getResults: getResults,
      resetModifiableScales: resetModifiableScales
    };
  };

  return dependencies.concat(MCDAResultsService);
});