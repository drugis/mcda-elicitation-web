'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'row', 'callback'];
  var EditCriterionController = function($scope, $modalInstance, row, callback) {
    // functions
    $scope.cancel = $modalInstance.close();
    $scope.save = save;
    $scope.checkErrors = checkErrors;

    // init
    $scope.dataSource = _.cloneDeep(row.dataSource);
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
      if (row.criterion.numberOfDataSources > 1 && !$scope.dataSource.source) {
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
      return;
    }
  };
  return dependencies.concat(EditCriterionController);
});
