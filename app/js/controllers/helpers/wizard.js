define(['angular', 'underscore'], function(angular, _) {
  return ['$scope', 'handler', function($scope, handler) {

    var PERSISTENT_FIELDS = [];
    var previousSteps = [];
    var nextSteps = [];

    $scope.canProceed = function(currentStep) {
      return (handler && handler.validChoice(currentStep)) || false;
    };

    $scope.canReturn = function() {
      return previousSteps.length > 0;
    };

    $scope.nextStep = function(currentStep) {
      if(!$scope.canProceed(currentStep)) return false;
      var choice = currentStep.choice;

      // History handling
      previousSteps.push(currentStep);
      var nextStep = nextSteps.pop();
      if(nextStep && _.isEqual(nextStep.previousChoice, choice)) {
        $scope.currentStep = nextStep;
        return true;
      } else {
        nextSteps = [];
      }

      currentStep = _.pick(currentStep, PERSISTENT_FIELDS.concat(handler.fields));
      nextStep = handler.nextState(currentStep);

      nextStep.previousChoice = choice;

      $scope.currentStep = nextStep;

      return true;
    };

    $scope.previousStep = function() {
      if (previousSteps.length == 0) return false;
      nextSteps.push(angular.copy($scope.currentStep));

      var previousStep = previousSteps.pop();
      $scope.currentStep = previousStep;
      return true;
    };

  }];
});
