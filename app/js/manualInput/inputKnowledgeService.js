'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = [
    'ConstraintService',
    'PerformanceService',
    'GenerateDistributionService'
  ];
  var InputKnowledgeService = function(
    ConstraintService,
    PerformanceService,
    GenerateDistributionService
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

    var NORMAL = {
      id: 'normal',
      label: 'Normal',
      firstParameter: buildDefined('Mean'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: false,
      toString: normalToString,
      buildPerformance: PerformanceService.buildNormalPerformance,
      finishInputCell: finishNormalInputCell
    };

    var BETA = {
      id: 'beta',
      label: 'Beta',
      firstParameter: buildIntegerAboveZero('Alpha'),
      secondParameter: buildIntegerAboveZero('Beta'),
      constraints: false,
      toString: betaToString,
      buildPerformance: PerformanceService.buildBetaPerformance,
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
      buildPerformance: PerformanceService.buildGammaPerformance,
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
      buildPerformance: PerformanceService.buildNormalPerformance,
      finishInputCell: finishNormalInputCell
    };

    function normalToString(cell) {
      return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
    }

    var VALUE = {
      id: 'value',
      label: 'Value',
      firstParameter: buildDefined('Value'),
      constraints: true,
      toString: valueToString,
      finishInputCell: finishValueCell,
      buildPerformance: PerformanceService.buildValuePerformance,
      generateDistribution: GenerateDistributionService.generateValueDistribution
    };


    var VALUE_STANDARD_ERROR = {
      id: 'valueSE',
      label: 'Value, SE',
      firstParameter: buildDefined('Value'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: true,
      toString: valueSEToString,
      finishInputCell: finishValueSE,
      buildPerformance: PerformanceService.buildValueSEPerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateValueSEDistribution,
        NORMAL)
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
      buildPerformance: PerformanceService.buildValueCIPerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateValueCIDistribution,
        NORMAL, VALUE)
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
      buildPerformance: PerformanceService.buildEventsSampleSizePerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateEventsSampleSizeDistribution,
        BETA)
    };

    function eventsSampleSizeToString(cell) {
      return cell.firstParameter + ' / ' + cell.secondParameter;
    }

    var VALUE_SAMPLE_SIZE = {
      id: 'valueSampleSize',
      label: 'Value, sample size',
      firstParameter: buildDefined('Value'),
      secondParameter: buildIntegerAboveZero('Sample size'),
      constraints: true,
      toString: valueSampleSizeToString,
      finishInputCell: finishValueSampleSizeCell,
      buildPerformance: PerformanceService.buildValueSampleSizePerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateValueSampleSizeDistribution,
        VALUE)
    };

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
      buildPerformance: PerformanceService.buildEmptyPerformance,
      generateDistribution: GenerateDistributionService.generateEmptyDistribution
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
      generateDistribution: GenerateDistributionService.generateEmptyDistribution
    };

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
        firstParameter: performance.parameters.alpha,
        secondParameter: performance.parameters.beta
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
