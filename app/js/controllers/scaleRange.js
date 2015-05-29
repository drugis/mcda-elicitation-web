'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($scope, $state, $stateParams, currentScenario, taskDefinition, intervalHull, ScaleRangeService) {
    var state = taskDefinition.clean(currentScenario.state);

    $scope.title = taskDefinition.title;

    $scope.validChoice = function(state) {
      if (state) {
        return _.every(state.choice, function(choice) {
          var complete = _.isNumber(choice.upper) && _.isNumber(choice.lower);
          return complete && (choice.upper > choice.lower);
        });
      }
      return false;
    };

    $scope.cancel = function() {
      $state.go('preferences');
    };

    $scope.save = function(currentState) {
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

      currentScenario.state = _.pick(state, ['problem', 'prefs']);
      currentScenario.$save($stateParams, function(scenario) {
        $scope.$emit("elicit.resultsAccessible", scenario);
        $state.go('preferences');
      });

    };

    var initialize = function(state, observed) {
      var scales = {};
      var choices = {};
      _.map(_.pairs(observed), function(criterion) {

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
        var criterionScale = state.problem.criteria[criterion[0]].scale;
        scales[criterion[0]] = ScaleRangeService.calculateScales(criterionScale, from, to, criterionRange);

      });
      $scope.state = _.extend(state, {
        scales: scales,
        choice: choices
      });
    };

    initialize(state, $scope.workspace.$$scales.observed);

  };
});
