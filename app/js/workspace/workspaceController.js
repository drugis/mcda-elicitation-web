'use strict';
define(['angular'], function(angular) {
  var dependencies = [
    '$scope',
    '$cookies',
    '$stateParams',
    '$modal',
    'WorkspaceResource',
    'SchemaService',
    'currentWorkspace',
    'currentSchemaVersion',
    'mcdaRootPath'
  ];
  var WorkspaceController = function(
    $scope,
    $cookies,
    $stateParams,
    $modal,
    WorkspaceResource,
    SchemaService,
    currentWorkspace,
    currentSchemaVersion,
    mcdaRootPath
  ) {
    // functions
    $scope.editTitle = editTitle;
    $scope.saveTitle = saveTitle;
    $scope.cancelTitle = cancelTitle;
    $scope.openSettingsModal = openSettingsModal;

    // init
    var user = angular.fromJson($cookies.get('LOGGED-IN-USER'));
    $scope.editMode = {
      isUserOwner: user ? currentWorkspace.owner === user.id : false
    };
    if(currentWorkspace.problem.schemaVersion !== currentSchemaVersion){
      $scope.workspace = SchemaService.updateWorkspaceToCurrentSchema(currentWorkspace);
      WorkspaceResource.save($stateParams, $scope.workspace);
    } else { 
      $scope.workspace = currentWorkspace;
    }
    
    $scope.isEditTitleVisible = false;

    function editTitle() {
      $scope.isEditTitleVisible = true;
      $scope.workspace.title = $scope.workspace.problem.title;
    }

    function saveTitle() {
      $scope.workspace.problem.title = $scope.workspace.title;
      WorkspaceResource.save($stateParams, $scope.workspace);
      $scope.isEditTitleVisible = false;
    }

    function cancelTitle() {
      $scope.isEditTitleVisible = false;
    }

    function openSettingsModal(){
      $modal.open({
        templateUrl: mcdaRootPath + 'js/workspace/workspaceSettings.html', 
        controller: 'WorkspaceSettingsController',
        resolve:{

        }
      });
      
    }
  };
  return dependencies.concat(WorkspaceController);
});
