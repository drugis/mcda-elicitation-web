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

    var NORMAL = {
      id: 'normal',
      label: 'Normal',
      firstParameter: buildDefined('Mean'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: false,
      toString: ToStringService.normalToString,
      buildPerformance: PerformanceService.buildNormalPerformance,
    };
    NORMAL.finishInputCell = _.partial(FinishInputCellService.finishNormalInputCell, NORMAL);

    var BETA = {
      id: 'beta',
      label: 'Beta',
      firstParameter: buildIntegerAboveZero('Alpha'),
      secondParameter: buildIntegerAboveZero('Beta'),
      constraints: false,
      toString: ToStringService.betaToString,
      buildPerformance: PerformanceService.buildBetaPerformance,
      finishInputCell: _.partial(FinishInputCellService.finishBetaCell, BETA)
    };
    BETA.finishInputCell = _.partial(FinishInputCellService.finishBetaCell, BETA);

    var GAMMA = {
      id: 'gamma',
      label: 'Gamma',
      firstParameter: buildFloatAboveZero('Alpha'),
      secondParameter: buildFloatAboveZero('Beta'),
      constraints: false,
      toString: ToStringService.gammaToString,
      buildPerformance: PerformanceService.buildGammaPerformance
    };
    GAMMA.finishInputCell = _.partial(FinishInputCellService.finishGammaCell, GAMMA);

    var VALUE = {
      id: 'value',
      label: 'Value',
      firstParameter: buildDefined('Value'),
      constraints: true,
      toString: ToStringService.valueToString,
      buildPerformance: PerformanceService.buildValuePerformance,
      generateDistribution: GenerateDistributionService.generateValueDistribution
    };
    VALUE.finishInputCell = _.partial(FinishInputCellService.finishValueCell, VALUE);

    var VALUE_STANDARD_ERROR = {
      id: 'valueSE',
      label: 'Value, SE',
      firstParameter: buildDefined('Value'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: true,
      toString: ToStringService.valueSEToString,
      buildPerformance: PerformanceService.buildValueSEPerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateValueSEDistribution,
        NORMAL)
    };
    VALUE_STANDARD_ERROR.finishInputCell = _.partial(FinishInputCellService.finishValueSE, VALUE_STANDARD_ERROR);

    var VALUE_CONFIDENCE_INTERVAL = {
      id: 'valueCI',
      label: 'Value, 95% C.I.',
      firstParameter: buildDefined('Value'),
      secondParameter: buildLowerBound(),
      thirdParameter: buildUpperBound(),
      constraints: true,
      toString: ToStringService.valueCIToString,
      buildPerformance: PerformanceService.buildValueCIPerformance,
      generateDistribution: _.partial(GenerateDistributionService.generateValueCIDistribution,
        NORMAL, VALUE)
    };
    VALUE_CONFIDENCE_INTERVAL.finishInputCell = _.partial(FinishInputCellService.finishValueCI, VALUE_CONFIDENCE_INTERVAL);

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
