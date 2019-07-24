'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'oldCriterion',
    'criteria',
    'useFavorability',
    'callback'
  ];
  var EditCriterionController = function(
    $scope,
    $modalInstance,
    oldCriterion,
    criteria,
    useFavorability,
    callback
  ) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.save = save;
    $scope.isCreationBlocked = isCreationBlocked;

    // init
    $scope.criterion = _.cloneDeep(oldCriterion);
    $scope.isTitleUnique = true;
    $scope.criteria = criteria;
    $scope.useFavorability = useFavorability;
    $scope.addOrEdit = 'Edit';
    enableRadioButton();

    function enableRadioButton() {
      if (useFavorability) {
        $scope.criterion.isFavorable = !!$scope.criterion.isFavorable;
      }
    }

    function save() {
      callback($scope.criterion);
      $modalInstance.close();
    }

    function isCreationBlocked() {
      $scope.blockedReasons = [];
      if ($scope.criterion.title !== oldCriterion.title && isTitleDuplicate($scope.criterion.title)) {
        $scope.blockedReasons.push('Duplicate title');
      }
      if (!$scope.criterion.title) {
        $scope.blockedReasons.push('No title entered');
      }
    }

    function isTitleDuplicate(title) {
      return _.find(criteria, ['title', title]);
    }
  };
  return dependencies.concat(EditCriterionController);
});
