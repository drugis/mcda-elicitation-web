'use strict';
define(['lodash', 'angular'], function(_, angular) {
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
        if (isPercentage(cell)) {
          distributionCell.firstParameter = distributionCell.firstParameter / 100;
          distributionCell.secondParameter = distributionCell.secondParameter / 100;
        }
        delete distributionCell.constraint;
      } else {
        distributionCell.inputParameters = valueOption;
        distributionCell.inputParameters.firstParameter.constraints = getConstraints(cell);
        delete distributionCell.secondParameter;
      }
      delete distributionCell.thirdParameter;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function getConstraints(cell) {
      var constraints = angular.copy(cell.inputParameters.firstParameter.constraints);
      if(cell.constraint === 'percentage'){
        constraints.push(ConstraintService.percentage());
      }
      if(cell.constraint === 'decimal'){
        constraints.push(ConstraintService.decimal());
      }
      return constraints;
    }

    function generateEmptyDistribution(cell) {
      return angular.copy(cell);
    }


    function areBoundsSymmetric(cell) {
      return  Math.abs(1 - (cell.firstParameter - cell.secondParameter) / (cell.thirdParameter - cell.firstParameter) ) < 0.05;
    }

    function boundsToStandardError(lowerBound, upperBound) {
      return significantDigits((upperBound - lowerBound) / (2 * 1.96));
    }

    function isPercentage(cell) {
      return cell.constraint === 'percentage';
    }

    return {
      generateValueDistribution: generateValueDistribution,
      generateValueCIDistribution: generateValueCIDistribution,
      generateEmptyDistribution: generateEmptyDistribution
    };
  };
  return dependencies.concat(GenerateDistributionService);
});
