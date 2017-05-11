'use strict';
define(function(require) {
  require("angular");
  var _ = require("lodash");

  return function($scope, $state, $stateParams, taskDefinition, intervalHull, ScaleRangeService) {
    $scope.state = {
      problem: $scope.workspace.problem
    };
    $scope.title = taskDefinition.title;
    
    // functions
    $scope.validChoice = validChoice;
    $scope.cancel = cancel;
    $scope.save = save;

    initialize($scope.workspace.$$scales.observed);

    function validChoice() {
      if ($scope.state) {
        return _.every($scope.state.choice, function(choice) {
          var complete = _.isNumber(choice.upper) && _.isNumber(choice.lower);
          return complete && (choice.upper > choice.lower);
        });
      }
      return false;
    }

    function initialize(observed) {
      var scales = {};
      var choices = {};
      _.map(_.toPairs(observed), function(criterion) {

        // Calculate interval hulls
        var criterionRange = intervalHull(criterion[1]);

        // Set inital model value
        var pvf = $scope.state.problem.criteria[criterion[0]].pvf;
        var problemRange = pvf ? pvf.range : null;
        var from = problemRange ? problemRange[0] : criterionRange[0];
        var to = problemRange ? problemRange[1] : criterionRange[1];

        choices[criterion[0]] = {
          lower: from,
          upper: to
        };

        // Set scales for slider
        var criterionScale = $scope.state.problem.criteria[criterion[0]].scale;
        scales[criterion[0]] = ScaleRangeService.calculateScales(criterionScale, from, to, criterionRange);

      });
      $scope.state = _.extend($scope.state, {
        scales: scales,
        choice: choices
      });
    }

    function save() {
      // Rewrite scale information
      _.each(_.toPairs($scope.state.choice), function(choice) {
        var pvf = $scope.state.problem.criteria[choice[0]].pvf;
        if (!pvf) {
          $scope.state.problem.criteria[choice[0]].pvf = {
            range: null
          };
        }
        $scope.state.problem.criteria[choice[0]].pvf.range = [choice[1].lower, choice[1].upper];
      });
      $state.go('problem');
    }

    function cancel() {
      $state.go('problem');
    }
  };
});
