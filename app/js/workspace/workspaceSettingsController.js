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
    $scope.selectAll = selectAll;

    //init
    $scope.settings = _.cloneDeep(WorkspaceSettingsService.getWorkspaceSettings());
    $scope.toggledColumns = _.cloneDeep(WorkspaceSettingsService.getToggledColumns());

    //public
    function saveSettings() {
      WorkspaceSettingsService.saveSettings($scope.settings, $scope.toggledColumns, callback);
      $modalInstance.close();
    }

    function resetToDefault() {
      var defaultSettingsAndColumns = WorkspaceSettingsService.getDefaultSettings();
      $scope.toggledColumns = defaultSettingsAndColumns.toggledColumns;
      $scope.settings = defaultSettingsAndColumns.settings;
    }

    function selectAll() {
      var truthToSetTo = !_.reduce($scope.toggledColumns, function(accum, column) {
        return accum && column;
      }, true);
      setAllTo(truthToSetTo);
    }

    //private
    function setAllTo(showOrNot) {
      $scope.toggledColumns = _.mapValues($scope.toggledColumns, function(){
        return showOrNot;
      });
    }
  };
  return dependencies.concat(WorkspaceSettingsController);
});
