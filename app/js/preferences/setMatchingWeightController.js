'use strict';
define(
  [],
  function() {
    var dependencies = [
      '$scope',
      '$modalInstance',
      'mostImportantCriterion',
      'secondaryCriterion',
      'callback'
    ];
    var SetMatchingWeightController = function(
      $scope,
      $modalInstance,
    mostImportantCriterion,
      secondaryCriterion,
      callback
    ) {
      $scope.weight = {};
      $scope.mostImportantCriterion = mostImportantCriterion;
      $scope.secondaryCriterion = secondaryCriterion;
      $scope.saveWeight = saveWeight;
      $scope.cancel = $modalInstance.close;

      function saveWeight() {
        callback($scope.weight.value);
        $modalInstance.close();
      }
    };
    return dependencies.concat(SetMatchingWeightController);
  });
