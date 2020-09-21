'use strict';
define(['lodash'], function (_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'subProblem',
    'subProblems',
    'callback'
  ];
  var EditSubProblemTitleController = function (
    $scope,
    $modalInstance,
    subProblem,
    subProblems,
    callback
  ) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.checkDuplicateSubProblemTitle = checkDuplicateSubProblemTitle;

    // init
    $scope.subProblem = _.cloneDeep(subProblem);
    $scope.subProblems = subProblems;

    function save() {
      callback($scope.subProblem.title);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }

    function checkDuplicateSubProblemTitle() {
      $scope.isDuplicateSubProblemTitle = _.find($scope.subProblems, function (
        subProblem
      ) {
        return (
          subProblem.id !== $scope.subProblem.id &&
          subProblem.title === $scope.subProblem.title
        );
      });
    }
  };
  return dependencies.concat(EditSubProblemTitleController);
});
