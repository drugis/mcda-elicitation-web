define(['angular', 'underscore', 'mcda/config'], function(angular, _, Config) {
  return function($scope, $location, $state, Tasks, TaskDependencies, currentWorkspace, currentScenario) {
    $scope.scenario = currentScenario;
    $scope.scenarios = currentWorkspace.query();

    var resultsAccessible = function() {
      var resultsTask = _.find(Tasks.available, function(task) {
        return task.id === "results";
      });
      var accessible = TaskDependencies.isAccessible(resultsTask, currentScenario.state);
      return accessible.accessible;
    };

    $scope.resultsAccessible = resultsAccessible();

    $scope.$on("elicit.scenariosChanged", function(e, val) {
      $scope.scenarios = currentWorkspace.query();
      $scope.resultsAccessible = resultsAccessible();
    });

    var redirect = function(scenarioId) {
      $state.go(Config.defaultView, {scenarioId: scenarioId});
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
  };
});
