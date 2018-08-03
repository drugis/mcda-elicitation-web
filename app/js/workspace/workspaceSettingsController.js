'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'WorkspaceSettingsService',
    'callback',
    'settings',
    'toggledColumns'
  ];
  var WorkspaceSettingsController = function(
    $scope,
    $modalInstance,
    WorkspaceSettingsService,
    callback,
    settings,
    toggledColumns
  ) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.saveSettings = saveSettings;
    $scope.resetToDefault = resetToDefault;
    $scope.selectAll = selectAll;

    //init
    $scope.settings = settings;
    $scope.toggledColumns = toggledColumns;

    //public
    function saveSettings() {
      callback($scope.settings, $scope.toggledColumns);
      $modalInstance.close();
    }

    function resetToDefault() {
      var defaultSettingsAndColumns = WorkspaceSettingsService.resetSettings();
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
