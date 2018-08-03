'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    'mcdaRootPath'
  ];
  var WorkspaceSettingsDirective = function(
    $modal,
    mcdaRootPath
  ) {
    return {
      restrict: 'E',
      scope: {
        callback: '='
      },
      template: '<button class="button right" type="button" ng-click="openSettingsModal()"><i class="fa fa-cog"></i> Settings</button>',
      link: function(scope) {
        // functions
        scope.openSettingsModal = openSettingsModal;
        // init
        function openSettingsModal() {
          $modal.open({
            templateUrl: mcdaRootPath + 'js/workspace/workspaceSettings.html',
            controller: 'WorkspaceSettingsController',
            resolve: {
              callback: function(){
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
