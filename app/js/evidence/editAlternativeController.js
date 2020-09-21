'use strict';
define(['lodash', 'angular'], function (_, angular) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'alternative',
    'alternatives',
    'callback'
  ];
  var EditAlternativeController = function (
    $scope,
    $modalInstance,
    alternative,
    alternatives,
    callback
  ) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.checkForDuplicateNames = checkForDuplicateNames;

    // init
    $scope.originalTitle = alternative.title;
    $scope.alternative = angular.copy(alternative);
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
      if (titleAlreadyExists()) {
        $scope.isTitleUnique = false;
      } else {
        $scope.isTitleUnique = true;
      }
    }

    function titleAlreadyExists() {
      return _.some($scope.alternatives, function (alternative) {
        return (
          alternative.title === $scope.alternative.title &&
          $scope.originalTitle !== $scope.alternative.title
        );
      });
    }
  };
  return dependencies.concat(EditAlternativeController);
});
