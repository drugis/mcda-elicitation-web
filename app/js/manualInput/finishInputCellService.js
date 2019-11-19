'use strict';
define(['angular'], function() {
  var dependencies = [
    'ConstraintService',
    'significantDigits'
  ];
  var FinishInputCellService = function(
    ConstraintService,
    significantDigits
  ) {
    var percentageConstraint = ConstraintService.percentage();
    var decimalConstraint = ConstraintService.decimal();

    var PERCENTAGE = 'percentage';
    var DECIMAL = 'decimal';

    function finishValueCell(options, performance) {
      var cell = {
        inputParameters: options
      };
      var input = performance.input;
      if (input && input.scale === PERCENTAGE) {
        cell.firstParameter = significantDigits(performance.value * 100);
        cell.constraint = PERCENTAGE;
        cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
      } else {
        if (input && input.scale === DECIMAL) {
          cell.constraint = DECIMAL;
          cell.inputParameters.firstParameter.constraints.push(decimalConstraint);
        }
        cell.firstParameter = performance.value;
      }
      return cell;
    }

    function finishValueCI(options, performance) {
      var cell = {
        inputParameters: options
      };
      if (performance.input.scale === PERCENTAGE) {
        cell.constraint = PERCENTAGE;
        cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
      }
      if (performance.input.scale === DECIMAL) {
        cell.constraint = DECIMAL;
        cell.inputParameters.firstParameter.constraints.push(decimalConstraint);
      }
      cell.firstParameter = performance.input.value;

      if (performance.input.lowerBound === 'NE') {
        cell.lowerBoundNE = true;
      } else {
        cell.secondParameter = performance.input.lowerBound;
      }

      if (performance.input.upperBound === 'NE') {
        cell.upperBoundNE = true;
      } else {
        cell.thirdParameter = performance.input.upperBound;
      }

      return cell;
    }

    function finishBetaCell(options, performance) {
      var inputCell = {
        inputParameters: options,
        firstParameter: performance.parameters.alpha,
        secondParameter: performance.parameters.beta
      };
      return inputCell;
    }

    function finishGammaCell(options, performance) {
      var inputCell = {
        inputParameters: options,
        firstParameter: performance.parameters.alpha,
        secondParameter: performance.parameters.beta
      };
      return inputCell;
    }

    function finishNormalInputCell(options, performance) {
      var inputCell = {
        inputParameters: options,
      };
      if (performance.input) { 
        inputCell.firstParameter = performance.input.mu;
        inputCell.secondParameter = performance.input.sigma;
        inputCell.constraint = PERCENTAGE;
      } else {
        inputCell.firstParameter = performance.parameters.mu;
        inputCell.secondParameter = performance.parameters.sigma;
      }
      return inputCell;
    }

    function finishRangeEffectCell(options, performance) {
      return {
        inputParameters: options,
        firstParameter: performance.input.lowerBound,
        secondParameter: performance.input.upperBound
      };
    }

    function finishRangeDistributionCell(options, performance) {
      return {
        inputParameters: options,
        firstParameter: performance.parameters.lowerBound,
        secondParameter: performance.parameters.upperBound
      };
    }

    function finishEmptyCell(options) {
      return {
        inputParameters: options
      };
    }

    function finishTextCell(options, performance) {
      return {
        inputParameters: options,
        firstParameter: performance.value
      };
    }

    return {
      finishValueCell: finishValueCell,
      finishValueCI: finishValueCI,
      finishBetaCell: finishBetaCell,
      finishGammaCell: finishGammaCell,
      finishNormalInputCell: finishNormalInputCell,
      finishRangeEffectCell: finishRangeEffectCell,
      finishRangeDistributionCell: finishRangeDistributionCell,
      finishEmptyCell: finishEmptyCell,
      finishTextCell: finishTextCell
    };

  };
  return dependencies.concat(FinishInputCellService);
});
