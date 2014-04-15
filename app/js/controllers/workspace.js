'use strict';
define(['angular', 'underscore', 'mcda/config'], function(angular,  _, Config) {

  return function($scope, $location, Tasks, TaskDependencies, currentWorkspace, currentScenario) {
    $scope.workspace = currentWorkspace;
    $scope.scenario = currentScenario;
    $scope.createPath = _.partial(Config.createPath, $location.path(), currentWorkspace.id);

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
    
    $scope.isEditTitleVisible = false;
    
    $scope.editTitle = function() {
      $scope.isEditTitleVisible = true;
      $scope.workspaceTitle = $scope.workspace.title;
    };
    
    $scope.saveTitle = function() {
      $scope.workspace.title = $scope.workspaceTitle;
      $scope.workspace.$save();
      $scope.isEditTitleVisible = false;
    };
    
    $scope.cancelTitle = function() {
      $scope.isEditTitleVisible = false;
    };
  };
});
