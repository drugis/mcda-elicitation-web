'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'alternatives',
    'callback'
  ];
  var AddAlternativeController = function(
    $scope,
    $modalInstance,
    alternatives,
    callback
  ) {
    // functions
    $scope.cancel = $modalInstance.close;
    $scope.save = save;
    $scope.checkErrors = checkErrors;

    // init
    $scope.alternative = {
      title: ''
    };
    checkErrors();

    // public
    function save() {
      callback($scope.alternative.title);
      $modalInstance.close();
    }

    function checkErrors() {
      $scope.errors = [];
      isValidTitle();
      isDuplicateTitle();
    }

    function isValidTitle() {
      if (!$scope.alternative.title) {
        $scope.errors.push('No title entered');
      }
    }

    function isDuplicateTitle() {
      if (_.find(alternatives, ['title', $scope.alternative.title])) {
        $scope.errors.push('Duplicate title');
      }
    }

  };
  return dependencies.concat(AddAlternativeController);
});
