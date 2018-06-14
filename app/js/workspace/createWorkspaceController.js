'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = ['$scope', '$modalInstance',
    'ExampleResource',
    'WorkspaceResource',
    'WorkspaceService',
    'SchemaService',
    'callback'
  ];

  var CreateWorkspaceController = function($scope, $modalInstance,
    ExampleResource,
    WorkspaceResource,
    WorkspaceService,
    SchemaService,
    callback
  ) {
    // functions
    $scope.createWorkspace = createWorkspace;
    $scope.close = $modalInstance.close;

    // init
    $scope.isCreating = false;
    $scope.model = {};
    $scope.local = {};
    $scope.examplesList = ExampleResource.query();
    $scope.$watch('local.contents', function(newValue, oldValue) {
      if (oldValue === newValue || !newValue) {
        return;
      }
      $scope.uploadedContent = angular.fromJson($scope.local.contents);
      $scope.workspaceValidity = WorkspaceService.validateWorkspace($scope.uploadedContent);
    }, true);

    function createWorkspace(choice) {
      $scope.isCreating = true;
      if (choice === 'local') {
        WorkspaceResource.create(SchemaService.updateProblemToCurrentSchema($scope.uploadedContent)).$promise.then(function(workspace) {
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
          var updatedProblem = SchemaService.updateProblemToCurrentSchema(problem);
          WorkspaceResource.create(updatedProblem).$promise.then(function(workspace) {
            callback(choice, workspace);
            $modalInstance.close();
          });
        });
      }
    }

  };
  return dependencies.concat(CreateWorkspaceController);
});
