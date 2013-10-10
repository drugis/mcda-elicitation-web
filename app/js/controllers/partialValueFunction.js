define(['controllers/helpers/wizard', 'angular', 'lib/patavi', 'underscore'], function(Wizard, angular, patavi, _) {
  return ['$scope', '$routeParams', '$injector', 'Workspace', function($scope, $routeParams, $injector, Workspace) {

    var workspaceId = $routeParams.workspaceId;
    var state = Workspace.get(workspaceId);

    var standardize = function(state) {
      // Copy choices to problem
      var excluded = ["comp", "base"];
      angular.forEach(_.pairs(state.problem.criteria), function(criterion) {
        angular.forEach(_.keys(state.choice.data[criterion[0]]), function(key) {
          if(excluded.indexOf(key) == -1) {
            criterion[1].pvf[key] = state.choice.data[criterion[0]][key];
          }
        });
      });

      return state;
    };

    var initialize = function(state) {
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
            currentStep.error =
              { code:(code && code.desc) ? code.desc : code,
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

    var validChoice = function(currentState) {
      if (currentState.choice.subType === 'elicit values') {
        var criterion = currentState.choice.criterion;
        return currentState.choice.data[criterion].cutoffs.length == currentState.choice.data[criterion].values.length;
      }
      return true;
    };

    var nextState = function(currentState) {
      var nextState = angular.copy(currentState);

      var criteria = _.keys(nextState.problem.criteria).sort();
      var criterion = _.find(criteria, function(c) {
        return nextState.choice.data[c].type === "piecewise-linear" && !nextState.choice.data[c].cutoffs;
      });

      var choice = nextState.choice;

      var info;
      if (choice.subType == 'elicit cutoffs') {
        info = nextState.problem.criteria[choice.criterion];
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

    $scope.currentStep = initialize(state);

    $injector.invoke(Wizard, this, {
      $scope: $scope,
      handler: { validChoice: validChoice,
                 fields: ["problem", "type", "prefs", "choice"],
                 standardize: standardize,
                 nextState: nextState }
    });
    $scope.$apply();

  }];
});
