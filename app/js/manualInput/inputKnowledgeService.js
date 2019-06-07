'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    'ConstraintService',
    'PerformanceService',
    'significantDigits'
  ];
  var InputKnowledgeService = function(
    ConstraintService,
    PerformanceService,
    significantDigits
  ) {
    var INPUT_TYPE_KNOWLEDGE = {
      getKnowledge: function(inputType) {
        return this[inputType].getKnowledge();
      },
      distribution: {
        getOptions: getDistributionOptions
      },
      effect: {
        getOptions: getEffectOptions
      }
    };

    function getEffectOptions() {
      return {
        value: VALUE,
        valueSE: VALUE_STANDARD_ERROR,
        valueCI: VALUE_CONFIDENCE_INTERVAL,
        valueSampleSize: VALUE_SAMPLE_SIZE,
        eventsSampleSize: EVENTS_SAMPLE_SIZE,
        empty: EMPTY
      };
    }

    var VALUE = {
      id: 'value',
      label: 'Value',
      firstParameter: buildDefined('Value'),
      constraints: true,
      toString: valueToString,
      finishInputCell: finishValueCell,
      buildPerformance: buildValuePerformance,
      generateDistribution: generateValueDistribution,
      fits: fitValue
    };


    var VALUE_STANDARD_ERROR = {
      id: 'valueSE',
      label: 'Value, SE',
      firstParameter: buildDefined('Value'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: true,
      toString: valueSEToString,
      finishInputCell: finishValueSE,
      buildPerformance: buildValueSEPerformance,
      generateDistribution: generateValueSEDistribution,
      fits: fitValueSE
    };

    var VALUE_CONFIDENCE_INTERVAL = {
      id: 'valueCI',
      label: 'Value, 95% C.I.',
      firstParameter: buildDefined('Value'),
      secondParameter: buildLowerBound(),
      thirdParameter: buildUpperBound(),
      constraints: true,
      toString: valueCIToString,
      finishInputCell: finishValueCI,
      buildPerformance: buildValueCIPerformance,
      generateDistribution: generateValueCIDistribution,
      fits: fitValueCI
    };

    function getDistributionOptions() {
      return {
        normal: NORMAL,
        beta: BETA,
        gamma: GAMMA,
        value: VALUE,
        empty: EMPTY
      };
    }

    var EMPTY = {
      id: 'empty',
      label: 'Empty cell',
      constraints: false,
      fits: function(tableEntry) {
        return tableEntry.performance.type === 'empty';
      },
      toString: function() {
        return 'empty cell';
      },
      finishInputCell: function() {
        return {
          inputParameters: EMPTY
        };
      },
      buildPerformance: function() {
        return {
          type: 'empty'
        };
      },
      generateDistribution: function(cell) {
        return angular.copy(cell);
      }
    };

    var BETA = {
      id: 'beta',
      label: 'Beta',
      firstParameter: buildIntegerAboveZero('Alpha'),
      secondParameter: buildIntegerAboveZero('Beta'),
      constraints: false,
      fits: fitBeta,
      toString: betaToString,
      buildPerformance: buildBetaPerformance,
      finishInputCell: finishBetaCell
    };

    function betaToString(cell) {
      return 'Beta(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
    }

    function fitBeta(tableEntry) {
      return tableEntry.performance.type === 'dbeta' || tableEntry.performance.type === 'empty';
    }

    var GAMMA = {
      id: 'gamma',
      label: 'Gamma',
      firstParameter: buildFloatAboveZero('Alpha'),
      secondParameter: buildFloatAboveZero('Beta'),
      constraints: false,
      fits: fitGamma,
      toString: gammaToString,
      buildPerformance: buildGammaPerformance,
      finishInputCell: finishGammaCell
    };

    function fitGamma(tableEntry) {
      return tableEntry.performance.type === 'dgamma';
    }

    function gammaToString(cell) {
      return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
    }

    var NORMAL = {
      id: 'normal',
      label: 'Normal',
      firstParameter: buildDefined('Mean'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: false,
      fits: fitNormal,
      toString: normalToString,
      buildPerformance: buildNormalPerformance,
      finishInputCell: finishNormalInputCell
    };

    function fitNormal(tableEntry) {
      return tableEntry.performance.type === 'dnorm';
    }

    function normalToString(cell) {
      return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
    }

    var VALUE_SAMPLE_SIZE = {
      id: 'valueSampleSize',
      label: 'Value, sample size',
      firstParameter: buildDefined('Value'),
      secondParameter: buildIntegerAboveZero('Sample size'),
      constraints: true,
      fits: fitValueSampleSize,
      toString: valueSampleSizeToString,
      finishInputCell: finishValueSampleSizeCell,
      buildPerformance: buildValueSampleSizePerformance,
      generateDistribution: generateValueSampleSizeDistribution
    };

    function fitValueSampleSize(tableEntry) {
      return tableEntry.performance.input &&
        tableEntry.performance.input.sampleSize &&
        !isFinite(tableEntry.performance.input.value);
    }

    var EVENTS_SAMPLE_SIZE = {
      id: 'eventsSampleSize',
      label: 'Events / Sample size',
      firstParameter: {
        label: 'Events',
        constraints: [
          ConstraintService.defined(),
          ConstraintService.positive(),
          ConstraintService.integer(),
          ConstraintService.belowOrEqualTo('secondParameter')
        ]
      },
      secondParameter: buildIntegerAboveZero('Sample size'),
      constraints: false,
      fits: fitEventsSampleSize,
      toString: eventsSampleSizeToString,
      finishInputCell: finishEventSampleSizeInputCell,
      buildPerformance: buildEventSampleSizePerformance,
      generateDistribution: generateEventsSampleSizeDistribution
    };

    function eventsSampleSizeToString(cell) {
      return cell.firstParameter + ' / ' + cell.secondParameter;
    }

    function fitEventsSampleSize(tableEntry) {
      return tableEntry.performance.input &&
        isFinite(tableEntry.performance.input.events) &&
        tableEntry.performance.input.sampleSize;
    }
    /**********
     * public *
     **********/

    function getOptions(inputType) {
      return INPUT_TYPE_KNOWLEDGE[inputType].getOptions();
    }

    /***********
     * private *
     ***********/

    function fitValue(tableEntry) {
      return !tableEntry.performance.input || tableEntry.performance.type === 'empty';
    }

    function fitValueSE(tableEntry) {
      return tableEntry.performance.input && isFinite(tableEntry.performance.input.stdErr);
    }

    function buildUpperBound() {
      return {
        label: 'Upper bound',
        constraints: [
          ConstraintService.defined(),
          ConstraintService.aboveOrEqualTo('firstParameter')
        ]
      };
    }

    function buildLowerBound() {
      return {
        label: 'Lower bound',
        constraints: [
          ConstraintService.defined(),
          ConstraintService.belowOrEqualTo('firstParameter')
        ]
      };
    }

    function fitValueCI(tableEntry) {
      return tableEntry.performance.input &&
        (isFinite(tableEntry.performance.input.lowerBound) || tableEntry.performance.input.lowerBound === 'NE') &&
        (isFinite(tableEntry.performance.input.upperBound) || tableEntry.performance.input.upperBound === 'NE') &&
        tableEntry.performance.input.scale !== 'percentage';
    }

    // generate distributions
    function generateValueDistribution(cell) {
      var distributionCell = angular.copy(cell);
      if (isPercentage(distributionCell)) {
        distributionCell.firstParameter = cell.firstParameter / 100;
      }
      distributionCell.inputParameters.firstParameter.constraints = removeConstraints(distributionCell.inputParameters.firstParameter.constraints);
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateValueSEDistribution(cell) {
      var distributionCell = angular.copy(cell);

      if (isPercentage(distributionCell)) {
        distributionCell.firstParameter = cell.firstParameter / 100;
        distributionCell.secondParameter = cell.secondParameter / 100;
      }

      distributionCell.inputParameters.firstParameter.constraints = removeConstraints(distributionCell.inputParameters.firstParameter.constraints);
      distributionCell.inputParameters.secondParameter.constraints = removeConstraints(distributionCell.inputParameters.secondParameter.constraints);
      distributionCell.inputParameters = INPUT_TYPE_KNOWLEDGE.distribution.getOptions().normal;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateValueCIDistribution(cell) {
      var distributionCell = angular.copy(cell);

      if (areBoundsSymmetric(distributionCell)) {
        distributionCell.inputParameters = INPUT_TYPE_KNOWLEDGE.distribution.getOptions().normal;
        distributionCell.secondParameter = boundsToStandardError(cell.secondParameter, cell.thirdParameter);
      } else {
        distributionCell.inputParameters = INPUT_TYPE_KNOWLEDGE.distribution.getOptions().value;
        delete distributionCell.secondParameter;
      }
      delete distributionCell.thirdParameter;

      if (isPercentage(cell)) {
        distributionCell.firstParameter = distributionCell.firstParameter / 100;
        if (distributionCell.secondParameter) {
          distributionCell.secondParameter = distributionCell.secondParameter / 100;
        }
      }
      distributionCell.inputParameters.firstParameter.constraints = removeConstraints(distributionCell.inputParameters.firstParameter.constraints);
      if (distributionCell.secondParameter) {
        distributionCell.inputParameters.secondParameter.constraints = removeConstraints(distributionCell.inputParameters.secondParameter.constraints);
      }
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateValueSampleSizeDistribution(cell) {
      var distributionCell = angular.copy(cell);
      if (isPercentage(cell)) {
        distributionCell.firstParameter = distributionCell.firstParameter / 100;
      }
      distributionCell.inputParameters.firstParameter.constraints = removeConstraints(distributionCell.inputParameters.firstParameter.constraints);
      distributionCell.inputParameters = INPUT_TYPE_KNOWLEDGE.distribution.getOptions().value;
      delete distributionCell.secondParameter;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
    }

    function generateEventsSampleSizeDistribution(cell) {
      var distributionCell = angular.copy(cell);
      distributionCell.inputParameters = INPUT_TYPE_KNOWLEDGE.distribution.getOptions().beta;
      distributionCell.firstParameter = cell.firstParameter + 1;
      distributionCell.secondParameter = cell.secondParameter - cell.firstParameter + 1;
      distributionCell.label = distributionCell.inputParameters.toString(distributionCell);
      return distributionCell;
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

    // build performances
    function buildValuePerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        if (isPercentage(cell)) {
          return buildPercentPerformance(cell);
        } else {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        }
      }
    }

    function buildValueSEPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        if (isPercentage(cell)) {
          return PerformanceService.buildExactPercentSEPerformance(cell.firstParameter, cell.secondParameter);
        } else {
          return PerformanceService.buildExactSEPerformance(cell.firstParameter, cell.secondParameter);
        }
      }
    }

    function buildValueCIPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        if (isPercentage(cell)) {
          return PerformanceService.buildExactPercentConfidencePerformance(cell);
        } else {
          return PerformanceService.buildExactConfidencePerformance(cell);
        }
      }
    }

    function buildEventSampleSizePerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        var input = {
          events: cell.firstParameter,
          sampleSize: cell.secondParameter
        };
        return PerformanceService.buildExactPerformance(cell.firstParameter / cell.secondParameter, input);
      }
    }

    function buildValueSampleSizePerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        var value = cell.firstParameter;
        var sampleSize = cell.secondParameter;
        var input = {
          value: value,
          sampleSize: sampleSize
        };
        if (isPercentage(cell)) {
          input.scale = 'percentage';
          value = value / 100;
        }
        return PerformanceService.buildExactPerformance(value, input);
      }
    }

    function buildGammaPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        return PerformanceService.buildGammaPerformance(cell.firstParameter, cell.secondParameter);
      }
    }

    function buildBetaPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        return PerformanceService.buildBetaPerformance(cell.firstParameter, cell.secondParameter);
      }
    }

    function buildNormalPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        return PerformanceService.buildNormalPerformance(cell.firstParameter, cell.secondParameter);
      }
    }

    function buildPercentPerformance(cell) {
      return PerformanceService.buildExactPerformance(cell.firstParameter / 100, {
        scale: 'percentage',
        value: cell.firstParameter
      });
    }

    // finish cell functions

    function finishValueCell(performance) {
      var inputCell = {
        inputParameters: VALUE
      };
      inputCell.firstParameter = performance.value;
      return inputCell;
    }

    function finishValueSE(performance) {
      var inputCell = {
        inputParameters: VALUE_STANDARD_ERROR
      };
      inputCell.firstParameter = performance.input.value;
      inputCell.secondParameter = performance.input.stdErr;
      return inputCell;
    }

    function finishValueCI(performance) {
      var cell = {
        inputParameters: VALUE_CONFIDENCE_INTERVAL
      };
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

    function finishValueSampleSizeCell(performance) {
      var inputCell = {
        inputParameters: VALUE_SAMPLE_SIZE
      };
      inputCell.firstParameter = performance.input.value;
      inputCell.secondParameter = performance.input.sampleSize;
      return inputCell;
    }

    function finishEventSampleSizeInputCell(performance) {
      var inputCell = {
        inputParameters: EVENTS_SAMPLE_SIZE
      };
      inputCell.firstParameter = performance.input.events;
      inputCell.secondParameter = performance.input.sampleSize;
      return inputCell;
    }

    function finishBetaCell(performance) {
      var inputCell = {
        inputParameters: BETA
      };
      inputCell.firstParameter = performance.parameters.alpha;
      inputCell.secondParameter = performance.parameters.beta;
      return inputCell;
    }

    function finishGammaCell(performance) {
      var inputCell = {
        inputParameters: GAMMA
      };
      inputCell.firstParameter = performance.parameters.alpha;
      inputCell.secondParameter = performance.parameters.beta;
      return inputCell;
    }

    function finishNormalInputCell(performance) {
      var inputCell = {
        inputParameters: NORMAL
      };
      inputCell.firstParameter = performance.parameters.mu;
      inputCell.secondParameter = performance.parameters.sigma;
      return inputCell;
    }

    // to string 
    function valueToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      return cell.firstParameter + percentage;
    }

    function valueSEToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      return cell.firstParameter + percentage + ' (' + cell.secondParameter + percentage + ')';
    }

    function valueCIToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      var returnString = cell.firstParameter + percentage + ' (';
      if (cell.lowerBoundNE) {
        returnString += 'NE; ';
      } else {
        returnString += cell.secondParameter + percentage + '; ';
      }
      if (cell.upperBoundNE) {
        returnString += 'NE)';
      } else {
        returnString += cell.thirdParameter + percentage + ')';
      }
      return returnString;
    }

    function valueSampleSizeToString(cell) {
      var percentage = isPercentage(cell) ? '%' : '';
      var value = cell.firstParameter;
      var sampleSize = cell.secondParameter;
      var returnString = value + percentage + ' (' + sampleSize + ')';
      return returnString;
    }

    function isPercentage(cell) {
      return _.some(cell.inputParameters.firstParameter.constraints, ['label', 'Proportion (percentage)']);
    }

    // constraints
    function buildIntegerAboveZero(label) {
      var param = buildFloatAboveZero(label);
      param.constraints.push(ConstraintService.integer());
      return param;
    }

    function buildPositiveFloat(label) {
      var param = buildDefined(label);
      param.constraints.push(ConstraintService.positive());
      return param;
    }

    function buildFloatAboveZero(label) {
      var param = buildDefined(label);
      param.constraints.push(ConstraintService.above(0));
      return param;
    }

    function buildDefined(label) {
      return {
        label: label,
        constraints: [ConstraintService.defined()]
      };
    }

    return {
      getOptions: getOptions
    };

  };
  return dependencies.concat(InputKnowledgeService);
});
