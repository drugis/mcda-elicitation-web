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

  this.initialize = function(state) {
    function addPartialValueFunction(criterion) { _.extend(criterion, self.createPartialValueFunction(criterion)) }
    angular.forEach(state.problem.criteria, addPartialValueFunction);
    state.title = "Partial Value Functions";
    return state;
  }

  this.validChoice = function(currentState) {
    return true;
  }

  this.nextState = function(currentState) {
    var nextState = angular.copy(currentState);
    nextState.type = "ordinal";
    return nextState;
  }

  return this;
}
