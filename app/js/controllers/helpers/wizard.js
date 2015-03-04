'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($rootScope, $scope, handler) {
    var PERSISTENT_FIELDS = ["problem", "type", "prefs"];
    var previousSteps = [];
    var nextSteps = [];

    $scope.currentStep = (function() {
      var state;
      if (!_.isUndefined(handler.initialize)) {
        state = handler.initialize();
      }
      return state || {};
    })();

    $scope.canProceed = function(currentStep) {
      return (handler && handler.validChoice(currentStep)) || false;
    };

    $scope.canReturn = function() {
      return previousSteps.length > 0;
    };

    $scope.nextStep = function(currentStep) {
      $scope.$broadcast('nextstep');
      if (!$scope.canProceed(currentStep)) return false;
      var choice = currentStep.choice;

      // History handling
      previousSteps.push(currentStep);
      var nextStep = nextSteps.pop();
      if (nextStep && _.isEqual(nextStep.previousChoice, choice)) {
        $scope.currentStep = nextStep;
        return true;
      } else {
        nextSteps = [];
      }

      currentStep = _.pick(currentStep, PERSISTENT_FIELDS.concat(handler.fields));
      nextStep = handler.nextState(currentStep);

      nextStep.previousChoice = choice;

      nextStep.intermediate =  handler.standardize(nextStep.prefs);

      $scope.currentStep = nextStep;


     return true;
    };

    $scope.previousStep = function() {
      $scope.$broadcast('prevstep');
      if (previousSteps.length === 0) return false;
      nextSteps.push(angular.copy($scope.currentStep));

      var previousStep = previousSteps.pop();
      $scope.currentStep = previousStep;
      return true;
    };
  };
});
