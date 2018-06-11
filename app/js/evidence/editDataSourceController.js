'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'criterion', 'oldDataSourceIdx', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, criterion, oldDataSourceIdx, callback) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.save = save;
    $scope.checkErrors = checkErrors;

    // init
    $scope.dataSource = _.cloneDeep(criterion.dataSources[oldDataSourceIdx]);
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

    function checkMissingReference() {
      if (criterion.dataSources.length > 1 && !$scope.dataSource.source) {
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
      if (_.find(criterion.dataSources, function(dataSource) {
        return dataSource.id !== $scope.dataSource.id && dataSource.source === $scope.dataSource.source;
      })) {
        $scope.errors.push('Duplicate reference');
      }
    }
  };
  return dependencies.concat(EditCriterionController);
});
