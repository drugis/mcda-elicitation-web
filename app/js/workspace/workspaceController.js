'use strict';
define(['angular'], function(angular) {

  return function($scope, $cookies, currentWorkspace) {
    // functions
    $scope.editTitle = editTitle;
    $scope.saveTitle = saveTitle;
    $scope.cancelTitle = cancelTitle;
    $scope.downloadWorkspace = downloadWorkspace;

    // init
    var user = angular.fromJson($cookies.get('LOGGED-IN-USER'));
    $scope.editMode = {
      isUserOwner: user ? currentWorkspace.owner === user.id : false
    };
    $scope.workspace = currentWorkspace;

    $scope.isEditTitleVisible = false;
    $scope.workspaceTitle = $scope.workspace.title;

    function editTitle() {
      $scope.isEditTitleVisible = true;
      $scope.workspace.title = $scope.workspace.problem.title;
    }

    function saveTitle() {
      $scope.workspace.problem.title = $scope.workspace.title;
      $scope.workspace.$save();
      $scope.isEditTitleVisible = false;
    }

    function cancelTitle() {
      $scope.isEditTitleVisible = false;
    }

    function downloadWorkspace() {
      var link = document.createElement('a');
      link.download = 'problem' + $scope.workspace.id + '.json';
      var data = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify($scope.problem, null, 2));
      link.href = 'data:' + data;
      link.click();
    }
  };
});