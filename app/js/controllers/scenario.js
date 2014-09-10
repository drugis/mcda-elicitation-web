define(['angular', 'underscore', 'mcda/config'], function(angular, _, Config) {
  return function($scope, $location, $state, Tasks, TaskDependencies, currentWorkspace, currentScenario) {
    $scope.workspace = currentWorkspace;
    $scope.scenarios = currentWorkspace.query();
    $scope.scenario = currentScenario;


    $scope.tasks = _.reduce(Tasks.available, function(tasks, task) {
      tasks[task.id] = task;
      return tasks;
    }, {});

    var resultsAccessible = function() {
      var accessible = TaskDependencies.isAccessible($scope.tasks['results'], currentScenario.state);
      return accessible.accessible;
    };

    $scope.resultsAccessible = resultsAccessible();

    $scope.$on("elicit.scenariosChanged", function(e, val) {
      $scope.scenarios = currentWorkspace.query();
      $scope.resultsAccessible = resultsAccessible();
    });

    var redirect = function(scenarioId) {
      $state.go(Config.defaultView, {
        scenarioId: scenarioId
      });
    };

    $scope.forkScenario = function() {
      currentWorkspace
        .newScenario(currentScenario.state)
        .then(redirect);
    };

    $scope.newScenario = function() {
      currentWorkspace
        .newScenario({
          "problem": currentWorkspace.problem
        })
        .then(redirect);
    };

    $scope.isEditTitleVisible = false;
    $scope.scenarioTitle = {};

    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
      $scope.scenarioTitle.value = $scope.scenario.title;
    };

    $scope.saveTitle = function() {
      $scope.scenario.title = $scope.scenarioTitle.value;
      $scope.scenario.save();
      $scope.isEditTitleVisible = false;
    };

    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };

    $scope.scenarioChanged = function(newScenario) {
      $state.go($scope.taskId, {
        scenarioId: newScenario.id
      });
    }
  };
});
