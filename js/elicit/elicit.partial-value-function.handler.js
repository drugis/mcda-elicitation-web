function PartialValueFunctionHandler(problem) {
  var self = this;
  this.fields = [];

  this.createPartialValueFunction = function(_criterion) {
    var criterion = angular.copy(_criterion);
    function create(idx1, idx2) {
      return function() {
        var pvf = criterion.pvf;
        return pvf.direction === "increasing" ? pvf.range[idx1] : pvf.range[idx2];
      }
    }
    criterion.worst = create(0, 1);
    criterion.best = create(1, 0);
    criterion.pvf.map = function(x) {
      var range = Math.abs(criterion.best() - criterion.worst());
      return criterion.pvf.direction === "increasing" ? ((x - criterion.worst()) / range) : ((criterion.worst() - x) / range);
    };
    criterion.pvf.inv = function(x) {
      var range = Math.abs(criterion.best() - criterion.worst());
      return criterion.pvf.direction === "increasing" ? ((x * range) + criterion.worst()) : (-(x * range) + criterion.worst());
    };
    return criterion;
  }

  this.initialize = function(state) {
    function addPartialValueFunction(criterion) { _.extend(criterion, self.createPartialValueFunction(criterion)) }
    angular.forEach(state.criteria, addPartialValueFunction);
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
