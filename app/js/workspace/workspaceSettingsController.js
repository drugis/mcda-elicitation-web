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
    $scope.checkForWarnings = checkForWarnings;

    //init
    $scope.settings = WorkspaceSettingsService.setWorkspaceSettings();
    $scope.toggledColumns = WorkspaceSettingsService.getToggledColumns();
    $scope.warnings = WorkspaceSettingsService.getWarnings($scope.settings);

    function saveSettings() {
      WorkspaceSettingsService.saveSettings($scope.settings, $scope.toggledColumns)
        .then(callback);
      $modalInstance.close();
    }

    function resetToDefault() {
      var defaultSettingsAndColumns = WorkspaceSettingsService.getDefaults();
      $scope.toggledColumns = defaultSettingsAndColumns.toggledColumns;
      $scope.settings = defaultSettingsAndColumns.settings;
      $scope.warnings = WorkspaceSettingsService.getWarnings($scope.settings);
    }

    function toggleSelection() {
      var isAnyUnselected = false === _.find($scope.toggledColumns, function(isSelected) {
        return !isSelected;
      });
      if (isAnyUnselected) {
        selectAll();
      } else {
        deselectAll();
      }
    }

    function checkForWarnings() {
      $scope.warnings = WorkspaceSettingsService.getWarnings($scope.settings);
    }
    
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
