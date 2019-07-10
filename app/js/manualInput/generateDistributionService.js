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

    function generateValueSEDistribution(normalOption, cell) {
      var distributionCell = angular.copy(cell);
      if (isPercentage(distributionCell)) {
        distributionCell.firstParameter = cell.firstParameter / 100;
        distributionCell.secondParameter = cell.secondParameter / 100;
      }
      distributionCell.inputParameters = normalOption;
      delete distributionCell.constraint;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
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

    function generateValueSampleSizeDistribution(valueOption, betaOption, cell) {
      var distributionCell = angular.copy(cell);
      if (isPercentage(cell) || isDecimal(cell)) {
        if (isPercentage(cell)) {
          distributionCell.firstParameter = distributionCell.firstParameter / 100;
        }
        distributionCell.firstParameter = Math.round(distributionCell.firstParameter * distributionCell.secondParameter);
        return generateEventsSampleSizeDistribution(betaOption, distributionCell);
      } else {
        distributionCell.inputParameters = valueOption;
        delete distributionCell.secondParameter;
        distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
        return distributionCell;
      }
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

    function getConstraints(cell) {
      var constraints = angular.copy(cell.inputParameters.firstParameter.constraints);
      var options = _.keyBy([
        ConstraintService.decimal(),
        ConstraintService.percentage()
      ], 'label');
      if (cell.constraint) {
        constraints.push(options[cell.constraint]);
      }
      return constraints;
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

    function isDecimal(cell) {
      return cell.constraint === 'Proportion (decimal)';
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
