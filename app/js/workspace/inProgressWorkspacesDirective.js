'use strict';
define(['lodash'], function (_) {
  var dependencies = ['$modal'];
  var InProgressWorkspacesDirective = function ($modal) {
    return {
      restrict: 'E',
      scope: {
        inProgressWorkspaces: '='
      },
      templateUrl: './inProgressWorkspacesDirective.html',
      link: function (scope) {
        scope.deleteInProgress = deleteInProgress;
        scope.getTitle = getTitle;

        function deleteInProgress(id, title) {
          $modal.open({
            templateUrl: './deleteWorkspace.html',
            controller: 'DeleteInProgressController',
            resolve: {
              callback: function () {
                return function () {
                  scope.inProgressWorkspaces = _.reject(
                    scope.inProgressWorkspaces,
                    ['id', id]
                  );
                };
              },
              inProgressId: function () {
                return id;
              },
              title: function () {
                return title;
              }
            }
          });
        }

        function getTitle(inProgressWorkspace) {
          if (inProgressWorkspace.state.title) {
            return inProgressWorkspace.state.title;
          } else if (inProgressWorkspace.title) {
            return inProgressWorkspace.title;
          } else {
            return 'Empty title';
          }
        }
      }
    };
  };
  return dependencies.concat(InProgressWorkspacesDirective);
});
