/*global window,define */
'use strict';
define(['angular', 'underscore'], function(angular, _) {
  var dependencies = ['$scope', '$resource', 'WorkspaceResource', 'WorkspaceService'];
  var ChooseProblemController = function($scope, $resource, WorkspaceResource, WorkspaceService) {
    var examplesResource = $resource('examples/:url', {
      url: '@url'
    });

    $scope.examplesList = examplesResource.query();

    // $scope.model = {};
    // $scope.local = {};

    $scope.createWorkspace = function(choice) {
      if (choice === 'local' && !_.isEmpty($scope.local.contents)) {
        WorkspaceService.createWorkspace(angular.fromJson($scope.local.contents));
      } else {
        var example = {
          url: choice
        };
        examplesResource.get(example, function(problem) {
          WorkspaceService.createWorkspace(problem);
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