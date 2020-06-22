'use strict';
define(['angular', 'lodash'], function (angular, _) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'ExampleResource',
    'TutorialResource',
    'WorkspaceResource',
    'WorkspaceService',
    'InProgressResource2',
    'SchemaService',
    'callback'
  ];

  var CreateWorkspaceController = function (
    $scope,
    $modalInstance,
    ExampleResource,
    TutorialResource,
    WorkspaceResource,
    WorkspaceService,
    InProgressResource2,
    SchemaService,
    callback
  ) {
    // functions
    $scope.createWorkspace = createWorkspace;
    $scope.close = $modalInstance.close;

    // init
    $scope.isCreating = false;
    $scope.model = {
      choice: 'example'
    };
    $scope.local = {};
    ExampleResource.query().$promise.then(function (examples) {
      $scope.examplesList = examples;
      $scope.model.chosenExample = $scope.examplesList[0];
    });

    TutorialResource.query().$promise.then(function (tutorials) {
      $scope.tutorials = tutorials;
      $scope.model.chosenTutorial = $scope.tutorials[0];
    });

    $scope.$watch(
      'local.contents',
      function (newValue, oldValue) {
        if (oldValue === newValue || !newValue) {
          return;
        }
        var uploadedContent = angular.fromJson($scope.local.contents);
        $scope.workspaceValidity = WorkspaceService.validateWorkspace(
          uploadedContent
        );
        if ($scope.workspaceValidity.isValid) {
          var updatedProblem = SchemaService.updateProblemToCurrentSchema(
            uploadedContent
          );
          try {
            SchemaService.validateProblem(updatedProblem);
            $scope.updatedProblem = updatedProblem;
          } catch (errors) {
            $scope.workspaceValidity.isValid = false;
            $scope.workspaceValidity.errorMessage = _.reduce(
              errors,
              function (accum, error) {
                return accum.concat(error.message, ';');
              },
              ''
            );
          }
        }
      },
      true
    );

    function createWorkspace() {
      $scope.isCreating = true;
      if ($scope.model.choice === 'local') {
        createWorkspaceFromFile();
      } else if ($scope.model.choice === 'manual') {
        createWorkspaceManually();
      } else if ($scope.model.choice === 'tutorial') {
        createTutorialWorkspace();
      } else {
        createExampleWorkspace();
      }
    }

    function createWorkspaceFromFile() {
      WorkspaceResource.save($scope.updatedProblem, function (workspace) {
        callback($scope.model.choice, workspace);
        $modalInstance.close();
      });
    }

    function createWorkspaceManually() {
      InProgressResource2.save({}, function (response) {
        callback($scope.model.choice, response);
        $modalInstance.close();
      });
    }

    function createExampleWorkspace() {
      var example = {
        url: $scope.model.chosenExample.href
      };
      ExampleResource.get(example, function (problem) {
        var updatedProblem = SchemaService.updateProblemToCurrentSchema(
          problem
        );
        SchemaService.validateProblem(updatedProblem);
        WorkspaceResource.create(updatedProblem).$promise.then(function (
          workspace
        ) {
          callback($scope.model.choice, workspace);
          $modalInstance.close();
        });
      });
    }

    function createTutorialWorkspace() {
      var tutorial = {
        url: $scope.model.chosenTutorial.href
      };
      TutorialResource.get(tutorial, function (problem) {
        var updatedProblem = SchemaService.updateProblemToCurrentSchema(
          problem
        );
        SchemaService.validateProblem(updatedProblem);
        WorkspaceResource.create(updatedProblem).$promise.then(function (
          workspace
        ) {
          callback($scope.model.choice, workspace);
          $modalInstance.close();
        });
      });
    }
  };
  return dependencies.concat(CreateWorkspaceController);
});
