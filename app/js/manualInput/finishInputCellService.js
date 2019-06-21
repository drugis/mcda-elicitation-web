'use strict';
define(['angular'], function() {
  var dependencies = [
    'ConstraintService'
  ];
  var FinishInputCellService = function(
    ConstraintService
  ) {

    function finishValueCell(options, performance) {
      var cell = {
        inputParameters: options
      };
      var input = performance.input;
      if (input && input.scale === 'percentage') {
        cell.firstParameter = performance.value * 100;
        cell.inputParameters.firstParameter.constraints.push(ConstraintService.percentage());
      } else {
        if (input && input.scale === 'decimal') {
          cell.inputParameters.firstParameter.constraints.push(ConstraintService.decimal());
        }
        cell.firstParameter = performance.value;
      }
      return cell;
    }

    function finishValueSE(options, performance) {
      var cell = {
        inputParameters: options
      };
      if (performance.input.scale === 'percentage') {
        cell.inputParameters.firstParameter.constraints.push(ConstraintService.percentage());
      }
      if (performance.input.scale === 'decimal') {
        cell.inputParameters.firstParameter.constraints.push(ConstraintService.decimal());
      }
      cell.firstParameter = performance.input.value;
      cell.secondParameter = performance.input.stdErr;
      return cell;
    }

    function finishValueCI(options, performance) {
      var cell = {
        inputParameters: options
      };
      if (performance.input.scale === 'percentage') {
        cell.inputParameters.firstParameter.constraints.push(ConstraintService.percentage());
      }
      if (performance.input.scale === 'decimal') {
        cell.inputParameters.firstParameter.constraints.push(ConstraintService.decimal());
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

    function finishValueSampleSizeCell(options, performance) {
      var cell = {
        inputParameters: options
      };
      if (performance.input.scale === 'percentage') {
        cell.inputParameters.firstParameter.constraints.push(ConstraintService.percentage());
      }
      if (performance.input.scale === 'decimal') {
        cell.inputParameters.firstParameter.constraints.push(ConstraintService.decimal());
      }
      cell.firstParameter = performance.input.value;
      cell.secondParameter = performance.input.sampleSize;
      return cell;
    }

    function finishEventSampleSizeInputCell(options, performance) {
      var inputCell = {
        inputParameters: options,
        firstParameter: performance.input.events,
        secondParameter: performance.input.sampleSize
      };
      return inputCell;
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
        firstParameter: performance.parameters.mu,
        secondParameter: performance.parameters.sigma
      };
      return inputCell;
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
      finishValueSE: finishValueSE,
      finishValueCI: finishValueCI,
      finishValueSampleSizeCell: finishValueSampleSizeCell,
      finishEventSampleSizeInputCell: finishEventSampleSizeInputCell,
      finishBetaCell: finishBetaCell,
      finishGammaCell: finishGammaCell,
      finishNormalInputCell: finishNormalInputCell,
      finishEmptyCell: finishEmptyCell,
      finishTextCell: finishTextCell
    };

  };
  return dependencies.concat(FinishInputCellService);
});
