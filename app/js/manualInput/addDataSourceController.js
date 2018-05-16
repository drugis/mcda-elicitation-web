'use strict';
define([], function() {
  var dependencies = ['$scope', '$modalInstance', 'callback', 'criterion'];
  var AddDataSourceController = function($scope, $modalInstance, callback, criterion) {
    // functions
    $scope.addDataSource = addDataSource;
    $scope.cancel = $modalInstance.close;

    // init
    $scope.criterion = criterion;
    $scope.dataSource = {
      inputType: 'distribution',
      inputMethod: 'assistedDistribution',
      dataType: 'dichotomous',
      parameterOfInterest: 'eventProbability'
    };
    $scope.errors = [];

    function addDataSource(dataSource) {
      $scope.isAddingDataSource = true;
      callback(dataSource);
      $modalInstance.close();
    }
  };
  return dependencies.concat(AddDataSourceController);
});
