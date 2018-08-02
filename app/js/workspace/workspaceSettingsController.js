'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'callback',
    'settings',
    'toggledColumns'
  ];
  var WorkspaceSettingsController = function(
    $scope,
    $modalInstance,
    callback,
    settings,
    toggledColumns,
    reset
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
      reset();
      $modalInstance.close();
    }

    function selectAll() {
      var truthToSetTo = _.reduce($scope.toggledColumns, function(accum, column) {
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
