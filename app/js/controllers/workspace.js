define(['angular', 'underscore', 'config'], function(angular,  _, Config) {
  return function($scope, Tasks, currentWorkspace, currentScenario) {
    $scope.tasks = Tasks.available;
    $scope.workspace = currentWorkspace;
    $scope.scenario = currentScenario;
    $scope.createPath = _.partial(Config.createPath, currentWorkspace.id);

    $scope.scenarios = currentWorkspace.query();
    $scope.$on("elicit.scenariosChanged", function(e, val) {
      $scope.scenarios = currentWorkspace.query();
    });

    $scope.forkScenario = function() {
      var scenarioId = currentWorkspace.newScenario(currentScenario.state);
      currentWorkspace.redirectToDefaultView(scenarioId);
    };

    $scope.newScenario = function() {
      var scenarioId = currentWorkspace.newScenario({ "problem" : currentWorkspace.problem });
      currentWorkspace.redirectToDefaultView(scenarioId);
    };
  };
});
