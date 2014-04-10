'use strict';
define(['mcda/controllers/helpers/wizard', 'angular', 'mcda/lib/patavi', 'underscore'], function(Wizard, angular, patavi, _) {
  return function($scope, $injector, currentScenario, taskDefinition, PartialValueFunction) {
    var standardize = function(state) {
      // Copy choices to problem
      _.each(_.pairs(state.problem.criteria), function(pair) {
        var name = pair[0], criterion = pair[1];
        var isLinear = state.choice.data[name].type === "linear";
        var baseIncluded = ["range", "type", "direction"];
        var included  = isLinear ? baseIncluded : baseIncluded.concat(["values", "cutoffs"]);
        criterion.pvf = _.pick(state.choice.data[name], included);
      });

      return state;
    };

    var initialize = function(state) {
      function pluckObject(obj, field) {
        return _.object(_.map(_.pairs(obj), function(el) {
          return [el[0], el[1][field]];
        }));
      }

      var calculate = function(currentState) {
        var choice = currentState.choice;
        function rewritePreferences(preferences) {
          preferences = angular.copy(preferences);
          for (var i = 0; i < preferences.length; ++i) {
            for (var j = 0; j < preferences[i].length; ++j) {
              var level = choice.preferences.indexOf(preferences[i][j]) + 1;
              preferences[i][j] = level === 0 ? null : level;
            }
          }
          return preferences;
        }

        var preferences = rewritePreferences(choice.data[choice.criterion].preferences);
        var task = patavi.submit("smaa", { method: "macbeth", preferences: preferences });
        task.results.then(function(results) {
          $scope.$root.$safeApply($scope, function() {
            currentState.results = results.results;
            var values = _.clone(results.results);
            values = values.slice(1, values.length - 1);
            choice.data[choice.criterion].values = values;
            currentState.error = null;
          });
        }, function(code, error) {
          $scope.$root.$safeApply($scope, function() {
            currentState.error =
              { code: (code && code.desc) ? code.desc : code,
                cause: error };
          });
        });
      };

      var initial = {
        choice:
        { data: pluckObject(state.problem.criteria, "pvf"),
          calculate: calculate,
          preferences:
          ["Very Weakly", "Weakly", "Moderately", "Strongly", "Very Strongly", "Extremely"],
          getXY: _.memoize(function(data, criterion) {
            var y = [1].concat(data[criterion].values).concat([0]);
            var best = state.problem.criteria[criterion].best();
            var worst = state.problem.criteria[criterion].worst();
            var x = [best].concat(data[criterion].cutoffs).concat([worst]);
            var values = _.map(_.zip(x, y), function(p) {
              return { x: p[0], y: p[1] };
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

    var validChoice = function(currentState) {
      if (currentState && currentState.choice.subType === 'elicit values') {
        var criterion = currentState.choice.criterion;
        var choice = currentState.choice.data;
        return choice[criterion].cutoffs.length == choice[criterion].values.length;
      }
      return true;
    };

    var getNextPiecewiseLinear = function(criteria, state) {
      return  _.find(criteria, function(c) {
        return state.choice.data[c].type === "piecewise-linear" && !state.choice.data[c].cutoffs;
      });
    };

    var nextState = function(currentState) {
      var nextState = angular.copy(currentState);

      var criteria = _.keys(nextState.problem.criteria).sort();
      var criterion = getNextPiecewiseLinear(criteria, nextState);
      var choice = nextState.choice;

      var info;
      if (choice.subType === 'elicit cutoffs') {
        info = nextState.problem.criteria[choice.criterion];
        choice.subType = 'elicit values';
        var cutoffs = choice.data[choice.criterion].cutoffs;
        var size = cutoffs.length + 2;

        // Initialize preference matrix
        choice.data[choice.criterion].preferences = [];
        for (var i = 0; i < size; ++i) {
          choice.data[choice.criterion].preferences[i] = [];
          for (var j = 0; j < size; ++j) {
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
        info = nextState.problem.criteria[criterion];
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
      }
      return standardize(nextState);
    };

    $scope.save = function(state) {
      currentScenario.update(PartialValueFunction.attach(standardize(state)));
      currentScenario.redirectToDefaultView();
    };

    $scope.canSave = function(state) {
      if(!state) return false;
      var criteria = _.keys(state.problem.criteria).sort();
      var criterion = getNextPiecewiseLinear(criteria, state);
      return state.choice.subType !== 'elicit cutoffs' && !criterion;
    };

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: { validChoice: validChoice,
                 fields: ["type", "choice", "title"],
                 hasIntermediateResults: false,
                 initialize: _.partial(initialize, taskDefinition.clean(currentScenario.state)),
                 standardize: _.identity,
                 nextState: nextState }
    });
  };
});
