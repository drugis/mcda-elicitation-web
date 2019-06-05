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
        value: buildValueKnowledge(),
        valueSE: buildValueSEKnowledge(),
        valueCI: buildValueConfidenceIntervalKnowledge(),
        valueSampleSize: VALUE_SAMPLE_SIZE,
        fraction: EVENTS_SAMPLE_SIZE,
        empty: EMPTY
      };
    }

    function getDistributionOptions() {
      return {
        normal: NORMAL,
        beta: BETA,
        gamma: GAMMA,
        value: buildValueKnowledge(),
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
          empty: true
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
      finishInputCell: finishAlphaBetaCell
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
      finishInputCell: finishAlphaBetaCell
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

    // knowledge
    function buildValueKnowledge() {
      var id = 'value';
      var knowledge = buildExactKnowledge(id, 'Value');
      knowledge.fits = fitValue;
      return knowledge;
    }

    function fitValue(tableEntry) {
      return !tableEntry.performance.input || tableEntry.performance.type === 'empty';
    }

    function buildExactKnowledge(id, label) {
      return {
        id: id,
        label: label,
        firstParameter: buildDefined('Value'),
        constraints: true,
        toString: valueToString,
        finishInputCell: finishValueCell,
        buildPerformance: buildValuePermance,
        generateDistribution: generateValueDistribution
      };
    }

    function buildValueSEKnowledge() {
      var id = 'valueSE';
      var knowledge = buildExactKnowledge(id, 'Value, SE');
      knowledge.fits = fitValueSE;
      knowledge.secondParameter = buildPositiveFloat('Standard error');
      knowledge.toString = valueSEToString;
      knowledge.finishInputCell = finishValueSE;
      knowledge.buildPerformance = buildValueSEPerformance;
      knowledge.generateDistribution = generateValueSEDistribution;
      return knowledge;
    }

    function fitValueSE(tableEntry) {
      return tableEntry.performance.input && isFinite(tableEntry.performance.input.stdErr);
    }

    function buildValueConfidenceIntervalKnowledge() {
      var id = 'valueCI';
      var knowledge = buildExactKnowledge(id, 'Value, 95% C.I.');
      knowledge.secondParameter = {
        label: 'Lower bound',
        constraints: [
          ConstraintService.defined(),
          ConstraintService.belowOrEqualTo('firstParameter')
        ]
      };
      knowledge.thirdParameter = {
        label: 'Upper bound',
        constraints: [
          ConstraintService.defined(),
          ConstraintService.aboveOrEqualTo('firstParameter')
        ]
      };
      knowledge.fits = fitValueCI;
      knowledge.toString = valueCIToString;
      knowledge.finishInputCell = finishValueConfidenceIntervalCell;
      knowledge.buildPerformance = buildValueCIPerformance;
      knowledge.generateDistribution = generateValueCIDistribution;
      return knowledge;
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
    function buildValuePermance(cell) {
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

    function finishValueCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.value;
      return inputCell;
    }

    function finishValueSE(tableEntry) {
      return {
        firstParameter: tableEntry.performance.input.value,
        secondParameter: tableEntry.performance.input.stdErr
      };
    }

    function finishValueConfidenceIntervalCell(tableEntry) {
      var cell = {};
      cell.firstParameter = tableEntry.performance.input.value;

      if (tableEntry.performance.input.lowerBound === 'NE') {
        cell.lowerBoundNE = true;
      } else {
        cell.secondParameter = tableEntry.performance.input.lowerBound;
      }

      if (tableEntry.performance.input.upperBound === 'NE') {
        cell.upperBoundNE = true;
      } else {
        cell.thirdParameter = tableEntry.performance.input.upperBound;
      }

      return cell;
    }

    function finishAlphaBetaCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.parameters.alpha;
      inputCell.secondParameter = tableEntry.performance.parameters.beta;
      return inputCell;
    }

    function finishValueSampleSizeCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.input.value;
      inputCell.secondParameter = tableEntry.performance.input.sampleSize;
      return inputCell;
    }

    function finishNormalInputCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.parameters.mu;
      inputCell.secondParameter = tableEntry.performance.parameters.sigma;
      return inputCell;
    }

    function finishEventSampleSizeInputCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.input.events;
      inputCell.secondParameter = tableEntry.performance.input.sampleSize;
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
