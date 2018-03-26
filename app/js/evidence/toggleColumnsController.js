'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'toggledColumns', 'callback'];
  var ToggleColumnsController = function($scope, $modalInstance, toggledColumns, callback) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.selectAll = selectAll;

    $scope.toggledColumns = _.cloneDeep(toggledColumns);

    function selectAll() {
      if (_.reduce($scope.toggledColumns, function(accum, column) {
          return accum && column;
        }, true)) {
        setAllTo(false);
      } else {
        setAllTo(true);
      }
    }

    function save() {
      callback($scope.toggledColumns);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

    function setAllTo(value) {
      $scope.toggledColumns = {
        criteria: value,
        description: value,
        units: value,
        references: value,
        strength: value
      };
    }

  };
  return dependencies.concat(ToggleColumnsController);
});