'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'scenario','scenarios', 'callback'];
  var EditScenarioTitleController = function($scope, $modalInstance, scenario, scenarios, callback) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.checkDuplicateScenarioTitle = checkDuplicateScenarioTitle;

    // init
    $scope.scenario = _.cloneDeep(scenario);
    $scope.scenarios = scenarios;
   
    function save() {
      callback($scope.scenario.title);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

    function checkDuplicateScenarioTitle() {
      $scope.isDuplicateScenarioTitle = _.find($scope.scenarios, function(scenario) {
        return scenario.id !== $scope.scenario.id && scenario.title === $scope.scenario.title;
      });
    }
  };
  return dependencies.concat(EditScenarioTitleController);
});