'use strict';
define(['mcda/config', 'angular', 'underscore'], function(Config, angular, _) {

  return function($scope, $state, $stateParams, taskDefinition, intervalHull, PartialValueFunction, MCDAPataviService, ScaleRangeService) {

    var state = taskDefinition.clean($scope.scenario.state);

    $scope.title = taskDefinition.title;

    $scope.validChoice = function(currentStep) {
      if (currentStep) {
        return _.every(currentStep.choice, function(choice) {
          var complete = _.isNumber(choice.upper) && _.isNumber(choice.lower);
          return complete && (choice.upper > choice.lower);
        });
      }
      return false;
    };

    $scope.save = function(currentStep) {
      if (!this.validChoice(currentStep)) {
        return;
      }
      var state = angular.copy(currentStep);
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

      var fields = ['problem', 'prefs'];
      $scope.scenario.state = _.pick(state, fields);
      $scope.scenario.$save($stateParams, function(scenario) {
        PartialValueFunction.attach(scenario.state);
        $scope.$emit('elicit.scenariosChanged');
        $state.go('preferences');
      });

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
          var margin = 0.5 * (ScaleRangeService.nice(to) - ScaleRangeService.nice(from));
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
            from: boundFrom(ScaleRangeService.nice(from) - margin),
            to: boundTo(ScaleRangeService.nice(to) + margin),
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

    var calculateScales = MCDAPataviService.run(_.extend(state.problem, {
      'method': 'scales'
    }));
    calculateScales.then(_.partial(successHandler, state), errorHandler);


  };
});
