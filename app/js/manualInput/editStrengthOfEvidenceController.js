'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'callback',
    'currentValues'
  ];
  var EditStrengthOfEvidenceController = function(
    $scope,
    $modalInstance,
    callback,
    currentValues
  ) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    
    // init
    $scope.values = currentValues;

    function save() {
      callback($scope.values);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }
  };
  return dependencies.concat(EditStrengthOfEvidenceController);
});
