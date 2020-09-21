'use strict';
define([], function () {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'InProgressResource',
    'inProgressId',
    'title',
    'callback'
  ];

  var DeleteInProgressController = function (
    $scope,
    $modalInstance,
    InProgressResource,
    inProgressId,
    title,
    callback
  ) {
    // functions
    $scope.deleteWorkspace = deleteWorkspace;
    $scope.close = $modalInstance.close;

    // init
    $scope.workspace = {
      // to be able to share deleteWorkspace.html
      title: title
    };
    $scope.inProgressId = inProgressId;

    function deleteWorkspace() {
      InProgressResource.delete({
        inProgressId: inProgressId
      }).$promise.then(function () {
        callback();
      });
      $scope.close();
    }
  };
  return dependencies.concat(DeleteInProgressController);
});
