define(['angular','lib/patavi', 'underscore'], function(angular, patavi, _) {
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

/*    $scope.getStandardizedPreferences = function(currentStep) {
      var prefs = currentStep.prefs;
      return _.flatten(_.map(_.pairs(prefs), function(pref) {
        return steps[pref[0]].handler.standardize(pref[1]);
      }));
    };

    $scope.runSMAA = function(currentStep) {
      var prefs = $scope.getStandardizedPreferences(currentStep);
      var data = _.extend(currentStep.problem, { "preferences": prefs, "method": "smaa" });
      var run = function(type) {
        var task = patavi.submit(type, data);
        currentStep.progress = 0;
        task.results.then(
          function(results) {
            $scope.$root.$safeApply($scope, function() {
              currentStep.results = results.results;
            });
          }, function(code, error) {
            $scope.$root.$safeApply($scope, function() {
              currentStep.error = { code: (code && code.desc) ? code.desc : code,
                                    cause: error };
            });
          }, function(update) {
            $scope.$root.$safeApply($scope, function() {
              var progress = parseFloat(update);
              if(progress > currentStep.progress) {
                currentStep.progress = progress;
              }
            });
          });
      };

      if (!currentStep.results && $scope.shouldRun(currentStep)) run('smaa');
    }; */

  }];
});
