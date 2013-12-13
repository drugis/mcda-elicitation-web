'use strict';
define(['angular', 'underscore', 'config'], function(angular,  _, Config) {

  return function($scope, Tasks, TaskDependencies, currentWorkspace, currentScenario) {
    $scope.workspace = currentWorkspace;
    $scope.scenario = currentScenario;
    $scope.createPath = _.partial(Config.createPath, currentWorkspace.id);

    $scope.scenarios = currentWorkspace.query();

    var resultsAccessible = function() {
      var resultsTask = _.find(Tasks.available, function(task) { return task.id === "results"; });
      var accessible = TaskDependencies.isAccessible(resultsTask, currentScenario.state);
      return accessible.accessible;
    };

    $scope.resultsAccessible = resultsAccessible();

    $scope.$on("elicit.scenariosChanged", function(e, val) {
      $scope.scenarios = currentWorkspace.query();
      $scope.resultsAccessible = resultsAccessible();
    });
    
    function redirect(scenarioId) { currentWorkspace.redirectToDefaultView(scenarioId); };

    $scope.forkScenario = function() {
      currentWorkspace
        .newScenario(currentScenario.state)
        .then(redirect);
    };

    $scope.newScenario = function() {
      currentWorkspace
        .newScenario({ "problem" : currentWorkspace.problem })
        .then(redirect);
    };
  };
});
