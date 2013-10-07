define(['angular','lib/patavi'], function(angular, patavi) {
  return angular.module('elicit.controller', []).controller('ElicitationController', ['$scope', 'DecisionProblem', 'PreferenceStore', function($scope, DecisionProblem, PreferenceStore) {
    $scope.saveState = {};
    $scope.currentStep = {};
    $scope.initialized = false;

    var steps;
    var PERSISTENT_FIELDS = ["problem", "type", "prefs", "choice"];

    var initialize = function(problem) {
      if(!_.isEmpty(problem)) {
        $scope.initialized = true;
      }
    };

    var previousSteps = [];
    var nextSteps = [];

    $scope.canProceed = function(currentStep) {
      var handler = currentStep.type && steps[currentStep.type].handler;
      return (handler && handler.validChoice(currentStep)) || false;
    };

    $scope.canReturn = function() {
      return previousSteps.length > 0;
    };

    $scope.nextStep = function() {
      var currentStep = $scope.currentStep;
      if(!$scope.canProceed(currentStep)) return false;
      var choice = currentStep.choice;
      var handler = steps[currentStep.type].handler;

      // History handling
      previousSteps.push(currentStep);
      var nextStep = nextSteps.pop();
      if(nextStep && _.isEqual(nextStep.previousChoice, choice)) {
        $scope.templateUrl = steps[nextStep.type].templateUrl;
        $scope.currentStep = nextStep;
        return true;
      } else {
        nextSteps = [];
      }

      currentStep = _.pick(currentStep, PERSISTENT_FIELDS.concat(handler.fields));
      nextStep = handler.nextState(currentStep);

      if (nextStep.type !== currentStep.type) {
        var step = steps[nextStep.type];
        var handler = step.handler;
        $scope.templateUrl = step.templateUrl;
        nextStep = handler ? handler.initialize(nextStep) : nextStep;
      }
      nextStep.previousChoice = choice;

      $scope.currentStep = nextStep;

      return true;
    }

    $scope.previousStep = function() {
      if (previousSteps.length == 0) return false;
      nextSteps.push(angular.copy($scope.currentStep));

      var previousStep = previousSteps.pop();
      $scope.templateUrl = steps[previousStep.type].templateUrl;
      $scope.currentStep = previousStep;
      return true;
    }

    $scope.getStandardizedPreferences = function(currentStep) {
      var prefs = currentStep.prefs;
      return _.flatten(_.map(_.pairs(prefs), function(pref) {
        return steps[pref[0]].handler.standardize(pref[1]);
      }));
    };

    $scope.shouldRun = function(currentStep) {
      var excluded = ["scale range", "partial value function"];
      return !_.contains(excluded, currentStep.type);
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
    };

    DecisionProblem.problem.then(initialize);
  }]);
});
