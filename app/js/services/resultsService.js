'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');

  var dependencies = [];

  var MCDAResultsService = function() {

    function run($scope, state) {
      function successHandler(results) {
        state.results = results.results;
      }
      function errorHandler(code, error) {
        var message = {
          code: (code && code.desc) ? code.desc : code,
          cause: error
        };
        $scope.$root.$broadcast('error', message);
      }

      var updateHandler = _.throttle(function(update) {
        var progress = parseInt(update);
        if (progress > $scope.progress) {
          $scope.progress = progress;
        }
      }, 30);

      state = angular.copy(state);
      var data = _.extend(state.problem, {
        'preferences': state.prefs,
        'method': 'smaa'
      });
      // var task = MCDAPataviService.run(data);

      $scope.progress = 0;
      task.then(successHandler, errorHandler, updateHandler);
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

    var getResults = function(scope, state) {
      var next = _.extend(state, {
        selectedAlternative: _.keys(state.problem.alternatives)[0],
        selectedRank: '0',
        ranksByAlternative: getRanksByAlternative,
        alternativesByRank: getAlterativesByRank,
        centralWeights: getCentralWeights
      });
      return run(scope, next);
    };
    return {
      getResults: getResults
    };
  };

  return angular.module('elicit.resultsService', dependencies).factory('MCDAResultsService', MCDAResultsService);
});
