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
      }
    };

    var BETA = {
      id: 'beta',
      label: 'Beta',
      firstParameter: buildIntegerAboveZero('Alpha'),
      secondParameter: buildIntegerAboveZero('Beta'),
      constraints: false,
      fits: function(tableEntry) {
        return tableEntry.performance.type === 'dbeta' || tableEntry.performance.type === 'empty';
      },
      toString: function(cell) {
        return 'Beta(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
      },
      buildPerformance: buildBetaPerformance,
      finishInputCell: finishAlphaBetaCell
    };

    var GAMMA = {
      id: 'gamma',
      label: 'Gamma',
      firstParameter: buildFloatAboveZero('Alpha'),
      secondParameter: buildFloatAboveZero('Beta'),
      constraints: false,
      fits: function(tableEntry) {
        return tableEntry.performance.type === 'dgamma';
      },
      toString: function(cell) {
        return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
      },
      buildPerformance: buildGammaPerformance,
      finishInputCell: finishAlphaBetaCell
    };

    var NORMAL = {
      id: 'normal',
      label: 'Normal',
      firstParameter: buildDefined('Mean'),
      secondParameter: buildPositiveFloat('Standard error'),
      constraints: false,
      fits: function(tableEntry) {
        return tableEntry.performance.type === 'dnorm';
      },
      toString: function(cell) {
        return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
      },
      buildPerformance: buildNormalPerformance,
      finishInputCell: finishNormalInputCell
    };

    var VALUE_SAMPLE_SIZE = {
      id: 'valueSampleSize',
      label: 'Value, sample size',
      firstParameter: buildDefined('Value'),
      secondParameter: buildIntegerAboveZero('Sample size'),
      constraints: true,
      fits: function(tableEntry) {
        return tableEntry.performance.input &&
          tableEntry.performance.input.sampleSize &&
          !isFinite(tableEntry.performance.input.value);
      },
      toString: valueSampleSizeToString,
      finishInputCell: finishValueSampleSizeCell,
      buildPerformance: buildValueSampleSizePerformance
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
      fits: function(tableEntry) {
        return tableEntry.performance.input &&
          isFinite(tableEntry.performance.input.events) &&
          tableEntry.performance.input.sampleSize;
      },
      toString: function(cell) {
        return cell.firstParameter + ' / ' + cell.secondParameter;
      },
      finishInputCell: finishEventSampleSizeInputCell,
      buildPerformance: buildEventSampleSizePerformance
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

    function buildCellFinisher(options, knowledge) {
      return function(cell, tableEntry) {
        var correctOption = _.find(options, function(option) {
          return option.fits(tableEntry);
        });
        var inputCell = angular.copy(cell);
        inputCell.inputParameters = correctOption;
        return knowledge.getKnowledge(inputCell).finishInputCell(inputCell, tableEntry);
      };
    }

    // knowledge
    function buildValueKnowledge() {
      var id = 'value';
      var knowledge = buildExactKnowledge(id, 'Value');
      knowledge.fits = function(tableEntry) {
        return !tableEntry.performance.input || tableEntry.performance.type === 'empty';
      };
      return knowledge;
    }

    function buildExactKnowledge(id, label) {
      return {
        id: id,
        label: label,
        firstParameter: buildDefined('Value'),
        constraints: true,
        toString: valueToString,
        finishInputCell: finishValueCell,
        buildPerformance: buildValuePermance
      };
    }

    function buildValueSEKnowledge() {
      var id = 'valueSE';
      var knowledge = buildExactKnowledge(id, 'Value, SE');
      knowledge.fits = function(tableEntry) {
        return tableEntry.performance.input && isFinite(tableEntry.performance.input.stdErr);
      };
      knowledge.secondParameter = buildPositiveFloat('Standard error');
      knowledge.toString = valueSEToString;
      knowledge.finishInputCell = function(tableEntry) {
        return {
          firstParameter: tableEntry.performance.input.value,
          secondParameter: tableEntry.performance.input.stdErr
        };
      };
      knowledge.buildPerformance = function(cell) {
        if (cell.isInvalid) {
          return undefined;
        } else {
          if (isPercentage(cell)) {
            return PerformanceService.buildExactPercentSEPerformance(cell.firstParameter, cell.secondParameter);
          } else {
            return PerformanceService.buildExactSEPerformance(cell.firstParameter, cell.secondParameter);
          }
        }
      };
      return knowledge;
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
      knowledge.fits = function(tableEntry) {
        return tableEntry.performance.input &&
          (isFinite(tableEntry.performance.input.lowerBound) || tableEntry.performance.input.lowerBound === 'NE') &&
          (isFinite(tableEntry.performance.input.upperBound) || tableEntry.performance.input.upperBound === 'NE') &&
          tableEntry.performance.input.scale !== 'percentage';
      };
      knowledge.toString = valueCIToString;
      knowledge.finishInputCell = finishValueConfidenceIntervalCell;
      knowledge.buildPerformance = function(cell) {
        if (cell.isInvalid) {
          return undefined;
        } else {
          if (isPercentage(cell)) {
            return PerformanceService.buildExactPercentConfidencePerformance(cell);
          } else {
            return PerformanceService.buildExactConfidencePerformance(cell);
          }
        }
      };
      return knowledge;
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

    // math util
    function roundedStdErr(mu, sampleSize) {
      return significantDigits(stdErr(mu, sampleSize));
    }

    function stdErr(mu, sampleSize) {
      return Math.sqrt(mu * (1 - mu) / sampleSize);
    }

    function boundsToStandardError(lowerBound, upperBound) {
      return significantDigits((upperBound - lowerBound) / (2 * 1.96));
    }

    function standardDeviationToStandardError(standardDeviation, sampleSize) {
      return standardDeviation / Math.sqrt(sampleSize);
    }

    // interface
    return {
      getOptions: getOptions
    };

  };
  return dependencies.concat(InputKnowledgeService);
});
