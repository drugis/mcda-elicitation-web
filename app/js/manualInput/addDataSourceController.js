'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'generateUuid', 'callback', 'criterion', 'oldDataSource'];
  var AddDataSourceController = function($scope, $modalInstance, generateUuid, callback, criterion, oldDataSource) {
    // functions
    $scope.addDataSource = addDataSource;
    $scope.cancel = $modalInstance.close;
    $scope.checkError = checkError;

    // init
    $scope.criterion = criterion;
    $scope.sourceLinkValidity = {
      isInvalid: false
    };
    $scope.oldDataSource = oldDataSource;
    $scope.dataSource = oldDataSource ? _.cloneDeep(oldDataSource) : {
      id: generateUuid(),
      inputType: 'distribution',
      inputMethod: 'assistedDistribution',
      dataType: 'dichotomous',
      parameterOfInterest: 'eventProbability'
    };
    $scope.errors = ['No reference entered'];
    checkError();


    function checkError() {
      $scope.errors = $scope.sourceLinkValidity.isInvalid ? ['Invalid reference URL'] : [];
      if (!$scope.dataSource.source) {
        $scope.errors.push('No reference entered');
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
