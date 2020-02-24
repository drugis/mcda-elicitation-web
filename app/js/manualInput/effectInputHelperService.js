'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    'ConstraintService',
    'InputKnowledgeService',
    'significantDigits'
  ];
  var EffectInputHelperService = function(
    ConstraintService,
    InputKnowledgeService,
    significantDigits
  ) {
    var PROPORTION_PERCENTAGE = ConstraintService.percentage().label;
    var PROPORTION_DECIMAL = ConstraintService.decimal().label;
    var BELOW_OR_EQUAL_TO = ConstraintService.belowOrEqualTo().label;
    var POSITIVE = ConstraintService.positive().label;
    var FIRST_PARAMETER = 'firstParameter';
    var SECOND_PARAMETER = 'secondParameter';
    var THIRD_PARAMETER = 'thirdParameter';
    var INVALID_INPUT_MESSAGE = 'Missing or invalid input';

    function saveCell(inputCell) {
      var cell = angular.copy(inputCell);
      cell.isInvalid = getInputError(inputCell);
      cell = formatNumbers(inputCell);
      cell.label = inputToString(cell);
      return cell;
    }

    function formatNumbers(cell) {
      cell.firstParameter = formatNumber(cell.firstParameter, cell.inputParameters.firstParameter.label);
      cell.secondParameter = formatNumber(cell.secondParameter);
      cell.thirdParameter = formatNumber(cell.thirdParameter);
      return cell;
    }

    function formatNumber(value, label) {
      if (((label && label !== 'Text') || !label) && !isNotNumeric(value)) {
        return significantDigits(value);
      } else {
        return value;
      }
    }

    function isNotNumeric(value) {
      return isNaN(parseFloat(value)) || !isFinite(value);
    }

    function getInputError(cell) {
      if (cell.inputParameters.id === 'empty') {
        return;
      }
      var error;
      var inputParameters = _.pick(cell.inputParameters, [
        FIRST_PARAMETER,
        SECOND_PARAMETER,
        THIRD_PARAMETER
      ]);
      _.find(inputParameters, function(inputParameter, key) {
        if (hasNotEstimableBound(cell, inputParameter)) {
          return;
        }
        var inputValue = cell[key];
        return _.find(inputParameter.constraints, function(constraint) {
          error = constraint.validator(inputValue, inputParameter.label, cell);
          return error;
        });
      });
      return error;
    }

    function hasNotEstimableBound(cell, parameter) {
      return (parameter.label === 'Lower bound' && cell.lowerBoundNE) ||
        (parameter.label === 'Upper bound' && cell.upperBoundNE);
    }

    function inputToString(cell) {
      if (getInputError(cell)) {
        return INVALID_INPUT_MESSAGE;
      } else {
        return cell.inputParameters.toString(cell);
      }
    }

    function getOptions(inputType) {
      return angular.copy(InputKnowledgeService.getOptions(inputType));
    }

    function getInputParameters(inputParameters, inputParameterOptions) {
      if (!inputParameters) {
        return _.values(inputParameterOptions)[0];
      } else {
        return inputParameterOptions[inputParameters.id];
      }
    }

    function getCellConstraint(unitOfMeasurementType) {
      if (unitOfMeasurementType !== 'custom') {
        return unitOfMeasurementType;
      } else {
        return 'None';
      }
    }

    function updateParameterConstraints(cell, unitOfMeasurement) {
      var newCell = angular.copy(cell);
      if (cell.inputParameters.firstParameter) {
        newCell.inputParameters.firstParameter.constraints = updateConstraints(cell, unitOfMeasurement, FIRST_PARAMETER);
      }
      if (cell.inputParameters.secondParameter) {
        newCell.inputParameters.secondParameter.constraints = updateConstraints(cell, unitOfMeasurement, SECOND_PARAMETER);
      }
      if (cell.inputParameters.thirdParameter) {
        newCell.inputParameters.thirdParameter.constraints = updateConstraints(cell, unitOfMeasurement, THIRD_PARAMETER);
      }
      return newCell;
    }

    function updateConstraints(cell, unitOfMeasurement, parameter) {
      var updatetableParameters = [
        'Value',
        'Lower bound',
        'Upper bound',
        'Standard error',
        'Mean'
      ];
      if (_.includes(updatetableParameters, cell.inputParameters[parameter].label)) {
        return getNewConstraints(cell, unitOfMeasurement, parameter);
      } else {
        return cell.inputParameters[parameter].constraints;
      }
    }

    function getNewConstraints(cell, unitOfMeasurement, parameter) {
      var newConstraints = angular.copy(cell.inputParameters[parameter].constraints);
      newConstraints = removeBoundConstraints(newConstraints);
      if (unitOfMeasurement.lowerBound === 0) {
        if (cell.inputParameters[parameter].label === 'Lower bound') {
          newConstraints.push(ConstraintService.belowOrEqualTo(FIRST_PARAMETER));
        }
        newConstraints.push(getConstraintWithLowerBound(unitOfMeasurement));
      } else if (unitOfMeasurement.upperBound !== null && unitOfMeasurement.upperBound < Infinity) {
        newConstraints.push(ConstraintService.belowOrEqualTo(unitOfMeasurement.upperBound));
      }
      return newConstraints;
    }

    function getConstraintWithLowerBound(unitOfMeasurement) {
      if (unitOfMeasurement.upperBound === 100) {
        return ConstraintService.percentage();
      } else if (unitOfMeasurement.upperBound === 1) {
        return ConstraintService.decimal();
      } else {
        return ConstraintService.positive();
      }
    }

    function removeBoundConstraints(constraints) {
      return _.reject(constraints, function(constraint) {
        var label = constraint.label;
        return label === PROPORTION_PERCENTAGE || label === PROPORTION_DECIMAL ||
          label === BELOW_OR_EQUAL_TO || label === POSITIVE;
      });
    }

    function removeTextValue(inputCell) {
      var cell = angular.copy(inputCell);
      if (cell.inputParameters.id !== 'text' && isNotNumeric(cell.firstParameter)) {
        delete cell.firstParameter;
      }
      return cell;
    }

    return {
      getCellConstraint: getCellConstraint,
      getInputError: getInputError,
      getInputParameters: getInputParameters,
      getOptions: getOptions,
      inputToString: inputToString,
      removeTextValue: removeTextValue,
      saveCell: saveCell,
      updateParameterConstraints: updateParameterConstraints
    };
  };

  return dependencies.concat(EffectInputHelperService);
});
