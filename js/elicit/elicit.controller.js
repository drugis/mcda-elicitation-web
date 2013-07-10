function ElicitationController($scope, DecisionProblem, PreferenceStore, Tasks) {
  $scope.problemSource = DecisionProblem;
  $scope.saveState = {};
  $scope.problem = {};
  $scope.currentStep = {};
  $scope.initialized = false;
  var handlers;
  var LAST_STEP = 'done';

  $scope.$on('PreferenceStore.saved', function() {
    $scope.saveState = { success: true };
  });
  $scope.$on('PreferenceStore.error', function() {
    $scope.saveState = { error: PreferenceStore.lastError };
  });

  var initialize = function(problem) {
    if(!_.isEmpty(problem)) {
      handlers = {
        "scale range": new ScaleRangeHandler(problem, Tasks),
        "partial value function": new PartialValueFunctionHandler(problem),
        "ordinal":  new OrdinalElicitationHandler(problem),
        "ratio bound":  new RatioBoundElicitationHandler(problem),
        "choose method": new ChooseMethodHandler(),
        "done": new ResultsHandler(problem)
      };
      $scope.currentStep = handlers["scale range"].initialize();
      $scope.runSMAA($scope.currentStep);
      $scope.initialized = true;
    }
  };

  var getProblem = function() {
    $scope.problemSource.get( function(data) {
      $scope.problem = data;
      initialize(data);
    });
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

    currentStep = _.pick(currentStep, ["type", "prefs", "choice"].concat(handler.fields));
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
    return !_.contains(["scale range", LAST_STEP], currentStep.type);
  }

  $scope.runSMAA = function(currentStep) {
    if(!window.clinicico) return;

    var prefs = $scope.getStandardizedPreferences(currentStep);
    var data = _.extend(angular.copy($scope.problem), { "preferences": prefs, "method": "smaa" });

    var run = function(type) {
      var task = Tasks.submit(type, data);

      task.results.then(
        function(results) {
        currentStep.results = results.body;
      }, function(reason) {
        currentStep.error = reason;
      });
    }

    if (!currentStep.results && $scope.shouldRun(currentStep)) run('smaa');
  };

  $scope.$watch('problemSource.url', getProblem);
  getProblem();
};

ElicitationController.$inject = ['$scope', 'DecisionProblem', 'PreferenceStore', 'clinicico.tasks'];
