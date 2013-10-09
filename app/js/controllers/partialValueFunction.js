define(['angular', 'lib/patavi', 'underscore'], function(angular, patavi, _) {
  return function($scope) {
    var self = this;
    this.fields = [];

    this.createPartialValueFunction = function(_criterion) {
      var criterion = angular.copy(_criterion);
      var pvf = criterion.pvf;
      var increasing = pvf.direction === "increasing";

      function extreme(idx1, idx2) {
        return function() {
          return increasing ? pvf.range[idx1] : pvf.range[idx2];
        };
      }
      criterion.worst = extreme(0, 1);
      criterion.best = extreme(1, 0);

      var findIndexOfFirstLargerElement = function(arr, val) {
        return _.indexOf(arr, _.find(arr, function(elm) {
          return elm >= val;
        })) || 1;
      };

      var findIndexOfFirstSmallerElement = function(arr, val) {
        return _.indexOf(arr, _.find(arr, function(elm) {
          return elm <= val;
        })) || 1;
      };

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
      };

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
    };

    function extendPartialValueFunctions(state) {
      function addPartialValueFunction(criterion) {
        _.extend(criterion, self.createPartialValueFunction(criterion));
      }
      angular.forEach(state.problem.criteria, addPartialValueFunction);
      return state;
    }

    function standardize(state) {
      // Copy choices to problem
      var excluded = ["comp", "base"];
      angular.forEach(_.pairs(state.problem.criteria), function(criterion) {
        angular.forEach(_.keys(state.choice.data[criterion[0]]), function(key) {
          if(excluded.indexOf(key) == -1) {
            criterion[1].pvf[key] = state.choice.data[criterion[0]][key];
          }
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
              var level = choice.preferences.indexOf(preferences[i][j]) + 1;
              preferences[i][j] = level == 0 ? null : level;
            }
          }
          return preferences;
        }

        var preferences = rewritePreferences(choice.data[choice.criterion].preferences);
        var task = patavi.submit("smaa", { method: "macbeth", preferences: preferences });
        task.results.then(function(results) {
          $scope.$root.$safeApply($scope, function() {
            currentStep.results = results.results;
            var values = _.clone(results.results);
            values = values.slice(1, values.length - 1);
            choice.data[choice.criterion].values = values;
            currentStep.error = null;
          });
        }, function(code, error) {
          $scope.$root.$safeApply($scope, function() {
            currentStep.error = { code:(code && code.desc) ? code.desc : code,
                                  cause: error };
          });
        });
      };

      var initial = {
        type: "partial value function",
        title: "Partial Value Function",
        choice: { data: pluckObject(state.problem.criteria, "pvf"),
                  calculate: calculate,
                  preferences:
                  ["Very Weakly", "Weakly", "Moderately", "Strongly", "Very Strongly", "Extremely"],
                  getXY: _.memoize(function(data, criterion) {
                    var y = [1].concat(data[criterion].values).concat([0]);
                    var best = state.problem.criteria[criterion].best();
                    var worst = state.problem.criteria[criterion].worst();
                    var x = [best].concat(data[criterion].cutoffs).concat([worst]);
                    var values = _.map(_.zip(x, y), function(p) {
                      return {x: p[0], y: p[1] };
                    });
                    return [ { key: "Piecewise PVF", values: values }];
                  }, function(data, criterion) { // Hash function
                    var values = _.reduce(data[criterion].values, function(sum, x) { return sum + x; });
                    var cutoffs = _.reduce(data[criterion].cutoffs, function(sum, x) { return sum + x; });
                    return 31 * values + cutoffs + criterion.hashCode();
                  })
                }
      };
      return _.extend(state, initial);
    };

    this.validChoice = function(currentState) {
      if (currentState.choice.subType === 'elicit values') {
        var criterion = currentState.choice.criterion;
        return currentState.choice.data[criterion].cutoffs.length == currentState.choice.data[criterion].values.length;
      }
      return true;
    };

    this.nextState = function(currentState) {
      var nextState = angular.copy(currentState);

      var criteria = _.keys(nextState.problem.criteria).sort();
      var criterion = _.find(criteria, function(c) {
        return nextState.choice.data[c].type === "piecewise-linear" && !nextState.choice.data[c].cutoffs;
      });

      var choice = nextState.choice;

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
        };
        choice.data[criterion].validCutoff = function(cutoff) {
          var allowed = (cutoff < info.best() && cutoff > info.worst()) || (cutoff < info.worst() && cutoff > info.best());
          var unique = choice.data[criterion].cutoffs.indexOf(cutoff) == -1;
          return allowed && unique;
        };
      } else {
        nextState.type = "ordinal";
      }
      return standardize(nextState);
    };

    return this;
  };
});
