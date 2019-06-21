'use strict';
define(['lodash'], function(_) {
  var dependencies = [
    'ConstraintService',
    'PerformanceService',
    'GenerateDistributionService',
    'FinishInputCellService',
    'ToStringService'
  ];
  var InputKnowledgeService = function(
    ConstraintService,
    PerformanceService,
    GenerateDistributionService,
    FinishInputCellService,
    ToStringService
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
        value:  VALUE,
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

    var NORMAL = new optionsBlock(
      'normal',
      'Normal',
      buildDefined('Mean'),
      buildPositiveFloat('Standard error'),
      undefined,
      false,
      ToStringService.normalToString,
      PerformanceService.buildNormalPerformance,
      FinishInputCellService.finishNormalInputCell
    );

    var BETA = new optionsBlock(
      'beta',
      'Beta',
      buildIntegerAboveZero('Alpha'),
      buildIntegerAboveZero('Beta'),
      undefined,
      false,
      ToStringService.betaToString,
      PerformanceService.buildBetaPerformance,
      FinishInputCellService.finishBetaCell
    );

    var GAMMA = new optionsBlock(
      'gamma',
      'Gamma',
      buildFloatAboveZero('Alpha'),
      buildFloatAboveZero('Beta'),
      undefined,
      false,
      ToStringService.gammaToString,
      PerformanceService.buildGammaPerformance,
      FinishInputCellService.finishGammaCell
    );

    var VALUE = new effectOptionsBlock(
      'value',
      'Value',
      buildDefined('Value'),
      undefined,
      undefined,
      true,
      ToStringService.valueToString,
      PerformanceService.buildValuePerformance,
      FinishInputCellService.finishValueCell,
      GenerateDistributionService.generateValueDistribution
    );

    var VALUE_STANDARD_ERROR = new effectOptionsBlock(
      'valueSE',
      'Value, SE',
      buildDefined('Value'),
      buildPositiveFloat('Standard error'),
      undefined,
      true,
      ToStringService.valueSEToString,
      PerformanceService.buildValueSEPerformance,
      FinishInputCellService.finishValueSE,
      _.partial(GenerateDistributionService.generateValueSEDistribution, NORMAL)
    );

    var VALUE_CONFIDENCE_INTERVAL = new effectOptionsBlock(
      'valueCI',
      'Value, 95% C.I.',
      buildDefined('Value'),
      buildLowerBound(),
      buildUpperBound(),
      true,
      ToStringService.valueCIToString,
      PerformanceService.buildValueCIPerformance,
      FinishInputCellService.finishValueCI,
      _.partial(GenerateDistributionService.generateValueCIDistribution, NORMAL, VALUE)
    );

    var EVENTS_SAMPLE_SIZE = new effectOptionsBlock(
      'eventsSampleSize',
      'Events / Sample size',
      buildEvents(),
      buildIntegerAboveZero('Sample size'),
      undefined,
      false,
      ToStringService.eventsSampleSizeToString,
      PerformanceService.buildEventsSampleSizePerformance,
      FinishInputCellService.finishEventSampleSizeInputCell,
      _.partial(GenerateDistributionService.generateEventsSampleSizeDistribution, BETA)
    );

    var VALUE_SAMPLE_SIZE = new effectOptionsBlock(
      'valueSampleSize',
      'Value, sample size',
      buildDefined('Value'),
      buildIntegerAboveZero('Sample size'),
      undefined,
      true,
      ToStringService.valueSampleSizeToString,
      PerformanceService.buildValueSampleSizePerformance,
      FinishInputCellService.finishValueSampleSizeCell,
      _.partial(GenerateDistributionService.generateValueSampleSizeDistribution, VALUE)
    );

    var EMPTY = new effectOptionsBlock(
      'empty',
      'Empty cell',
      undefined,
      undefined,
      undefined,
      false,
      ToStringService.emptyToString,
      PerformanceService.buildEmptyPerformance,
      FinishInputCellService.finishEmptyCell,
      GenerateDistributionService.generateEmptyDistribution
    );

    var TEXT = new effectOptionsBlock(
      'text',
      'Text',
      buildNotEmpty(),
      undefined,
      undefined,
      false,
      ToStringService.textToString,
      PerformanceService.buildTextPerformance,
      FinishInputCellService.finishTextCell,
      GenerateDistributionService.generateEmptyDistribution
    );

    /**********
     * public *
     **********/

    function getOptions(inputType) {
      return INPUT_TYPE_KNOWLEDGE[inputType].getOptions();
    }

    /***********
     * private *
     ***********/

    function optionsBlock(id, label, firstParameter, secondParameter, thirdParameter, constraints, toString, buildPerformance, finishInputCell) {
      this.id = id;
      this.label = label;
      if (firstParameter) {
        this.firstParameter = firstParameter;
      }
      if (secondParameter) {
        this.secondParameter = secondParameter;
      }
      if (thirdParameter) {
        this.thirdParameter = thirdParameter;
      }
      this.constraints = constraints;
      this.toString = toString;
      this.buildPerformance = buildPerformance;
      this.finishInputCell = _.partial(finishInputCell, this);
    }

    function effectOptionsBlock(id, label, firstParameter, secondParameter, thirdParameter, constraints, toString, buildPerformance, finishInputCell, generateDistribution) {
      optionsBlock.call(this, id, label, firstParameter, secondParameter, thirdParameter, constraints, toString, buildPerformance, finishInputCell);
      this.generateDistribution = generateDistribution;
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

    function buildEvents() {
      return {
        label: 'Events',
        constraints: [
          ConstraintService.defined(),
          ConstraintService.positive(),
          ConstraintService.integer(),
          ConstraintService.belowOrEqualTo('secondParameter')
        ]
      };
    }

    return {
      getOptions: getOptions
    };

  };
  return dependencies.concat(InputKnowledgeService);
});
