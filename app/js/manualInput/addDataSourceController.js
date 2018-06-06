'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'generateUuid',
    'callback',
    'criterion',
    'oldDataSourceIdx'
  ];
  var AddDataSourceController = function(
    $scope,
    $modalInstance,
    generateUuid,
    callback,
    criterion,
    oldDataSourceIdx
  ) {
    // functions
    $scope.addDataSource = addDataSource;
    $scope.cancel = $modalInstance.close;
    $scope.checkError = checkError;

    // init
    $scope.criterion = criterion;
    $scope.sourceLinkValidity = {
      isInvalid: false
    };
    $scope.oldDataSourceIdx = oldDataSourceIdx;
    if (oldDataSourceIdx >= 0) {
      $scope.dataSource = _.cloneDeep(criterion.dataSources[oldDataSourceIdx]);
    } else {
      $scope.dataSource = _.cloneDeep($scope.criterion.dataSources[0]);
      delete $scope.dataSource.source;
      $scope.dataSource.id = generateUuid();
    }
    checkError();

    // public
    function checkError() {
      $scope.errors = $scope.sourceLinkValidity.isInvalid ? ['Invalid reference URL'] : [];
      if (!$scope.dataSource.source) {
        $scope.errors.push('No reference entered');
      }
      var duplicateRef = _.find($scope.criterion.dataSources, function(dataSource) {
        return dataSource.id !== $scope.dataSource.id && dataSource.source === $scope.dataSource.source;
      });
      if (duplicateRef) {
        $scope.errors.push('Duplicate referenence');
      }
    }

    function addDataSource(dataSource) {
      $scope.isAddingDataSource = true;
      callback(dataSource);
      $modalInstance.close();
    }
  };
  return dependencies.concat(AddDataSourceController);
});
