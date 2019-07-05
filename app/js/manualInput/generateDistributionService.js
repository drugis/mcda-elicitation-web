'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    'significantDigits'
  ];
  var GenerateDistributionService = function(significantDigits) {
    function generateValueDistribution(cell) {
      var distributionCell = angular.copy(cell);
      if (isPercentage(distributionCell)) {
        distributionCell.firstParameter = cell.firstParameter / 100;
      }
      
      distributionCell.inputParameters.firstParameter.constraints = removeConstraints(distributionCell.inputParameters.firstParameter.constraints);
      delete distributionCell.constraint;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateValueSEDistribution(normalOption, cell) {
      var distributionCell = angular.copy(cell);
      if (isPercentage(distributionCell)) {
        distributionCell.firstParameter = cell.firstParameter / 100;
        distributionCell.secondParameter = cell.secondParameter / 100;
      }

      distributionCell.inputParameters = normalOption;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell); 
      delete distributionCell.constraint;
      return distributionCell;
    }

    function generateValueCIDistribution(normalOption, valueOption, cell) {
      var distributionCell = angular.copy(cell);

      if (areBoundsSymmetric(distributionCell)) {
        distributionCell.inputParameters = normalOption;
        distributionCell.secondParameter = boundsToStandardError(cell.secondParameter, cell.thirdParameter);
      } else {
        distributionCell.inputParameters = valueOption;
        delete distributionCell.secondParameter;
      }
      delete distributionCell.thirdParameter;

      if (isPercentage(cell)) {
        distributionCell.firstParameter = distributionCell.firstParameter / 100;
        if (distributionCell.secondParameter) {
          distributionCell.secondParameter = distributionCell.secondParameter / 100;
        }
      }

      delete distributionCell.constraint;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateValueSampleSizeDistribution(valueOption, cell) {
      var distributionCell = angular.copy(cell);
      if (isPercentage(cell)) {
        distributionCell.firstParameter = distributionCell.firstParameter / 100;
      }
      distributionCell.inputParameters.firstParameter.constraints = removeConstraints(distributionCell.inputParameters.firstParameter.constraints);
      distributionCell.inputParameters = valueOption;
      delete distributionCell.secondParameter;
      delete distributionCell.constraint;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateEventsSampleSizeDistribution(betaOption, cell) {
      var distributionCell = angular.copy(cell);
      distributionCell.inputParameters = betaOption;
      distributionCell.firstParameter = cell.firstParameter + 1;
      distributionCell.secondParameter = cell.secondParameter - cell.firstParameter + 1;
      delete distributionCell.constraint;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateEmptyDistribution(cell) {
      return angular.copy(cell);
    }

    function removeConstraints(constraints) {
      return _.reject(constraints, function(constraint) {
        return constraint.label === 'Proportion (percentage)' || constraint.label === 'Proportion (decimal)';
      });
    }

    function areBoundsSymmetric(cell) {
      return (cell.thirdParameter + cell.secondParameter) / 2 === cell.firstParameter;
    }

    function boundsToStandardError(lowerBound, upperBound) {
      return significantDigits((upperBound - lowerBound) / (2 * 1.96));
    }

    function isPercentage(cell) {
      return cell.constraint === 'Proportion (percentage)';
    }

    return {
      generateValueDistribution: generateValueDistribution,
      generateValueSEDistribution: generateValueSEDistribution,
      generateValueCIDistribution: generateValueCIDistribution,
      generateValueSampleSizeDistribution: generateValueSampleSizeDistribution,
      generateEventsSampleSizeDistribution: generateEventsSampleSizeDistribution,
      generateEmptyDistribution: generateEmptyDistribution
    };
  };
  return dependencies.concat(GenerateDistributionService);
});
