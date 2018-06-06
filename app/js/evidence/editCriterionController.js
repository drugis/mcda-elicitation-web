'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criterion', 'criterionId', 'criteria', 'valueTree', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, criterion, criterionId, criteria, valueTree, callback) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.save = save;
    $scope.checkForDuplicateNames = checkForDuplicateNames;

    // init
    $scope.originalTitle = criterion.title;
    $scope.criterion = _.cloneDeep(criterion);
    $scope.isTitleUnique = true;
    $scope.criteria = criteria;
    $scope.valueTree = valueTree;
    if ($scope.valueTree.children) {
      $scope.favorabilityStatus = {};
      $scope.favorabilityStatus.originalFavorability = !!_.find($scope.valueTree.children[0].criteria, function(crit) {
        return crit === criterionId;
      });
      $scope.favorabilityStatus.isFavorable = _.cloneDeep($scope.favorabilityStatus.originalFavorability);
    }

    function save() {
      var favorabilityChanged = $scope.valueTree.children ? $scope.favorabilityStatus.originalFavorability !== $scope.favorabilityStatus.isFavorable : false;
      callback($scope.criterion, favorabilityChanged);
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
