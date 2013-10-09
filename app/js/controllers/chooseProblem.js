define(['angular', 'underscore'], function(angular, _) {
  return function($scope, $location, DecisionProblem, Workspace) {
    $scope.list = [];
    $scope.model = {};
    $scope.local = {};

    $scope.setProblem = function(choice) {
      if (choice === 'local') {
        if (!_.isEmpty($scope.local.contents)) {
          DecisionProblem.populateWithData(angular.fromJson($scope.local.contents));
        }
      } else {
        DecisionProblem.populateWithUrl(choice);
      }
      DecisionProblem.problem.then(function(problem) {
        var workspace = Workspace.create(problem);
        var nextUrl = "/workspaces/" + workspace.id + "/scale-range";
        $location.path(nextUrl);
      });
    };

    $scope.$watch('local.contents', function(newVal) {
      if(!_.isEmpty(newVal)) {
        $scope.model.choice = 'local';
      }
    });

    DecisionProblem.list.then(function(data) {
      $scope.list = data;
    });

    $scope.$apply();
  };
});
