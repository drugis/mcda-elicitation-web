'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'scenario',
    'callback'
  ];
  var DeleteScenarioController = function(
    $scope, 
    $modalInstance, 
    scenario, 
    callback
    ) {
    // functions
    $scope.cancel = cancel;
    $scope.delete = confirmDelete;
    $scope.scenario = scenario;
    
    function confirmDelete() {
      callback($scope.scenario.id);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }
  };
  return dependencies.concat(DeleteScenarioController);
});
