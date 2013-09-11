function ResultsHandler() {
  var alternatives;
  var criteria;

  this.fields = [];

  var alternativeTitle = function(id) {
    return alternatives[id].title;
  }

  var getCentralWeights = _.memoize(function(state) {
      var data = state.results.cw.data;
      var result = [];
      _.each(_.pairs(data), function(alternative) {
        var values = _.map(_.pairs(alternative[1]['w']), function(criterion, index) {
          return { x: index, label: criterion[0], y: criterion[1] };
        });
        var labels = _.map(_.pluck(values, 'label'), function(id) { return criteria[id].title });
        result.push({key: alternativeTitle(alternative[0]), labels: labels, values: values});
      });
      return result;
    });

  var getAlterativesByRank = _.memoize(function(state, rank) {
      var data = state.results.ranks.data;
      var rank = parseInt(rank);
      var values = _.map(_.pairs(data), function(alternative) {
        return {label: alternativeTitle(alternative[0]), value: alternative[1][rank] };
      });
      var name = "Alternatives for rank " + (rank + 1);
      return [{ key: name, values: values }];
    });

  var getRanksByAlternative = _.memoize(function(state, alternative) {
      var data = state.results.ranks.data;
      var values = [];
      _.each(data[alternative], function(rank, index) {
        values.push({ label: "Rank " + (index + 1), value: [rank] });
      });
      return [{ key: alternativeTitle(alternative), values: values }];
    });

  this.initialize = function(state) {
    alternatives = _.clone(state.problem.alternatives);
    criteria = _.clone(state.problem.criteria);
    return _.extend(state, {
      type: "done",
      title: "Done eliciting preferences",
      selectedAlternative: _.keys(alternatives)[0],
      selectedRank: 0,
      ranksByAlternative: getRanksByAlternative,
      alternativesByRank: getAlterativesByRank,
      centralWeights: getCentralWeights
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
