'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    '$scope',
    '$modalInstance',
    'callback',
    'currentValues'
  ];
  var EditUnitOfMeasurementController = function(
    $scope,
    $modalInstance,
    callback,
    currentValues
  ) {
    // functions
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.unitOptionChanged = unitOptionChanged;

    // init
    $scope.saveDisabled = false;
    $scope.unitOptions = [{
      label: 'Proportion (decimal)',
      id: 'decimal',
      defaultValue: 'Proportion',
      defaultLowerBound: 0,
      defaultUpperBound: 1

    }, {
      label: 'Proportion (percentage)',
      id: 'percentage',
      defaultValue: '%',
      defaultLowerBound: 0,
      defaultUpperBound: 100

    }, {
      label: 'Default',
      id: 'default',
      defaultValue: '',
      defaultLowerBound: -Infinity,
      defaultUpperBound: Infinity
    }];
    $scope.lowerBoundOptions = [-Infinity, 0];
    $scope.upperBoundOptions = [1, 100, Infinity];

    init();

    function init() {
      var option = initializeOption();
      $scope.values = {
        selectedOption: option,
        value: currentValues.value !== undefined ? currentValues.value : option.defaultValue,
        lowerBound: currentValues.lowerBound !== undefined ? currentValues.lowerBound : option.defaultLowerBound,
        upperBound: currentValues.upperBound !== undefined ? currentValues.upperBound : option.defaultUpperBound
      };
    }

    function initializeOption() {
      if (!currentValues.selectedOption) {
        return $scope.unitOptions[2];
      } else {
        return currentValues.selectedOption;
      }
    }

    function unitOptionChanged() {
      $scope.values.value = $scope.values.selectedOption.defaultValue;
      $scope.values.lowerBound = $scope.values.selectedOption.defaultLowerBound;
      $scope.values.upperBound = $scope.values.selectedOption.defaultUpperBound;
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
