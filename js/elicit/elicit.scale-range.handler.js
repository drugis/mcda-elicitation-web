function ScaleRangeHandler($scope) {
  this.fields = [];

  var log10 = function(x) { return Math.log(x) / Math.log(10); };
  var nice = function(x) {
    var negative = x < 0;
    x = Math.abs(x);
    var val = Math.pow(10, Math.floor(log10(x)));
    var nice = _.find(_.range(1, 11), function(n) {
      return x <= val * n;
    });
    return (negative ? -1 : 1) * (val * nice);
  }

  this.initialize = function(state) {
    var task = patavi.submit("smaa", _.extend({ "method": "scales" }, state.problem));
    var scales = {};
    var choices = {};
    task.results.then(function(results) {
      $scope.$root.$safeApply($scope, function() {
        _.map(_.pairs(results.results[0]), function(criterion) {
          var from = criterion[1]["2.5%"], to = criterion[1]["97.5%"];

          // Set inital model value
          var problemRange = state.problem.criteria[criterion[0]].pvf.range;
          if (problemRange) {
            from = problemRange[0];
            to = problemRange[1];
          }
          choices[criterion[0]] = { lower: from, upper: to };

          // Set scales for slider
          var margin = 0.5 * (nice(to) - nice(from));
          var scale = state.problem.criteria[criterion[0]].scale || [null, null];
          scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
          scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

          var boundFrom = function(val) {
            return val < scale[0] ? scale[0] : val;
          }
          var boundTo = function(val) {
            return val > scale[1] ? scale[1] : val;
          }
          scales[criterion[0]] = {
            restrictFrom: criterion[1]["2.5%"],
            restrictTo: criterion[1]["97.5%"],
            from: boundFrom(nice(from) - margin),
            to: boundTo(nice(to) + margin),
            increaseFrom: function() { this.from = boundFrom(this.from - margin) },
            increaseTo: function() { this.to = boundTo(this.to + margin) }
          };
        });
      });
    });

    var result = _.extend(state, {
      title: "Measurement scales",
      type: "scale range",
      scales: scales,
      choice: choices
    });
    return result;
  }

  this.validChoice = function(currentState) {
    return _.every(currentState.choice, function(choice) {
      var complete = _.isNumber(choice["upper"]) && _.isNumber(choice["lower"]);
      return complete && (choice.upper > choice.lower);
    });
  }

  this.nextState = function(currentState) {
    if(!this.validChoice(currentState)) return;

    // Rewrite scale information
    _.each(_.pairs(currentState.choice), function(choice) {
      currentState.problem.criteria[choice[0]].pvf.range = [choice[1].lower, choice[1].upper];
    });

    var nextState = angular.copy(currentState);
    nextState.type = "partial value function";
    return nextState;
  }

  return this;
}
