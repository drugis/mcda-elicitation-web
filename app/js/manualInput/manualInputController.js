'use strict';
define([], function() {
  var dependencies = ['$scope', '$modal'];
  var ManualInputStep1Controller = function($scope, $modal) {

    $scope.openCriterionModal = openCriterionModal;

    $scope.criteria = [];

    function openCriterionModal() {
      $modal.open({
        templateUrl: '/app/js/manualInput/addCriterion.html',
        controller: 'AddCriterionController', resolve: {
          criteria: function() {
            return $scope.criteria;
          },
          callback: function() {
            return function(newCriterion) {
              $scope.criteria.push(newCriterion);
            };
          }
        }
      });
    }

  };
  return dependencies.concat(ManualInputStep1Controller);
});
