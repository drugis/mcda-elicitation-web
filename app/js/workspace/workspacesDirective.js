'use strict';
define(['lodash'], function (_) {
  var dependencies = ['$modal', '$state', 'InProgressResource'];
  var WorkspacesDirective = function ($modal, $state, InProgressResource) {
    return {
      restrict: 'E',
      scope: {
        workspacesList: '='
      },
      templateUrl: './workspacesDirective.html',
      link: function (scope) {
        scope.deleteWorkspace = deleteWorkspace;
        scope.copyWorkspace = copyWorkspace;

        function deleteWorkspace(workspace) {
          $modal.open({
            templateUrl: './deleteWorkspace.html',
            controller: 'DeleteWorkspaceController',
            resolve: {
              callback: function () {
                return function () {
                  scope.workspacesList = _.reject(scope.workspacesList, [
                    'id',
                    workspace.id
                  ]);
                };
              },
              workspace: function () {
                return workspace;
              }
            }
          });
        }

        function copyWorkspace(workspace) {
          InProgressResource.createCopy(
            {sourceWorkspaceId: workspace.id},
            function (response) {
              $state.go('manualInput', {
                inProgressId: response.id
              });
            }
          );
        }
      }
    };
  };
  return dependencies.concat(WorkspacesDirective);
});
