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
        empty: EMPTY,
        text: TEXT
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
      generateDistribution: generateValueDistribution
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
      generateDistribution: generateValueSEDistribution
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
      generateDistribution: generateValueCIDistribution
    };

    function getDistributionOptions() {
      return {
        normal: NORMAL,
        beta: BETA,
        gamma: GAMMA,
        value: VALUE,
        empty: EMPTY,
        text: TEXT
      };
    }

    var EMPTY = {
      id: 'empty',
      label: 'Empty cell',
      constraints: false,
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

    var TEXT = {
      id: 'text',
      label: 'Text',
      firstParameter: buildNotEmpty(),
      constraints: false,
      toString: function(cell) {
        return cell.firstParameter;
      },
      finishInputCell: function(performance) {
        var inputCell = {
          inputParameters: TEXT,
          firstParameter: performance.value
        };
        return inputCell;
      },
      buildPerformance: function(cell) {
        return PerformanceService.buildTextPerformance(cell.firstParameter);
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
      toString: betaToString,
      buildPerformance: buildBetaPerformance,
      finishInputCell: finishBetaCell
    };

    function betaToString(cell) {
      return 'Beta(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
    }

    var GAMMA = {
      id: 'gamma',
      label: 'Gamma',
      firstParameter: buildFloatAboveZero('Alpha'),
      secondParameter: buildFloatAboveZero('Beta'),
      constraints: false,
      toString: gammaToString,
      buildPerformance: buildGammaPerformance,
      finishInputCell: finishGammaCell
    };

    function gammaToString(cell) {
      return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
    }

    var NORMAL = {
      id: 'normal',
      label: 'Normal',
      firstParameter: buildDefined('Mean'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: false,
      toString: normalToString,
      buildPerformance: buildNormalPerformance,
      finishInputCell: finishNormalInputCell
    };

    function normalToString(cell) {
      return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
    }

    var VALUE_SAMPLE_SIZE = {
      id: 'valueSampleSize',
      label: 'Value, sample size',
      firstParameter: buildDefined('Value'),
      secondParameter: buildIntegerAboveZero('Sample size'),
      constraints: true,
      toString: valueSampleSizeToString,
      finishInputCell: finishValueSampleSizeCell,
      buildPerformance: buildValueSampleSizePerformance,
      generateDistribution: generateValueSampleSizeDistribution
    };

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
      toString: eventsSampleSizeToString,
      finishInputCell: finishEventSampleSizeInputCell,
      buildPerformance: buildEventSampleSizePerformance,
      generateDistribution: generateEventsSampleSizeDistribution
    };

    function eventsSampleSizeToString(cell) {
      return cell.firstParameter + ' / ' + cell.secondParameter;
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
        } else if (isDecimal(cell)) {
          return buildDecimalPerformance(cell);
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
        } else if (isDecimal(cell)) {
          return PerformanceService.buildExactDecimalSEPerformance(cell.firstParameter, cell.secondParameter);
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
        } else if (isDecimal(cell)) {
          return PerformanceService.buildExactDecimalConfidencePerformance(cell);
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
        if (isDecimal(cell)) {
          input.scale = 'decimal';
        }
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

    function buildDecimalPerformance(cell) {
      return PerformanceService.buildExactPerformance(cell.firstParameter, {
        scale: 'decimal',
        value: cell.firstParameter
      });
    }

    // finish cell functions

    function finishValueCell(performance) {
      var cell = {
        inputParameters: VALUE
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

    function finishValueSE(performance) {
      var cell = {
        inputParameters: VALUE_STANDARD_ERROR
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

    function finishValueCI(performance) {
      var cell = {
        inputParameters: VALUE_CONFIDENCE_INTERVAL
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

    function finishValueSampleSizeCell(performance) {
      var cell = {
        inputParameters: VALUE_SAMPLE_SIZE
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

    function finishEventSampleSizeInputCell(performance) {
      var inputCell = {
        inputParameters: EVENTS_SAMPLE_SIZE,
        firstParameter: performance.input.events,
        secondParameter: performance.input.sampleSize
      };
      return inputCell;
    }

    function finishBetaCell(performance) {
      var inputCell = {
        inputParameters: BETA,
        firstParameter : performance.parameters.alpha,
        secondParameter : performance.parameters.beta
      };
      return inputCell;
    }

    function finishGammaCell(performance) {
      var inputCell = {
        inputParameters: GAMMA,
        firstParameter: performance.parameters.alpha,
        secondParameter: performance.parameters.beta
      };
      return inputCell;
    }

    function finishNormalInputCell(performance) {
      var inputCell = {
        inputParameters: NORMAL,
        firstParameter: performance.parameters.mu,
        secondParameter: performance.parameters.sigma
      };
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

    function isDecimal(cell) {
      return _.some(cell.inputParameters.firstParameter.constraints, ['label', 'Proportion (decimal)']);
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

    function buildNotEmpty() {
      return {
        label: 'Text',
        constraints: [ConstraintService.notEmpty()]
      };
    }

    return {
      getOptions: getOptions
    };

  };
  return dependencies.concat(InputKnowledgeService);
});
