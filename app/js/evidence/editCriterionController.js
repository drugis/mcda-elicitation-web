'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'oldCriterion', 'criteria', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, oldCriterion, criteria, callback) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.save = save;
    $scope.checkForDuplicateNames = checkForDuplicateNames;

    // init
    $scope.criterion = _.cloneDeep(oldCriterion);
    $scope.isTitleUnique = true;
    $scope.criteria = criteria;
    $scope.useFavorability = $scope.criterion.hasOwnProperty('isFavorable');

    function save() {
      callback($scope.criterion);
      $modalInstance.close();
    }

    function checkForDuplicateNames() {
      if (_.find($scope.criteria, function(criterion) {
        return criterion.title === $scope.criterion.title && criterion.id !== $scope.criterion.id;
      }) ) {
        $scope.isTitleUnique = false;
      } else {
        $scope.isTitleUnique = true;
      }
    }
  };
  return dependencies.concat(EditCriterionController);
});
