'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'WorkspaceSettingsService',
    'oldCriterion',
    'criteria',
    'callback'
  ];
  var EditCriterionController = function(
    $scope,
    $modalInstance,
    WorkspaceSettingsService,
    oldCriterion,
    criteria,
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
    $scope.useFavorability = $scope.criterion.hasOwnProperty('isFavorable');
    $scope.usePercentage = WorkspaceSettingsService.usePercentage();
    $scope.addOrEdit = 'Edit';
    $scope.canBePercentage = _.find($scope.criterion.dataSources, function(dataSource) {
      return _.isEqual(dataSource.scale, [0, 1]);
    });

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
