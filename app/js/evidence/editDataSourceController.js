'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'dataSources',
    'dataSource',
    'callback',
    'generateUuid'
  ];
  var EditDataSourceController = function(
    $scope,
    $modalInstance,
    dataSources,
    dataSource,
    callback,
    generateUuid
  ) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.save = save;
    $scope.checkErrors = checkErrors;

    // init
    if (dataSource) {
      $scope.dataSource = _.cloneDeep(dataSource);
    } else if (dataSources[0]) {
      $scope.dataSource = _.cloneDeep(dataSources[0]);
      delete $scope.dataSource.source;
      $scope.dataSource.id = generateUuid();
      $scope.isAdding = true;
      $scope.dataSource.unitOfMeasurement = {
        selectedOption: {
          type: 'custom'
        }
      };
    } else {
      $scope.dataSource = {
        id: generateUuid(),
        unitOfMeasurement: {
          selectedOption: {
            type: 'custom'
          }
        },
        scale: [-Infinity, Infinity]
      };
      $scope.isAdding = true;
    }

    checkErrors();

    // public
    function save() {
      callback($scope.dataSource);
      $modalInstance.close();
    }
    function checkErrors() {
      $scope.errors = [];
      checkMissingReference();
      checkDuplicateReference();
      checkUrl();
    }

    //private
    function checkMissingReference() {
      if (dataSources.length > 1 && !$scope.dataSource.source) {
        $scope.errors.push('Missing reference');
      }
    }

    function checkUrl() {
      var regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
      if ($scope.dataSource.sourceLink && !$scope.dataSource.sourceLink.match(regex)) {
        $scope.errors.push('Invalid URL');
      }
    }

    function checkDuplicateReference() {
      if (_.find(dataSources, function(dataSource) {
        return dataSource.id !== $scope.dataSource.id && dataSource.source === $scope.dataSource.source;
      })) {
        $scope.errors.push('Duplicate reference');
      }
    }
  };
  return dependencies.concat(EditDataSourceController);
});
