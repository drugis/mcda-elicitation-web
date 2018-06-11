'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'oldCriterion', 'criteria', 'useFavorability', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, oldCriterion, criteria, useFavorability, callback) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.save = save;
    $scope.checkForDuplicateNames = checkForDuplicateNames;

    // init
    $scope.criterion = _.cloneDeep(oldCriterion);
    $scope.isTitleUnique = true;
    $scope.criteria = criteria;
    $scope.valueTree = useFavorability;
    if ($scope.valueTree && $scope.valueTree.children) {
      $scope.favorabilityStatus = {};
      $scope.favorabilityStatus.originalFavorability = !!_.find($scope.valueTree.children[0].criteria, function(crit) {
        return crit === oldCriterion.id;
      });
      $scope.favorabilityStatus.isFavorable = _.cloneDeep($scope.favorabilityStatus.originalFavorability);
    }

    function save() {
      var favorabilityChanged = $scope.valueTree && $scope.valueTree.children ? $scope.favorabilityStatus.originalFavorability !== $scope.favorabilityStatus.isFavorable : false;
      callback($scope.criterion, favorabilityChanged);
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
