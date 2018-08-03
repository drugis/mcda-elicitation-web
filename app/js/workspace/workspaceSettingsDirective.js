'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$modal',
    'WorkspaceSettingsService',
    'mcdaRootPath'
  ];
  var WorkspaceSettingsDirective = function(
    $modal,
    WorkspaceSettingsService,
    mcdaRootPath
  ) {
    return {
      restrict: 'E',
      scope: {
        'toggledColumns': '=',
        'workspaceSettings': '='
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
              callback: function() {
                return function(workspaceSettings, toggledColumns) {
                  WorkspaceSettingsService.saveSettings(workspaceSettings, toggledColumns).then(function(){
                    scope.workspaceSettings = WorkspaceSettingsService.getWorkspaceSettings();
                    scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
                  });
                };
              },
              settings: function() {
                return _.cloneDeep(scope.workspaceSettings);
              },
              toggledColumns: function() {
                return _.cloneDeep(scope.toggledColumns);
              }
            }
          });

        }
      }
    };
  };
  return dependencies.concat(WorkspaceSettingsDirective);
});
