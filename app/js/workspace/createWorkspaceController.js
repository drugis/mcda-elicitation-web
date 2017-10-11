'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance',
    'ExampleResource', 'WorkspaceResource', 'callback'
  ];

  var CreateWorkspaceController = function($scope, $modalInstance,
    ExampleResource, WorkspaceResource, callback) {
    // functions
    $scope.createWorkspace = createWorkspace;
    $scope.close = $modalInstance.close;

    // init
    $scope.isCreating = false;
    $scope.model = {};
    $scope.local = {};
    $scope.examplesList = ExampleResource.query();

    function createWorkspace(choice) {
      $scope.isCreating = true;
      if (choice === 'local' && !_.isEmpty($scope.local.contents)) {
        WorkspaceResource.create(angular.fromJson($scope.local.contents)).$promise.then(function(workspace) {
          callback(choice, workspace);
          $modalInstance.close();
        });
      } else if (choice === 'manual') {
        callback(choice);
        $modalInstance.close();
      } else {
        var example = {
          url: choice
        };
        ExampleResource.get(example, function(problem) {
          WorkspaceResource.create(problem).$promise.then(function(workspace) {
            callback(choice, workspace);
            $modalInstance.close();
          });
        });
      }
    }

  };
  return dependencies.concat(CreateWorkspaceController);
});