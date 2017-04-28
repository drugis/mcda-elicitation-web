'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criteria', 'callback'];
  var ManualInputStep1Controller = function($scope, $modalInstance, criteria, callback) {
    // vars
    $scope.blockedReason = '';
    $scope.criterion = {
      direction: 'Lower is better',
      isFavorable: false
    };
    $scope.isAddingCriterion = false;

    // functions
    $scope.isCreationBlocked = isCreationBlocked;
    $scope.addCriterion = addCriterion;
    $scope.cancel = $modalInstance.close;

    function addCriterion(criterion) {
      $scope.isAddingCriterion = true;
      callback(criterion);
      $modalInstance.close();
    }

    function isCreationBlocked(criterion) {
      if (!criterion.name && !$scope.isAddingCriterion) {
        $scope.blockedReason = 'No name entered';
        return true;
      } else if (isNameDuplicate(criterion.name) && !$scope.isAddingCriterion) {
        $scope.blockedReason = 'Duplicate name';
        return true;
      }
      return false;
    }

    function isNameDuplicate(name) {
      return _.find(criteria, ['name', name]);
    }
  };
  return dependencies.concat(ManualInputStep1Controller);
});
