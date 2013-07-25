function PartialValueFunctionHandler(Tasks) {
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

  function extendPartialValueFunctions(state) {
    function addPartialValueFunction(criterion) {
      _.extend(criterion, self.createPartialValueFunction(criterion));
    }
    angular.forEach(state.problem.criteria, addPartialValueFunction);
    return state;
  }

  function standardize(state) {
    // Copy choices to problem
    angular.forEach(_.pairs(state.problem.criteria), function(criterion) {
      angular.forEach(_.keys(state.choice.data[criterion[0]]), function(key) {
        criterion[1].pvf[key] = state.choice.data[criterion[0]][key];
      });
    });

    return extendPartialValueFunctions(state);
  }

  this.initialize = function(state) {
    state = extendPartialValueFunctions(state);
    function pluckObject(obj, field) {
      return _.object(_.map(_.pairs(obj), function(el) {
        return [el[0], el[1][field]];
      }));
    }

    var calculate = function(currentStep) {
      var choice = currentStep.choice;
      function rewritePreferences(preferences) {
        preferences = angular.copy(preferences);
        for (i = 0; i < preferences.length; ++i) {
          for (j = 0; j < preferences[i].length; ++j) {
            var level = choice.preferences.indexOf(preferences[i][j]);
            preferences[i][j] = level == -1 ? null : level;
          }
        }
        return preferences;
      }
      var preferences = rewritePreferences(choice.data[choice.criterion].preferences);
      var task = Tasks.submit("smaa", { method: "macbeth", preferences: preferences });
      task.results.then(function(results) {
        currentStep.results = results.body;
        var values = _.clone(results.body);
        values = values.slice(1, values.length - 1);
        choice.data[choice.criterion].values = values;
      }, function(error) { currentStep.error = error; });
    }

    var initial = {
      type: "partial value function",
      title: "Partial Value Function",
      choice: { data: pluckObject(state.problem.criteria, "pvf"),
                calculate: calculate,
                preferences: ["Indifferent", "Very Weak", "Weak", "Moderate", "Strong", "Very Strong", "Extreme"]
      }
    }
    return _.extend(state, initial);
  }

  this.validChoice = function(currentState) {
    if (currentState.choice.subType === 'elicit values') {
      var criterion = currentState.choice.criterion;
      return currentState.choice.data[criterion].cutoffs.length == currentState.choice.data[criterion].values.length;
    }
    return true;
  }

  this.nextState = function(currentState) {
    var nextState = angular.copy(currentState);

    var criteria = _.keys(nextState.problem.criteria).sort();
    var criterion = _.find(criteria, function(c) {
      return nextState.choice.data[c].type === "piecewise-linear" && !nextState.choice.data[c].cutoffs;
    });

    var choice = nextState.choice;
    if (choice.subType == 'elicit values') {

    }

    if (choice.subType == 'elicit cutoffs') {
      var info = nextState.problem.criteria[choice.criterion];
      choice.subType = 'elicit values';
      var cutoffs = choice.data[choice.criterion].cutoffs;
      var size = cutoffs.length + 2;

      // Initialize preference matrix
      choice.data[choice.criterion].preferences = [];
      for (i = 0; i < size; ++i) {
        choice.data[choice.criterion].preferences[i] = [];
        for (j = 0; j < size; ++j) {
          choice.data[choice.criterion].preferences[i][j] = i == j ? choice.preferences[0] : null;
        }
      }

      // Generate comparator lists
      var tmp = [info.best()].concat(cutoffs || []).concat([info.worst()]);
      choice.data[choice.criterion].base = tmp.slice(0, tmp.length - 1);
      choice.data[choice.criterion].comp = [];
      for (i = 0; i < tmp.length - 1; ++i) {
        choice.data[choice.criterion].comp[i] = tmp.slice(i + 1, tmp.length);
      }

      choice.data[choice.criterion].values = [];
    } else if (criterion) {
      var info = nextState.problem.criteria[criterion];
      choice.subType = "elicit cutoffs";
      choice.criterion = criterion;

      choice.data[criterion].cutoffs = [];

      choice.data[criterion].addCutoff = function(cutoff) {
        choice.data[criterion].cutoffs.push(cutoff);
        choice.data[criterion].cutoffs.sort(function(a, b) {
          return info.pvf.direction === "decreasing" ? a - b : b - a;
        });
      }
      choice.data[criterion].validCutoff = function(cutoff) {
        var allowed = (cutoff < info.best() && cutoff > info.worst()) || (cutoff < info.worst() && cutoff > info.best());
        var unique = choice.data[criterion].cutoffs.indexOf(cutoff) == -1;
        return allowed && unique;
      }
    } else {
      nextState.type = "ordinal";
    }
    return standardize(nextState);
  }

  return this;
}
