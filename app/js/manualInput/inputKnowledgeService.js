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

    function optionsBlock(
      id,
      label,
      firstParameter,
      secondParameter,
      thirdParameter,
      constraints,
      toString,
      buildPerformance,
      finishInputCell
    ) {
      this.id = id;
      this.label = label;
      this.firstParameter = firstParameter;
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

    function effectOptionsBlock(
      id,
      label,
      firstParameter,
      secondParameter,
      thirdParameter,
      constraints,
      toString,
      buildPerformance,
      finishInputCell,
      generateDistribution
    ) {
      optionsBlock.call(this,
        id,
        label,
        firstParameter,
        secondParameter,
        thirdParameter,
        constraints,
        toString,
        buildPerformance,
        finishInputCell);
      this.generateDistribution = generateDistribution;
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
      toString: ToStringService.eventsSampleSizeToString,
      buildPerformance: PerformanceService.buildEventsSampleSizePerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateEventsSampleSizeDistribution,
        BETA)
    };
    EVENTS_SAMPLE_SIZE.finishInputCell = _.partial(FinishInputCellService.finishEventSampleSizeInputCell, EVENTS_SAMPLE_SIZE);

    var VALUE_SAMPLE_SIZE = {
      id: 'valueSampleSize',
      label: 'Value, sample size',
      firstParameter: buildDefined('Value'),
      secondParameter: buildIntegerAboveZero('Sample size'),
      constraints: true,
      toString: ToStringService.valueSampleSizeToString,
      buildPerformance: PerformanceService.buildValueSampleSizePerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateValueSampleSizeDistribution,
        VALUE)
    };
    VALUE_SAMPLE_SIZE.finishInputCell = _.partial(FinishInputCellService.finishValueSampleSizeCell, VALUE_SAMPLE_SIZE);

    var EMPTY = {
      id: 'empty',
      label: 'Empty cell',
      constraints: false,
      toString: ToStringService.emptyToString,
      buildPerformance: PerformanceService.buildEmptyPerformance,
      generateDistribution: GenerateDistributionService.generateEmptyDistribution
    };
    EMPTY.finishInputCell = _.partial(FinishInputCellService.finishEmptyCell, EMPTY);

    var TEXT = {
      id: 'text',
      label: 'Text',
      firstParameter: buildNotEmpty(),
      constraints: false,
      toString: ToStringService.textToString,
      buildPerformance: PerformanceService.buildTextPerformance,
      generateDistribution: GenerateDistributionService.generateEmptyDistribution
    };
    TEXT.finishInputCell = _.partial(FinishInputCellService.finishTextCell, TEXT);

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
