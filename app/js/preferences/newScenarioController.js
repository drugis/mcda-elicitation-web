'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'type', 'scenarios', 'callback'];

  function NewScenarioController($scope, $modalInstance, type, scenarios, callback) {
    // functions 
    $scope.cancel = cancel;
    $scope.create = create;
    $scope.checkDuplicateScenarioTitle = checkDuplicateScenarioTitle;

    // init
    $scope.type = type;
    $scope.title = { newTitle: '' };

    function cancel() {
      $modalInstance.close();
    }

    function create() {
      callback($scope.title.newTitle);
      cancel();
    }

    function checkDuplicateScenarioTitle() {
      $scope.isDuplicateScenarioTitle = _.find(scenarios, function(scenario) {
        return $scope.title.newTitle === scenario.title;
      });
    }
  }
  return dependencies.concat(NewScenarioController);
});