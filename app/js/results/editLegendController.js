'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'LegendService',
    'legend',
    'alternatives',
    'callback'
  ];

  var EditLegendController = function(
    $scope,
    $modalInstance,
    LegendService,
    legend,
    alternatives,
    callback
  ) {
    // functions
    $scope.saveLegend = saveLegend;
    $scope.close = $modalInstance.close;
    $scope.createSingleLetterLegend = createSingleLetterLegend;
    $scope.resetToBase = resetToBase;
    $scope.checkForMissingLabel = checkForMissingLabel;

    // init
    $scope.legend = _.cloneDeep(legend);
    if (!$scope.legend) {
      $scope.legend = LegendService.createBaseCase(alternatives);
    }
    checkForMissingLabel();

    function checkForMissingLabel() {
      $scope.isLabelMissing = _.find($scope.legend, function(legendEntry) {
        return !legendEntry.newTitle;
      });
    }

    function saveLegend() {
      callback($scope.legend);
      $scope.close();
    }

    function createSingleLetterLegend() {
      var letterValue = 65;
      _.forEach($scope.legend, function(legendEntry) {
        legendEntry.newTitle = String.fromCharCode(letterValue++);
      });
    }

    function resetToBase() {
       $scope.legend = LegendService.createBaseCase(alternatives);
    }

  };
  return dependencies.concat(EditLegendController);
});
