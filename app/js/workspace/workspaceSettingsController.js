'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'WorkspaceSettingsService',
    'callback'
  ];
  var WorkspaceSettingsController = function(
    $scope,
    $modalInstance,
    WorkspaceSettingsService,
    callback
  ) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.saveSettings = saveSettings;
    $scope.resetToDefault = resetToDefault;
    $scope.toggleSelection = toggleSelection;

    //init
    $scope.settings = WorkspaceSettingsService.getWorkspaceSettings();
    $scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();

    //public
    function saveSettings() {
      WorkspaceSettingsService.saveSettings($scope.settings, $scope.toggledColumns)
        .then(callback);
      $modalInstance.close();
    }

    function resetToDefault() {
      var defaultSettingsAndColumns = WorkspaceSettingsService.getDefaults();
      $scope.toggledColumns = defaultSettingsAndColumns.toggledColumns;
      $scope.settings = defaultSettingsAndColumns.settings;
    }

    function toggleSelection() {
      // false comparison needed because 
      var isAnyUnselected = false === _.find($scope.toggledColumns, function(isSelected) {
        return !isSelected;
      });
      if(isAnyUnselected) {
        selectAll();
      } else {
        deselectAll();
      }
    }

    //private
    function selectAll() {
      setAllTo(true);
    }
    function deselectAll() {
      setAllTo(false);
    }
    function setAllTo(newValue) {
      $scope.toggledColumns = _.mapValues($scope.toggledColumns, function() {
        return newValue;
      });
    }
  };
  return dependencies.concat(WorkspaceSettingsController);
});
