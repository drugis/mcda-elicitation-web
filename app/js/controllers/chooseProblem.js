'use strict';
define(function(require) {
  var angular = require("angular");
  var _ = require("underscore");

  return function($scope, $state, $resource, WorkspaceResource) {
    var examplesResource = $resource('examples/:url', {
      url: '@url'
    });

    $scope.examplesList = examplesResource.query();
    $scope.model = {};
    $scope.local = {};

    $scope.createWorkspace = function(choice) {
      if (choice === 'local' && !_.isEmpty($scope.local.contents)) {
        WorkspaceResource.create(angular.fromJson($scope.local.contents)).$promise.then(function(workspace) {
          $state.go('overview', {
            workspaceId: workspace.id,
            id: workspace.defaultScenarioId
          });
        });
      } else {
        var example = {
          url: choice
        };
        examplesResource.get(example, function(problem) {
          WorkspaceResource.create(problem).$promise.then(function(workspace) {
            $state.go('overview', {
              workspaceId: workspace.id,
              id: workspace.defaultScenarioId
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
});
