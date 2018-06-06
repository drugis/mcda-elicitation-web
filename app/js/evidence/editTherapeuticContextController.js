'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modalInstance', 'therapeuticContext', 'callback'];
  var EditTherapeuticContextController = function($scope, $modalInstance, therapeuticContext, callback) {
    $scope.cancel = $modalInstance.close;
    $scope.save = save;

    $scope.context = {
      therapeuticContext: _.cloneDeep(therapeuticContext)
    };

    function save() {
      callback($scope.context.therapeuticContext);
      $modalInstance.close();
    }
  };
  return dependencies.concat(EditTherapeuticContextController);
});
