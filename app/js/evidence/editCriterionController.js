'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criterion', 'criteria', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, criterion, criteria, callback) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.checkForDuplicateNames = checkForDuplicateNames;

    // init
    $scope.originalTitle = criterion.title;
    $scope.criterion = _.cloneDeep(criterion);
    $scope.isTitleUnique = true;
    $scope.criteria = criteria;

    function save() {
      callback($scope.criterion);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

    function checkForDuplicateNames() {
      if (_.find($scope.criteria, function(criterion) {
          return criterion === $scope.criterion.title;
        }) && $scope.originalTitle !== $scope.criterion.title) {
        $scope.isTitleUnique = false;
      } else {
        $scope.isTitleUnique = true;
      }
    }
  };
  return dependencies.concat(EditCriterionController);
});