'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criterion', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, criterion, callback) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;

    // init
    $scope.criterion = _.cloneDeep(criterion);

    function save() {
      callback($scope.criterion);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

  };
  return dependencies.concat(EditCriterionController);
});