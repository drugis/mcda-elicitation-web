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
      } else {
        // TODO: Include user data here, or from request?
        var example = {
            url: choice
        }
          WorkspaceResource.save(example);
        };
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
