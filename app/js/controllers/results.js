'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('underscore');

  return function($rootScope, $scope, currentScenario, taskDefinition, PataviService, $http) {
    $scope.scenario = currentScenario;

    var run = function(state) {
      state = angular.copy(state);
      var data = _.extend(state.problem, { 'preferences': state.prefs, 'method': 'smaa' });

      var successHandler = function(results) {
        state.results = results.results;
      };

      var errorHandler = function(pataviError) {
        $scope.$root.$broadcast('error', {
          type: 'patavi',
          message: pataviError.desc
        });
      };

      var updateHandler = _.throttle(function(update) {
        if (update && update.eventType === 'progress' && update.eventData && $.isNumeric(update.eventData)) {
          var progress = parseInt(update.eventData);
          if(progress > $scope.progress) {
            $scope.progress = progress;
          }
        }
      }, 30);

      $scope.progress = 0;

      $http.post('/patavi', data).then(function(result) {
        var uri = result.headers('Location');
        console.log(uri);
        if (result.status === 201 && uri) {
          return uri.replace(/^https/, 'wss') + '/updates'; // FIXME
        }
      }, function(error) {
        console.log(error);
        $scope.$root.$broadcast('error', error);
      })
      .then(PataviService.listen)
      .then(successHandler, errorHandler, updateHandler);

      return state;
    };

    var alternativeTitle = function(id) {
      var problem = currentScenario.state.problem;
      return problem.alternatives[id].title;
    };

    var getCentralWeights = _.memoize(function(state) {
      var problem = state.problem;
      var data = state.results.cw.data;
      var result = [];
      _.each(_.pairs(data), function(alternative) {
        var values = _.map(_.pairs(alternative[1].w), function(criterion, index) {
          return { x: index, label: criterion[0], y: criterion[1] };
        });
        var labels = _.map(_.pluck(values, 'label'), function(id) { return problem.criteria[id].title; });
        result.push({ key: alternativeTitle(alternative[0]), labels: labels, values: values });
      });
      return result;
    });

    var getAlterativesByRank = _.memoize(function(state) {
      var data = state.results.ranks.data;
      var rank = parseInt(state.selectedRank);
      var values = _.map(_.pairs(data), function(alternative) {
        return {label: alternativeTitle(alternative[0]), value: alternative[1][rank] };
      });
      var name = 'Alternatives for rank ' + (rank + 1);
      return [{ key: name, values: values }];
    }, function(val) { // Hash function
      return 31 * val.selectedRank.hashCode() + angular.toJson(val.results).hashCode();
    });

    var getRanksByAlternative = _.memoize(function(state) {
      var data = state.results.ranks.data;
      var alternative = state.selectedAlternative;
      var values = [];
      _.each(data[alternative], function(rank, index) {
        values.push({ label: 'Rank ' + (index + 1), value: [rank] });
      });
      return [{ key: alternativeTitle(alternative), values: values }];
    }, function(val) {
      return 31 * val.selectedAlternative.hashCode() + angular.toJson(val.results).hashCode();
    });

    var initialize = function(state) {
      var next = _.extend(state, {
        selectedAlternative: _.keys(state.problem.alternatives)[0],
        selectedRank: '0',
        ranksByAlternative: getRanksByAlternative,
        alternativesByRank: getAlterativesByRank,
        centralWeights: getCentralWeights
      });
      return run(next);
    };

    $scope.state = initialize(taskDefinition.clean(currentScenario.state));
  };
});
