'use strict';
define(['lodash'], function(_) {
  var dependencies = ['$scope', '$modal', '$state', 'ManualInputService'];
  var ManualInputController = function($scope, $modal, $state, ManualInputService) {

    $scope.openCriterionModal = openCriterionModal;
    $scope.addTreatment = addTreatment;
    $scope.isDuplicateName = isDuplicateName;
    $scope.criteria = $scope.criteria ? $scope.criteria : [];
    $scope.treatments = [];
    $scope.treatmentName = undefined;
    $scope.goToStep2 = goToStep2;

    function addTreatment(name) {
      $scope.treatments.push({
        name: name
      });
      $scope.treatmentName = undefined;
    }

    function isDuplicateName(name) {
      return _.find($scope.treatments, ['name', name]);

    }

    function openCriterionModal() {
      $modal.open({
        templateUrl: '/app/js/manualInput/addCriterion.html',
        controller: 'AddCriterionController',
        resolve: {
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

    function goToStep2() {
      ManualInputService.saveStep1({
        criteria: $scope.criteria,
        treatments: $scope.treatments,
        title: $scope.title
      });
      $state.go('manualInputStep2', $scope);
    }
  };
  return dependencies.concat(ManualInputController);
});
