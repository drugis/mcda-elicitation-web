'use strict';
define(function(require) {
  var angular = require('angular');
  var _ = require('lodash');

  return function($rootScope, $scope, currentScenario, taskDefinition, MCDAResultsService) {
    $scope.scenario = currentScenario;

    var alternativeTitle = function(id) {
      var problem = currentScenario.state.problem;
      return problem.alternatives[id].title;
    };

    var getCentralWeights = _.memoize(function(state) {
      var problem = state.problem;
      var data = state.results.cw.data;
      var result = [];
      _.each(_.toPairs(data), function(alternative) {
        var values = _.map(_.toPairs(alternative[1].w), function(criterion, index) {
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
      var values = _.map(_.toPairs(data), function(alternative) {
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
        selectedAlternative: _.keys($scope.workspace.problem.alternatives)[0],
        selectedRank: '0',
        ranksByAlternative: getRanksByAlternative,
        alternativesByRank: getAlterativesByRank,
        centralWeights: getCentralWeights
      });
      return MCDAResultsService.getResults($scope, next);
    };

    $scope.state = initialize(taskDefinition.clean(currentScenario.state));
  };
});
