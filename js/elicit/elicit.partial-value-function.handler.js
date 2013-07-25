function PartialValueFunctionHandler() {
  var self = this;
  this.fields = [];

  this.createPartialValueFunction = function(_criterion) {
    var criterion = angular.copy(_criterion);
    var pvf = criterion.pvf;
    var increasing = pvf.direction === "increasing";

    function extreme(idx1, idx2) {
      return function() {
        return increasing ? pvf.range[idx1] : pvf.range[idx2];
      }
    }
    criterion.worst = extreme(0, 1);
    criterion.best = extreme(1, 0);

    var findIndexOfFirstLargerElement = function(arr, val) {
      return _.indexOf(arr, _.find(arr, function(elm) {
        return elm >= val;
      })) || 1;
    }

    var findIndexOfFirstSmallerElement = function(arr, val) {
      return _.indexOf(arr, _.find(arr, function(elm) {
        return elm <= val;
      })) || 1;
    }

    var cutoffs = [pvf.range[0]].concat(pvf.cutoffs || []);
    cutoffs.push(pvf.range[1]);

    var values = [increasing ? 0.0 : 1.0].concat(pvf.values || []);
    values.push(increasing ? 1.0 : 0.0);

    var intervalInfo = function(idx) {
      return {
        "x0": cutoffs[idx - 1],
        "x1": cutoffs[idx],
        "v0": values[idx - 1],
        "v1": values[idx]
      };
    }

    criterion.pvf.map = function(x) {
      var idx = findIndexOfFirstLargerElement(cutoffs, x);
      var i = intervalInfo(idx);
      return i.v0 + (x - i.x0) * ((i.v1 - i.v0) / (i.x1 - i.x0));
    };

    criterion.pvf.inv = function(v) {
      var idx = !increasing ? findIndexOfFirstSmallerElement(values, v) : findIndexOfFirstLargerElement(values, v);
      var i = intervalInfo(idx);
      return i.x0 + (v - i.v0) * ((i.x1 - i.x0) / (i.v1 - i.v0));
    };
    return criterion;
  }

  this.standardize = function(state) {
    var state = angular.copy(state);
    function addPartialValueFunction(criterion) {
      _.extend(criterion, self.createPartialValueFunction(criterion));
    }
    angular.forEach(state.problem.criteria, addPartialValueFunction);

    // Copy choices
    angular.forEach(_.pairs(state.problem.criteria), function(criterion) {
      angular.forEach(_.keys(state.choice[criterion[0]]), function(key) {
        criterion[1].pvf[key] = state.choice[criterion[0]][key];
      });
    });
    return state;
  }

  this.initialize = function(state) {
    function pluckPairs(obj, field) {
      return _.object(_.map(_.pairs(obj), function(el) {
        return [el[0], el[1][field]];
      }));
    }

    var initial = {
      type: "partial value function",
      title: "Partial Value Function",
      choice: pluckPairs(state.problem.criteria, "pvf")
    }
    return this.standardize(_.extend(state, initial));
  }

  this.validChoice = function(currentState) {
    return true;
  }

  this.nextState = function(currentState) {
    var nextState = angular.copy(currentState);

    var criteria = _.keys(nextState.problem.criteria).sort();
    var criterion = _.find(criteria, function(c) {
      return nextState.choice[c].type === "piecewise-linear" && !nextState.choice[c].cutoffs;
    });

    if (nextState.choice.elicit && nextState.choice.elicit.subType == 'elicit cutoffs') {
      nextState.choice.elicit.subType = 'elicit values';
      nextState.choice[nextState.choice.elicit.criterion].values = [];
    } else if (criterion) {
      nextState.choice.elicit = {
        "subType": "elicit cutoffs",
        "criterion": criterion
      };
      nextState.choice[criterion].cutoffs = [];
    } else {
      nextState.type = "ordinal";
    }
    return this.standardize(nextState);
  }

  return this;
}
