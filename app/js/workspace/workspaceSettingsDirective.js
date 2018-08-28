'use strict';
define([], function() {
  var dependencies = [
    '$modal'
  ];
  var WorkspaceSettingsDirective = function(
    $modal
  ) {
    return {
      restrict: 'E',
      scope: {
        callback: '=',
        editMode: '='
      },
      template: '<button class="button right" type="button" ng-if="editMode.isUserOwner" ng-click="openSettingsModal()"><i class="fa fa-cog"></i> Settings</button>',
      link: function(scope) {
        // functions
        scope.openSettingsModal = openSettingsModal;
        // init
        function openSettingsModal() {
          $modal.open({
            templateUrl: './workspaceSettings.html',
            controller: 'WorkspaceSettingsController',
            resolve: {
              callback: function() {
                return scope.callback;
              }
            }
          });
        }
      }
    };
  };
  return dependencies.concat(WorkspaceSettingsDirective);
});
