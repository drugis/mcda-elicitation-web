'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criterion', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, criterion, callback) {
    $scope.cancel = cancel;
    $scope.save = save;

    $scope.criterion = _.cloneDeep(criterion);

    function save() {
      var obj={};
      obj[$scope.criterion.value.title] = $scope.criterion.value;
      callback(obj);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

  };
  return dependencies.concat(EditCriterionController);
});