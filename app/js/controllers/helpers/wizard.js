'use strict';
define(['lodash', 'angular'], function(_, angular) {

  return function($scope, $timeout, handler) {
    // functions
    $scope.canProceed = canProceed;
    $scope.canReturn = canReturn;
    $scope.nextStep = nextStep;
    $scope.previousStep = previousStep;

    // init
    var PERSISTENT_FIELDS = ['problem', 'type', 'prefs'];
    var previousStates = [];
    var nextStates = [];

    $scope.state = (function() {
      var state;
      if (!_.isUndefined(handler.initialize)) {
        state = handler.initialize();
      }
      return state || {};
    })();

    $scope.isFinished = handler.isFinished;


    function canProceed(state) {
      return (handler && handler.validChoice(state)) || false;
    }

    function canReturn() {
      return previousStates.length > 0;
    }

    function nextStep(state) {
      $scope.$broadcast('nextState');
      if (!$scope.canProceed(state)) {
        return false;
      }
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
    }

    function previousStep() {
      if (previousStates.length === 0) {
        return false;
      }
      nextStates.push(angular.copy($scope.state));

      var previousState = previousStates.pop();
      $scope.state = previousState;
      $timeout(function() {
        $scope.$broadcast('rzSliderForceRender');
      }, 100);
      return true;
    }
  };
});