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
      $location.path("/scale-range");
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

    DecisionProblem.problem.then(Workspace.create);

  };
});
