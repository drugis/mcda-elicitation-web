function ElicitationController($rootScope, $scope, DecisionProblem, PreferenceStore) {
  $scope.saveState = {};
  $scope.currentStep = {};
  $scope.initialized = false;
  var handlers;
  var LAST_STEP = 'done';
  var PERSISTENT_FIELDS = ["problem", "type", "prefs", "choice"];

  $scope.$on('PreferenceStore.saved', function() {
    $scope.saveState = { success: true };
  });
  $scope.$on('PreferenceStore.error', function() {
    $scope.saveState = { error: PreferenceStore.lastError };
  });

  var initialize = function(problem) {
    if(!_.isEmpty(problem)) {
      handlers = {
        "scale range": new ScaleRangeHandler($scope),
        "partial value function": new PartialValueFunctionHandler($scope),
        "ordinal":  new OrdinalElicitationHandler(),
        "ratio bound":  new RatioBoundElicitationHandler(),
        "exact swing":  new ExactSwingElicitationHandler(),
        "choose method": new ChooseMethodHandler(),
        "done": new ResultsHandler()
      };
    $scope.currentStep = handlers["scale range"].initialize({ problem: problem });
    $scope.initialized = true;
    }
  };

  var previousSteps = [];
  var nextSteps = [];

  $scope.canProceed = function(currentStep) {
    var handler = currentStep.type && handlers[currentStep.type];
    return (handler && handlers[currentStep.type].validChoice(currentStep)) || false;
  }

  $scope.canReturn = function() {
    return previousSteps.length > 0;
  }

  $scope.nextStep = function() {
    var currentStep = $scope.currentStep;
    if(!$scope.canProceed(currentStep)) return false;
    var choice = currentStep.choice;
    var handler = handlers[currentStep.type];

    // History handling
    previousSteps.push(currentStep);
    var nextStep = nextSteps.pop();
    if(nextStep && _.isEqual(nextStep.previousChoice, choice)) {
      $scope.currentStep = nextStep;
      return true;
    } else {
      nextSteps = [];
    }

    var previousResults = angular.copy(currentStep.results);

    currentStep = _.pick(currentStep, PERSISTENT_FIELDS.concat(handler.fields));
    nextStep = handler.nextState(currentStep);

    if (nextStep.type !== currentStep.type) {
      var handler = handlers[nextStep.type];
      if(nextStep.type === LAST_STEP) {
        nextStep.results = previousResults;
      }
      nextStep = handler ? handler.initialize(nextStep) : nextStep;
    }
    nextStep.previousChoice = choice;

    $scope.currentStep = nextStep;

    if (nextStep.type === LAST_STEP && PreferenceStore) {
      PreferenceStore.save($scope.getStandardizedPreferences(nextStep));
    }

    return true;
  }

  $scope.previousStep = function() {
    if (previousSteps.length == 0) return false;
    nextSteps.push(angular.copy($scope.currentStep));
    $scope.currentStep = previousSteps.pop();
    return true;
  }

  $scope.getStandardizedPreferences = function(currentStep) {
    var prefs = currentStep.prefs;
    return _.flatten(_.map(_.pairs(prefs), function(pref) {
      return handlers[pref[0]].standardize(pref[1]);
    }));
  };

  $scope.shouldRun = function(currentStep) {
    var excluded = ["scale range", "partial value function", LAST_STEP];
    return !_.contains(excluded, currentStep.type);
  }

  $scope.runSMAA = function(currentStep) {
    var prefs = $scope.getStandardizedPreferences(currentStep);
    var data = _.extend(currentStep.problem, { "preferences": prefs, "method": "smaa" });

    var run = function(type) {
      var task = patavi.submit(type, data);
      task.results.then(
        function(results) {
          $scope.$root.$safeApply($scope, function() {
            currentStep.results = results.results;
          })
        }, function(code, error) {
          $scope.$root.$safeApply($scope, function() {
            currentStep.error = { code: (code && code.desc) ? code.desc : code,
                                  cause: error };
          });
        }, function(update) {
          $scope.$root.$safeApply($scope, function() {
            currentStep.progress = update;
          });
        });
    }

    if (!currentStep.results && $scope.shouldRun(currentStep)) run('smaa');
  };

  DecisionProblem.problem.then(initialize);
};

ElicitationController.$inject = ['$rootScope', '$scope', 'DecisionProblem', 'PreferenceStore'];
