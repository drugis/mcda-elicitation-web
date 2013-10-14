define(['angular', 'underscore'], function(angular, _) {
  return function() {
    this.fields = ["criterionA", "criterionB"];
    var criteria = {};

    var title = function(step) {
      var base = "Exact SWING weighting";
      var total = (_.size(criteria) - 1);
      if(step > total) return base + " (DONE)";
      return base + " (" + step + "/" + total + ")";
    };

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
        choice: (bounds[0] + bounds[1]) / 2,
        range: { from: bounds[0], to: bounds[1], rightOpen: true }
      };
    }

    this.initialize = function(state) {
      criteria = state.problem.criteria;
      state = _.extend(state, buildInitial(state.prefs.ordinal[0], state.prefs.ordinal[1], 1));
      if (!state.prefs["exact swing"]) state.prefs["exact swing"] = [];
      return state;
    };

    this.validChoice = function(currentState) {
      var value = currentState.choice;
      var bounds = getBounds(currentState.criterionA);
      return value < bounds[1] && value >= bounds[0];
    };

    this.nextState = function(currentState) {
      if(!this.validChoice(currentState)) return null;
      var order = currentState.prefs.ordinal;

      var idx = _.indexOf(order, currentState.criterionB);
      var next;
      if(idx > order.length - 2) {
        next = {type: "done", title: title(idx + 1)};
      } else {
        next = buildInitial(order[idx], order[idx + 1], idx + 1);
      }

      function getRatio(currentState) {
        var u = criteria[currentState.criterionA].pvf.map;
        return 1 / u(currentState.choice);
      }

      next.prefs = angular.copy(currentState.prefs);
      next.prefs["exact swing"].push(
        { criteria: [order[idx - 1], order[idx]],
          ratio: getRatio(currentState) });
      return _.extend(angular.copy(currentState), next);
    };

    this.standardize = function(prefs) {
      return _.map(prefs, function(pref) {
        return _.extend(pref, { type: "exact swing" });
      });
    };

    return this;
  };
});
