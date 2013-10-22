define(['angular', 'underscore'], function(angular, _) {
  var dependencies = ['$scope', 'DecisionProblem', 'Workspaces'];
  var ChooseProblemController = function($scope, DecisionProblem, Workspaces) {
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
        var workspace = Workspaces.create(problem);
        workspace.redirectToDefaultView();
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

  return dependencies.concat(ChooseProblemController);

});
