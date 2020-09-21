'use strict';
define(['lodash', 'angular'], function (_, angular) {
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

    $scope.state = initializeState();
    $scope.isFinished = handler.isFinished;

    function initializeState() {
      if (!_.isUndefined(handler.initialize)) {
        return handler.initialize();
      } else {
        return {};
      }
    }

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
      var currentChoice = state.choice || state.mostImportantCriterionId;
      // History handling
      previousStates.push(angular.copy(state));

      if (nextStates.length) {
        var nextState = nextStates.pop();
        if (
          currentChoice === nextState.previousChoice ||
          currentChoice === nextState.mostImportantCriterionId
        ) {
          $scope.state = nextState;
          return true;
        }
      }
      $scope.nextStates = [];
      var newState = _.pick(
        _.cloneDeep(state),
        PERSISTENT_FIELDS.concat(handler.fields)
      );
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
      if (isPvfWizard()) {
        updatePvfPlot();
      } else if ($scope.state.choice) {
        updateRankingCriterion();
      } else {
        updateSwingSliders();
      }
      return true;
    }

    function isPvfWizard() {
      return $scope.state.choice && $scope.state.choice.pvf;
    }

    function updatePvfPlot() {
      handler.updatePlot({
        dataSources: [$scope.state.choice]
      });
    }

    function updateRankingCriterion() {
      var choiceCriterion = _.find($scope.criteria, function (criterion) {
        return criterion.id === $scope.state.choice;
      });
      choiceCriterion.alreadyChosen = false;
    }

    function updateSwingSliders() {
      $timeout(function () {
        $scope.$broadcast('rzSliderForceRender');
      }, 100);
    }
  }
  return dependencies.concat(wizard);
});
