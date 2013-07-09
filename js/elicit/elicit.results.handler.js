function ResultsHandler(problem) {
  this.fields = ['results'];

  var alternativeTitle = function(id) {
    return problem.alternatives[id].title;
  }

  var getCentralWeights = function(data) {
    var result = [];
    _.each(_.pairs(data), function(alternative) {
      var values = _.map(_.pairs(alternative[1]), function(criterion, index) {
        return { x: index, label: criterion[0], y: criterion[1] };
      });
      var labels = _.map(_.pluck(values, 'label'), function(id) { return problem.criteria[id].title });
      result.push({key: alternativeTitle(alternative[0]), labels: labels, values: values});
    });
    return result;
  }

  var getAlterativesByRank = function(data, rank) {
    return function(rank) {
      var rank = parseInt(rank);
      var values = _.map(_.pairs(data), function(alternative) {
        return {label: alternativeTitle(alternative[0]), value: alternative[1][rank] };
      });
      var name = "Alternatives for rank " + (rank + 1);
      return [{ key: name, values: values }];
    }
  }

  var getRanksByAlternative = function(data, alternative) {
    return function(alternative) {
      var values = [];
      _.each(data[alternative], function(rank, index) {
        values.push({ label: "Rank " + (index + 1), value: [rank] });
      });
      return [{ key: alternativeTitle(alternative), values: values }];
    }
  }

  this.initialize = function(state) {
    return _.extend(state, {
      type: "done",
      title: "Done eliciting preferences",
      selectedAlternative: _.keys(problem.alternatives)[0],
      selectedRank: 1,
      ranksByAlternative: getRanksByAlternative(state.results.ranks.data),
      alternativesByRank: getAlterativesByRank(state.results.ranks.data),
      centralWeights: getCentralWeights(state.results.cw.data)
    });
  }

  this.validChoice = function(currentState) {
    return false;
  }

  this.nextState = function(currentState) {
    return;
  }

  return this;
}
