'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($scope, handler) {
    var PERSISTENT_FIELDS = ["problem", "type", "prefs"];
    var previousStates =  [];
    var nextStates = [];

    $scope.state = (function() {
      var state;
      if (!_.isUndefined(handler.initialize)) {
        state = handler.initialize();
      }
      return state || {};
    })();

    $scope.canProceed = function(state) {
      return (handler && handler.validChoice(state)) || false;
    };

    $scope.canReturn = function() {
      return previousStates.length > 0;
    };

    $scope.nextStep = function(state) {
      $scope.$broadcast('nextState');
      if (!$scope.canProceed(state)) return false;
      var choice = state.choice;

      // History handling
      previousStates.push(state);
      var nextState = nextStates.pop();
      if (nextState && _.isEqual(nextState.previousChoice, choice)) {
        $scope.state = nextState;
        return true;
      } else {
        nextStates = [];
      }

      state = _.pick(state, PERSISTENT_FIELDS.concat(handler.fields));
      nextState = handler.nextState(state);

      nextState.previousChoice = choice;

      nextState.intermediate = handler.standardize(nextState);

      $scope.state = nextState;
      return true;
    };

    $scope.isFinished = handler.isFinished;

    $scope.previousStep = function() {
      $scope.$broadcast('prevState');
      if (previousStates.length === 0) return false;
      nextStates.push(angular.copy($scope.state));

      var previousState = previousStates.pop();
      $scope.state = previousState;
      return true;
    };
  };
});
