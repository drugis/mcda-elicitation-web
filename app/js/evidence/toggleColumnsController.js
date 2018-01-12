'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'toggledColumns', 'callback'];
  var ToggleColumnsController = function($scope, $modalInstance, toggledColumns, callback) {
    $scope.cancel = cancel;
    $scope.save = save;

    $scope.toggledColumns = _.cloneDeep(toggledColumns);

    function save() {
      callback($scope.toggledColumns);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

  };
  return dependencies.concat(ToggleColumnsController);
});