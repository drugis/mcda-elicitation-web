'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'alternative', 'alternatives', 'callback'];
  var EditAlternativeController = function($scope, $modalInstance, alternative, alternatives, callback) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.checkForDuplicateNames = checkForDuplicateNames;

    // init
    $scope.originalTitle = alternative.title;
    $scope.alternative = _.cloneDeep(alternative);
    $scope.isTitleUnique = true;
    $scope.alternatives = alternatives;

    function save() {
      callback($scope.alternative);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

    function checkForDuplicateNames() {
      if (_.find($scope.alternatives, function(alternative) {
          return alternative.title === $scope.alternative.title;
        }) && $scope.originalTitle !== $scope.alternative.title) {
        $scope.isTitleUnique = false;
      } else {
        $scope.isTitleUnique = true;
      }
    }
  };
  return dependencies.concat(EditAlternativeController);
});