'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    '$state'
  ];
  var WorkspacesDirective = function(
    $modal,
    $state
  ) {
    return {
      restrict: 'E',
      scope: {
        'workspacesList': '='
      },
      templateUrl: './workspacesDirective.html',
      link: function(scope) {
        scope.deleteWorkspace = deleteWorkspace;
        scope.copyWorkspace = copyWorkspace;

        function deleteWorkspace(workspace) {
          $modal.open({
            templateUrl: './deleteWorkspace.html',
            controller: 'DeleteWorkspaceController',
            resolve: {
              callback: function() {
                return function() {
                  scope.workspacesList = _.reject(scope.workspacesList, ['id', workspace.id]);
                };
              },
              workspace: function() {
                return workspace;
              }
            }
          });
        }
    
        function copyWorkspace(workspace) {
          $state.go('manualInput', {
            workspace: workspace
          });
        }
      }
    };
  };
  return dependencies.concat(WorkspacesDirective);
});
