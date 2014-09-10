'use strict';
define(['mcda/config', 'angular', 'mcda/lib/patavi', 'underscore'], function(Config, angular, patavi, _) {

  return function($scope, $state, currentScenario, taskDefinition, intervalHull) {

    var scenario = currentScenario;
    var state = taskDefinition.clean(scenario.state);

    $scope.title = taskDefinition.title;

    $scope.validChoice = function(currentState) {
      if (currentState) {
        return _.every(currentState.choice, function(choice) {
          var complete = _.isNumber(choice.upper) && _.isNumber(choice.lower);
          return complete && (choice.upper > choice.lower);
        });
      }
      return false;
    };

    $scope.save = function(currentState) {
      if (!this.validChoice(currentState)) {
        return;
      }
      var state = angular.copy(currentState);
      // Rewrite scale information
      _.each(_.pairs(state.choice), function(choice) {
        var pvf = state.problem.criteria[choice[0]].pvf;
        if (!pvf) {
          state.problem.criteria[choice[0]].pvf = {
            range: null
          };
        }
        state.problem.criteria[choice[0]].pvf.range = [choice[1].lower, choice[1].upper];
      });
      scenario.update(state);
      $state.go('preferences');
    };

    var nice = function(x) {
      var log10 = function(x) {
        return Math.log(x) / Math.log(10);
      };
      var negative = x < 0;
      x = Math.abs(x);
      var val = Math.pow(10, Math.floor(log10(x)));
      var nice = _.find(_.range(1, 11), function(n) {
        return x <= val * n;
      });
      return (negative ? -1 : 1) * (val * nice);
    };

    var errorHandler = function(code, error) {
      var message = {
        code: (code && code.desc) ? code.desc : code,
        cause: error
      };
      $scope.$root.$broadcast('patavi.error', message);
    };

    var successHandler = function(state, results) {
      var scales = {};
      var choices = {};
      $scope.$root.$safeApply($scope, function() {
        _.map(_.pairs(results.results), function(criterion) {

          // Calculate interval hulls
          var criterionRange = intervalHull(criterion[1]);

          // Set inital model value
          var pvf = state.problem.criteria[criterion[0]].pvf;
          var problemRange = pvf ? pvf.range : null;
          var from = problemRange ? problemRange[0] : criterionRange[0];
          var to = problemRange ? problemRange[1] : criterionRange[1];

          choices[criterion[0]] = {
            lower: from,
            upper: to
          };

          // Set scales for slider
          var margin = 0.5 * (nice(to) - nice(from));
          var scale = state.problem.criteria[criterion[0]].scale || [null, null];
          scale[0] = _.isNull(scale[0]) ? -Infinity : scale[0];
          scale[1] = _.isNull(scale[1]) ? Infinity : scale[1];

          var boundFrom = function(val) {
            return val < scale[0] ? scale[0] : val;
          };
          var boundTo = function(val) {
            return val > scale[1] ? scale[1] : val;
          };
          scales[criterion[0]] = {
            restrictFrom: criterionRange[0],
            restrictTo: criterionRange[1],
            from: boundFrom(nice(from) - margin),
            to: boundTo(nice(to) + margin),
            increaseFrom: function() {
              this.from = boundFrom(this.from - margin);
            },
            increaseTo: function() {
              this.to = boundTo(this.to + margin);
            }
          };

        });
        $scope.currentStep = _.extend(state, {
          scales: scales,
          choice: choices
        });
      });
    };

    var calculateScales = patavi.submit(Config.pataviService, _.extend(state.problem, {
      'method': 'scales'
    }));
    calculateScales.results.then(_.partial(successHandler, state), errorHandler);


  };
});