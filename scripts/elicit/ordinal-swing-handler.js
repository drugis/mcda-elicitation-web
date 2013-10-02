define(['angular'], function(angular) {
return function() {
  this.fields = ["reference", "choices"];
  var criteria = {};

  var getReference = function() {
    return _.object(
      _.keys(criteria),
      _.map(criteria, function(criterion) { return criterion.worst(); })
    );
  }

  var title = function(step) {
    var base = "Ordinal SWING weighting";
    var total = (_.size(criteria) - 1);
    if(step > total) return base + " (DONE)";
    return base + " (" + step + "/" + total + ")";
  }

  this.initialize = function(state) {
    criteria = state.problem.criteria;
    var fields = {
      title: title(1),
      type: "ordinal",
      prefs: { ordinal: [] },
      reference: getReference(),
      choices: (function() {
        var criteria = state.problem.criteria;
        var choices = _.map(_.keys(criteria), function(criterion) {
          var reference = getReference();
          reference[criterion] = criteria[criterion].best();
          return reference;
        });
        return _.object(_.keys(criteria), choices);
      })()
    };
    return _.extend(state, fields);
  }

  this.validChoice = function(currentState) {
    return _.contains(_.keys(criteria), currentState.choice);
  }

  this.nextState = function(currentState) {
    if(!this.validChoice(currentState)) {
      return;
    }

    var nextState = angular.copy(currentState);
    var choice = currentState.choice;
    nextState.choice = undefined;

    _.each(nextState.choices, function(alternative) {
      alternative[choice] = criteria[choice].best();
    });

    function next(choice) {
      delete nextState.choices[choice];
      nextState.reference[choice] = currentState.problem.criteria[choice].best();
      nextState.prefs.ordinal.push(choice);
      nextState.title = title(nextState.prefs.ordinal.length + 1);
    }
    next(choice);

    if(_.size(nextState.choices) == 1) {
      next(_.keys(nextState.choices)[0]);
      nextState.type = "choose method";
    }
    return nextState;
  }

  this.standardize = function(order) {
    function ordinal(a, b) { return { type: "ordinal", criteria: [a, b] }; };
    var result = [];
    for (var i = 0; i < order.length - 1; i++) {
      result.push(ordinal(order[i], order[i + 1]));
    }
    if (order.length > 0) {
      var remaining = _.difference(_.keys(criteria), order).sort();
      result = result.concat(_.map(remaining, function(criterion) { return ordinal(_.last(order), criterion); }));
    }
    return result;
  };

  return this;
}
});
