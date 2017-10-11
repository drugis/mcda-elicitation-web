'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'WorkspaceResource', 'workspace', 'callback'];

  var DeleteWorkspaceController = function($scope, $modalInstance, WorkspaceResource, workspace, callback) {
    // functions
    $scope.deleteWorkspace = deleteWorkspace;
    $scope.close = $modalInstance.close;

    // init
    $scope.workspace = workspace;

    function deleteWorkspace() {
      WorkspaceResource.delete({workspaceId:workspace.id});
      callback();
      $scope.close();
    }
  };
  return dependencies.concat(DeleteWorkspaceController);
});