define(['angular', 'elicit'], function(angular, elicit) {
return elicit.controller('ExampleController', ['$scope', 'DecisionProblem', function($scope, DecisionProblem) {
  $scope.done = false;
  $scope.list = [];
  $scope.model = {};
  $scope.local = {};

  $scope.setProblem = function() {
    if ($scope.model.choice === 'local') {
      if (!_.isEmpty($scope.local.contents)) {
        DecisionProblem.populateWithData(angular.fromJson($scope.local.contents));
      }
    } else {
      DecisionProblem.populateWithUrl($scope.model.choice);
    }
    $scope.done = true;
  }

  $scope.$watch('local.contents', function(newVal) {
    if(!_.isEmpty(newVal)) {
      $scope.model.choice = 'local';
    };
  });

  DecisionProblem.list(function (data) { $scope.list = data });
}]);
console.log("Done with elicit.example");
});
