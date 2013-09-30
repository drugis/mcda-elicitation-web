define(['angular'], function(angular) {
return function() {
  this.fields = ["criterionA", "criterionB"];
  var criteria = {};

  var title = function(step) {
    var base = "Ratio Bound SWING weighting";
    var total = (_.size(criteria) - 1);
    if(step > total) return base + " (DONE)";
    return base + " (" + step + "/" + total + ")";
  }

  function getBounds(criterionName) {
    var criterion = criteria[criterionName];
    return [criterion.worst(), criterion.best()].sort();
  }

  function buildInitial(criterionA, criterionB, step) {
    var bounds = getBounds(criterionA);
    var increasing = criteria[criterionA].pvf.direction === 'increasing';
    return {
      title: title(step),
      criterionA: criterionA,
      criterionB: criterionB,
      best: function() { return increasing ? this.choice.upper : this.choice.lower },
      worst: function() { return increasing ? this.choice.lower : this.choice.upper },
      choice: {
        lower: bounds[0],
        upper: bounds[1]
      },
      range: { from: bounds[0], to: bounds[1], rightOpen: true }
    }
  }

  this.initialize = function(state) {
    criteria = state.problem.criteria;
    var state = _.extend(state, buildInitial(state.prefs.ordinal[0], state.prefs.ordinal[1], 1));
    if (!state.prefs["ratio bound"]) state.prefs["ratio bound"] = [];
    return state;
  }

  this.validChoice = function(currentState) {
    var bounds1 = currentState.choice;
    var bounds2 = getBounds(currentState.criterionA);
    return bounds1.lower < bounds1.upper && bounds2[0] <= bounds1.lower && bounds2[1] >= bounds1.upper;
  }

  this.nextState = function(currentState) {
    if(!this.validChoice(currentState)) return;
    var order = currentState.prefs.ordinal;

    var idx = _.indexOf(order, currentState.criterionB);
    var next;
    if(idx > order.length - 2) {
      next = {type: "done", title: title(idx + 1)};
    } else {
      next = buildInitial(order[idx], order[idx + 1], idx + 1);
    }

    function getRatioBounds(currentState) {
      var u = criteria[currentState.criterionA].pvf.map;
      return [1 / u(currentState.choice.lower), 1 / u(currentState.choice.upper)].sort();
    }

    next.prefs = angular.copy(currentState.prefs);
    next.prefs["ratio bound"].push(
      { criteria: [order[idx - 1], order[idx]],
        bounds: getRatioBounds(currentState) });
    return _.extend(angular.copy(currentState), next);
  }

  this.standardize = function(prefs) {
    return _.map(prefs, function(pref) {
      return _.extend(pref, { type: "ratio bound" });
    });
  };

  return this;
}
});
