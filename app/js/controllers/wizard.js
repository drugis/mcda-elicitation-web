'use strict';
define(['lodash', 'angular'], function(_, angular) {

  var dependencies = ['$scope', '$timeout', 'handler'];

  function wizard($scope, $timeout, handler) {
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
      if (!$scope.canProceed(state)) {
        return false;
      }
      var currentChoice = state.choice || state.mostImportantCriterion;
      // History handling
      previousStates.push(angular.copy(state));

      if (nextStates.length) {
        var nextState = nextStates.pop();
        if (currentChoice === nextState.previousChoice || currentChoice === nextState.mostImportantCriterion) {
          $scope.state = nextState;
          return true;
        }
      }
      $scope.nextStates = [];
      var newState = _.pick(_.cloneDeep(state), PERSISTENT_FIELDS.concat(handler.fields));
      newState.previousChoice = currentChoice;
      newState.intermediate = handler.standardize(newState);
      $scope.state = handler.nextState(newState);
      return true;
    }

    function previousStep() {
      if (previousStates.length === 0) {
        return false;
      }
      nextStates.push(angular.copy($scope.state));
      $scope.state = previousStates.pop();

      if ($scope.state.choice) { // ranking
        var choiceCriterion = _.find($scope.criteria, function(criterion) { return criterion.id === $scope.state.choice; });
        choiceCriterion.alreadyChosen = false;
      } else { // swing
        $timeout(function() {
          $scope.$broadcast('rzSliderForceRender');
        }, 100);
      }
      return true;
    }
  }

  return dependencies.concat(wizard);
});
