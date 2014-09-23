'use strict';
define(['angular', 'underscore'], function(angular, _) {
  var dependencies = ['$scope', '$state', '$resource', 'WorkspaceResource', 'WorkspaceService'];
  var ChooseProblemController = function($scope, $state, $resource, WorkspaceResource, WorkspaceService) {
    var examplesResource = $resource('examples/:url', {
      url: '@url'
    });

    $scope.examplesList = examplesResource.query();
    $scope.model = {};
    $scope.local = {};

    $scope.createWorkspace = function(choice) {
      if (choice === 'local' && !_.isEmpty($scope.local.contents)) {
        WorkspaceService.createWorkspace(angular.fromJson($scope.local.contents)).$promise.then(function(workspace) {
          $state.go('overview', {
            workspaceId: workspace.id,
            scenarioId: workspace.defaultScenarioId
          });
        });
      } else {
        var example = {
          url: choice
        };
        examplesResource.get(example, function(problem) {
          WorkspaceService.createWorkspace(problem).$promise.then(function(workspace) {
            $state.go('overview', {
              workspaceId: workspace.id,
              scenarioId: workspace.defaultScenarioId
            });
          });
        });
      }
    };

    $scope.$watch('local.contents', function(newVal) {
      if (!_.isEmpty(newVal)) {
        $scope.model.choice = 'local';
      }
    });

    $scope.workspacesList = WorkspaceResource.query();

    $scope.chooseProblemModal = {};
  };

  return dependencies.concat(ChooseProblemController);

});
