'use strict';
define(['lodash'], function (_) {
  var dependencies = ['$scope', '$modalInstance', 'subproblem', 'callback'];
  var DeleteSubproblemController = function (
    $scope,
    $modalInstance,
    subproblem,
    callback
  ) {
    // functions
    $scope.cancel = cancel;
    $scope.delete = confirmDelete;
    $scope.subproblem = subproblem;

    function confirmDelete() {
      callback($scope.subproblem.id);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }
  };
  return dependencies.concat(DeleteSubproblemController);
});
