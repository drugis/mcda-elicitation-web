define(['angular', 'underscore'], function(angular,  _) {
  return function($scope, $stateParams, $location, Tasks, currentWorkspace, currentScenario) {
    $scope.tasks = Tasks.available;
    $scope.workspace = currentWorkspace;
    $scope.scenario = currentScenario;

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
