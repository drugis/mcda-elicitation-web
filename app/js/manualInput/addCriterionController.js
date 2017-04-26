'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criteria', 'callback'];
  var ManualInputStep1Controller = function($scope, $modalInstance, criteria, callback) {
    $scope.criterion = {
      direction: 'Lower is better',
      isFavorable: false
    };
    $scope.isCreationBlocked = isCreationBlocked;
    $scope.addCriterion = addCriterion;
    $scope.blockedReason;
    function addCriterion(criterion) {
      callback(criterion);
      $modalInstance.close();
    }

    function isCreationBlocked(criterion) {
      return !criterion.name || isNameDuplicate(criterion.name);
    }

    $scope.cancel = $modalInstance.close;
    function isNameDuplicate(name){
      return _.find(criteria, ['title', name]);
    }
  };
  return dependencies.concat(ManualInputStep1Controller);
});
