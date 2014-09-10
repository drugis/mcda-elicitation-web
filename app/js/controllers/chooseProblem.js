'use strict';
define(['angular', 'underscore'], function(angular, _) {
  var dependencies = ['$scope', '$resource', config.workspacesRepository.type + 'Workspaces'];
  var ChooseProblemController = function($scope, $resource, Workspaces) {
    var examplesRepositoryUrl = config ? config.examplesRepository : '';
    var examplesResource = $resource(examplesRepositoryUrl + ':url', {url:'@url'});

    $scope.examplesList = examplesResource.query();
    
    $scope.list = [];
    $scope.model = {};
    $scope.local = {};

    $scope.createWorkspace = function(choice) {
      function createWorkspace(problem) {
        Workspaces
          .create(problem)
          .then(function(workspace) { workspace.redirectToDefaultView(); });
      }
      
      if (choice === 'local') {
        if (!_.isEmpty($scope.local.contents)) {
          createWorkspace(angular.fromJson($scope.local.contents));
        }
      } else {
        examplesResource.get({url: choice}, function(problem) {
          createWorkspace(problem);
        });
      }
    };

    $scope.$watch('local.contents', function(newVal) {
      if(!_.isEmpty(newVal)) {
        $scope.model.choice = 'local';
      }
    });

    $scope.workspacesList = Workspaces.query();
    
    $scope.chooseProblemModal = {};
  };

  return dependencies.concat(ChooseProblemController);

});
