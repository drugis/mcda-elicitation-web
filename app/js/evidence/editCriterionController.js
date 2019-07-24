'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'callback',
    'unitOfMeasurement'
  ];
  var EditUnitOfMeasurementController = function(
    $scope,
    $modalInstance,
    callback,
    unitOfMeasurement
  ) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.unitOptionChanged = unitOptionChanged;
    $scope.validateInput = validateInput;

    // init
    $scope.saveDisabled = false;
    $scope.unitOptions = [{
      label: 'Proportion (decimal)',
      id: 'decimal',
      defaultValue: 'Proportion'
    }, {
      label: 'Proportion (percentage)',
      id: 'percentage',
      defaultValue: '%'
    }, {
      label: 'Other',
      id: 'other',
      defaultValue: ''
    }];

    $scope.values = {
      selectedOption: initializeOption(),
    };
    $scope.values.value= initializeUnit();

    function initializeOption() {
      if (unitOfMeasurement === 'Proportion') {
        return $scope.unitOptions[0];
      } else if (unitOfMeasurement === '%') {
        return $scope.unitOptions[1];
      } else {
        return $scope.unitOptions[2];
      }
    }

    function initializeUnit() {
      if (unitOfMeasurement === undefined) {
        return $scope.values.selectedOption.defaultValue;
      } else {
        return unitOfMeasurement;
      }
    }

    function unitOptionChanged() {
      $scope.values.value = $scope.values.selectedOption.defaultValue;
    }

    function validateInput() {
      $scope.saveDisabled =  $scope.values.value === '%' || $scope.values.value === 'Proportion';
    }

    function save() {
      callback($scope.values);
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.close();
    }
  };
  return dependencies.concat(EditUnitOfMeasurementController);
});
