function ElicitationController($scope, DecisionProblem, Jobs, PreferenceStore) {
  $scope.problemSource = DecisionProblem;
  $scope.saveState = {};
  $scope.problem = {};
  $scope.currentStep = {};
  $scope.initialized = false;
  var handlers;

  $scope.$on('PreferenceStore.saved', function() {
    $scope.saveState = { success: true };
  });
  $scope.$on('PreferenceStore.error', function() {
    $scope.saveState = { error: PreferenceStore.lastError };
  });

  function extendProblem(problem) {
    angular.forEach(problem.criteria, function(criterion) {
      function create(idx1, idx2) {
        return function() {
          var pvf = criterion.pvf;
          return pvf.type === "linear-increasing" ? pvf.range[idx1] : pvf.range[idx2];
        }
      }
      criterion.worst = create(0, 1);
      criterion.best = create(1, 0);
      criterion.pvf.map = function(x) {
        var range = Math.abs(criterion.best() - criterion.worst());
        return criterion.pvf.type === "linear-increasing" ? ((x - criterion.worst()) / range) : ((criterion.worst() - x) / range);
      };
      criterion.pvf.inv = function(x) {
        var range = Math.abs(criterion.best() - criterion.worst());
        return criterion.pvf.type === "linear-increasing" ? ((x * range) + criterion.worst()) : (-(x * range) + criterion.worst());
      };
    });
  }

  var initialize = function(newVal) {
    if(!_.isEmpty(newVal)) {
      extendProblem($scope.problem);
      handlers = {
        "ordinal":  new OrdinalElicitationHandler(newVal),
        "ratio bound":  new RatioBoundElicitationHandler(newVal),
        "choose method": new ChooseMethodHandler(),
        "done": {initialize: function(state) { return _.extend(state, {title: "Done eliciting preferences"}); }  }
      };
      $scope.currentStep = handlers.ordinal.initialize();
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

  $scope.nextStep = function() {
    var currentStep = $scope.currentStep;
    var choice = currentStep.choice;
    var handler = handlers[currentStep.type];
    if(!handler.validChoice(currentStep)) {
      return false;
    }

    // History handling
    previousSteps.push(currentStep);
    var nextStep = nextSteps.pop();
    if(nextStep && _.isEqual(nextStep.previousChoice, choice)) {
      $scope.currentStep = nextStep;
      return true;
    } else {
      nextSteps = [];
    }

    currentStep = _.pick(currentStep, Array.concat(["type", "prefs", "choice"], handler.fields));
    nextStep = handler.nextState(currentStep);
    if (nextStep.type !== currentStep.type) {
      var handler = handlers[nextStep.type];
      nextStep = handler ? handler.initialize(nextStep) : nextStep;
    }
    nextStep.previousChoice = choice;

    $scope.currentStep = nextStep;

    if (nextStep.type === 'done' && PreferenceStore) {
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

  var waiting = [];
  var jobId = 0;

  $scope.runSMAA = function(currentStep) {
    if(!config.smaaWS) return;

    function workAround(arr) { return _.object(_.range(arr.length), arr); }

    var prefs = $scope.getStandardizedPreferences(currentStep);
    var data = _.extend(angular.copy($scope.problem), { "preferences": workAround(prefs) });
    data.performanceTable = workAround(data.performanceTable);

    var run = function(type) {
      var id = ++jobId;
      waiting[id] = currentStep;
      $.ajax({
        url: config.smaaWS + type,
        type: 'POST',
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json',
        success: function(responseJSON, textStatus, jqXHR) {
          var job = Jobs.add({
            data: responseJSON,
            type: 'run' + type,
            analysis: id,
            broadcast: 'completedAnalysis'
          });
          $scope.job = job;
        }
      });
    };
    if (!currentStep.results && !_.contains(waiting, currentStep)) run('smaa');
  };

  $scope.$on('completedAnalysis', function(e, job) {
    var step = waiting[job.analysis];
    if (!step) return;
    if (job.data.status === "completed") {
      var results = job.results.results.smaa;
      step.results = _.object(_.map(results, function(x) { return x.name; }), results);
    } else {
      step.error = job.data;
    }
    delete waiting[job.analysis];
  });

  $scope.$watch('problemSource.url', getProblem);
  getProblem();
};
