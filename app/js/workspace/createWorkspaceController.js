'use strict';
define(['angular', 'lodash'], function (angular, _) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'ExampleResource',
    'TutorialResource',
    'WorkspaceResource',
    'WorkspaceService',
    'InProgressResource',
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
    InProgressResource,
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
          const ranges = SchemaService.extractRanges(uploadedContent.criteria);
          const pvfs = SchemaService.extractPvfs(uploadedContent.criteria);
          var updatedProblem = SchemaService.updateProblemToCurrentSchema(
            uploadedContent
          );
          try {
            SchemaService.validateProblem(updatedProblem);
            $scope.updatedProblem = updatedProblem;
            $scope.ranges = ranges;
            $scope.pvfs = pvfs;
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
      WorkspaceResource.create(
        {
          ranges: $scope.ranges,
          pvfs: $scope.pvfs,
          workspace: $scope.updatedProblem
        },
        function (workspace) {
          callback($scope.model.choice, workspace);
          $modalInstance.close();
        }
      );
    }

    function createWorkspaceManually() {
      InProgressResource.create({}, function (response) {
        callback($scope.model.choice, response.id);
        $modalInstance.close();
      });
    }

    function createExampleWorkspace() {
      var example = {
        url: $scope.model.chosenExample.href
      };
      ExampleResource.get(example, function (problem) {
        const ranges = SchemaService.extractRanges(problem.criteria);
        const pvfs = SchemaService.extractPvfs(problem.criteria);
        var updatedProblem = SchemaService.updateProblemToCurrentSchema(
          problem
        );
        SchemaService.validateProblem(updatedProblem);
        WorkspaceResource.create({
          ranges: ranges,
          workspace: updatedProblem,
          pvfs: pvfs
        }).$promise.then(function (workspace) {
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
        const ranges = SchemaService.extractRanges(problem.criteria);
        const pvfs = SchemaService.extractPvfs(problem.criteria);
        var updatedProblem = SchemaService.updateProblemToCurrentSchema(
          problem
        );
        SchemaService.validateProblem(updatedProblem);
        WorkspaceResource.create({
          ranges: ranges,
          workspace: updatedProblem,
          pvfs: pvfs
        }).$promise.then(function (workspace) {
          callback($scope.model.choice, workspace);
          $modalInstance.close();
        });
      });
    }
  };
  return dependencies.concat(CreateWorkspaceController);
});
