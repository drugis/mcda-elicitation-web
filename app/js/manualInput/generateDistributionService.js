'use strict';
define(['angular'], function(angular) {
  var dependencies = [
    'significantDigits',
    'ConstraintService'
  ];
  var GenerateDistributionService = function(
    significantDigits,
    ConstraintService
  ) {
    function generateValueDistribution(cell) {
      return angular.copy(cell);
    }

    function generateValueCIDistribution(normalOption, valueOption, cell) {
      var distributionCell = angular.copy(cell);
      if (areBoundsSymmetric(distributionCell)) {
        distributionCell.inputParameters = normalOption;
        distributionCell.secondParameter = boundsToStandardError(cell.secondParameter, cell.thirdParameter);
        distributionCell.inputParameters.secondParameter.constraints = getConstraints(distributionCell, distributionCell.inputParameters.secondParameter.constraints);
      } else {
        distributionCell.inputParameters = valueOption;
        delete distributionCell.secondParameter;
      }
      distributionCell.inputParameters.firstParameter.constraints = getConstraints(distributionCell, distributionCell.inputParameters.firstParameter.constraints);
      delete distributionCell.thirdParameter;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function getConstraints(cell, constraints) {
      var newConstraints = angular.copy(constraints);
      if (cell.constraint === 'percentage') {
        newConstraints.push(ConstraintService.percentage());
      }
      if (cell.constraint === 'decimal') {
        newConstraints.push(ConstraintService.decimal());
      }
      return newConstraints;
    }

    function generateEmptyDistribution(cell) {
      return angular.copy(cell);
    }

    function generateRangeDistribution(options, cell) {
      var newCell = angular.copy(cell);
      newCell.inputParameters = options;
      return newCell;
    }

    function areBoundsSymmetric(cell) {
      return Math.abs(1 - (cell.firstParameter - cell.secondParameter) / (cell.thirdParameter - cell.firstParameter)) < 0.05;
    }

    function boundsToStandardError(lowerBound, upperBound) {
      return significantDigits((upperBound - lowerBound) / (2 * 1.96));
    }

    return {
      generateValueDistribution: generateValueDistribution,
      generateValueCIDistribution: generateValueCIDistribution,
      generateEmptyDistribution: generateEmptyDistribution,
      generateRangeDistribution: generateRangeDistribution
    };
  };
  return dependencies.concat(GenerateDistributionService);
});
