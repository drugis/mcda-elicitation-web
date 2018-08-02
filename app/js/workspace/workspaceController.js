'use strict';
define(['angular', 'lodash'], function(angular, _) {
  var dependencies = [
    '$scope',
    '$cookies',
    '$stateParams',
    '$modal',
    'WorkspaceResource',
    'WorkspaceSettingsResource',
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
    WorkspaceSettingsResource,
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
    if (currentWorkspace.problem.schemaVersion !== currentSchemaVersion) {
      $scope.workspace = SchemaService.updateWorkspaceToCurrentSchema(currentWorkspace);
      WorkspaceResource.save($stateParams, $scope.workspace);
    } else {
      $scope.workspace = currentWorkspace;
    }

    var newSettings = {
      calculationMethod: 'median',
      showPercentages: true,
      effectsDisplay: 'effects'
    };

    var newToggledColumns = {
      criteria: true,
      description: true,
      units: true,
      references: true,
      strength: true
    };

    $scope.workspaceSettings = _.cloneDeep(newSettings);
    $scope.toggledColumns = _.cloneDeep(newToggledColumns);
    WorkspaceSettingsResource.get($stateParams).$promise.then(function(result) {
      $scope.workspaceSettings = result.settings ? result.settings : $scope.workspaceSettings;
      $scope.toggledColumns = result.toggledColumns ? result.toggledColumns : $scope.toggledColumns;
    });

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

    function openSettingsModal() {
      $modal.open({
        templateUrl: mcdaRootPath + 'js/workspace/workspaceSettings.html',
        controller: 'WorkspaceSettingsController',
        resolve: {
          callback: function() {
            return function(settings, toggledColumns) {
              WorkspaceSettingsResource.save($stateParams, {
                settings: settings,
                toggledColumns: toggledColumns
              });
              $scope.workspaceSettings = settings;
              $scope.toggledColumns = toggledColumns;
            };
          },
          settings: function() {
            return _.cloneDeep($scope.workspaceSettings);
          },
          toggledColumns: function() {
            return _.cloneDeep($scope.toggledColumns);
          },
          reset: function() {
            return function() {
              WorkspaceSettingsResource.save($stateParams, {
                settings: newSettings,
                toggledColumns: newToggledColumns
              });
              $scope.workspaceSettings = _.cloneDeep(newSettings);
              $scope.toggledColumns = _.cloneDeep(newToggledColumns);
            };
          }
        }
      });

    }
  };
  return dependencies.concat(WorkspaceController);
});
