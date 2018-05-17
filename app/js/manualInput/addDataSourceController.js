'use strict';
define([], function() {
  var dependencies = ['$scope', '$modalInstance', 'generateUuid', 'callback', 'criterion'];
  var AddDataSourceController = function($scope, $modalInstance, generateUuid, callback, criterion) {
    // functions
    $scope.addDataSource = addDataSource;
    $scope.cancel = $modalInstance.close;
    $scope.checkError = checkError;

    // init
    $scope.criterion = criterion;
    $scope.sourceLinkValidity = {
      isInvalid: false
    };
    $scope.dataSource = {
      id: generateUuid(),
      inputType: 'distribution',
      inputMethod: 'assistedDistribution',
      dataType: 'dichotomous',
      parameterOfInterest: 'eventProbability'
    };
    $scope.errors = [];

    function checkError() {
      $scope.errors = $scope.sourceLinkValidity.isInvalid ? ['Invalid reference URL'] : [];
    }

    function addDataSource(dataSource) {
      $scope.isAddingDataSource = true;
      callback(dataSource);
      $modalInstance.close();
    }
  };
  return dependencies.concat(AddDataSourceController);
});
