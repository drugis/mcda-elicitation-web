function ExampleController($scope, DecisionProblem) {
  $scope.done = false;
  $scope.list = [];
  $scope.model = {};

  $scope.setProblem = function(choice) {
    DecisionProblem.url = choice;
    $scope.done = true;
  }

  DecisionProblem.list(function (data) { $scope.list = data });
}
