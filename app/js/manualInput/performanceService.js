'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = [];
  var PerformanceService = function() {
    function buildExactPerformance(value, input) {
      return {
        type: 'exact',
        value: value,
        input: input
      };
    }

    function buildExactSEPerformance(firstParameter, secondParameter) {
      return buildExactPerformance(firstParameter, {
        value: firstParameter,
        stdErr: secondParameter
      });
    }

    function buildExactPercentSEPerformance(firstParameter, secondParameter) {
      return buildExactPerformance(firstParameter / 100, {
        value: firstParameter,
        stdErr: secondParameter,
        scale: 'percentage'
      });
    }

    function buildExactDecimalSEPerformance(firstParameter, secondParameter) {
      return buildExactPerformance(firstParameter, {
        value: firstParameter,
        stdErr: secondParameter,
        scale: 'decimal'
      });
    }

    function buildExactConfidencePerformance(cell) {
      return buildExactPerformance(cell.firstParameter, {
        value: cell.firstParameter,
        lowerBound: cell.lowerBoundNE ? 'NE' : cell.secondParameter,
        upperBound: cell.upperBoundNE ? 'NE' : cell.thirdParameter
      });
    }

    function buildExactPercentConfidencePerformance(cell) {
      return buildExactPerformance((cell.firstParameter / 100), {
        value: cell.firstParameter,
        lowerBound: cell.lowerBoundNE ? 'NE' : cell.secondParameter,
        upperBound: cell.upperBoundNE ? 'NE' : cell.thirdParameter,
        scale: 'percentage'
      });
    }

    function buildExactDecimalConfidencePerformance(cell) {
      return buildExactPerformance((cell.firstParameter), {
        value: cell.firstParameter,
        lowerBound: cell.lowerBoundNE ? 'NE' : cell.secondParameter,
        upperBound: cell.upperBoundNE ? 'NE' : cell.thirdParameter,
        scale: 'decimal'
      });
    }


    function buildGammaPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        return buildAlphaBetaPerformance('dgamma', cell.firstParameter, cell.secondParameter);
      }
    }

    function buildBetaPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        return buildAlphaBetaPerformance('dbeta', cell.firstParameter, cell.secondParameter);
      }
    }

    function buildNormalPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        return {
          type: 'dnorm',
          parameters: {
            mu: cell.firstParameter,
            sigma: cell.secondParameter
          }
        };
      }
    }

    function buildEmptyPerformance() {
      return {
        type: 'empty'
      };
    }

    function buildAlphaBetaPerformance(type, alpha, beta) {
      return {
        type: type,
        parameters: {
          alpha: alpha,
          beta: beta
        }
      };
    }

    function buildTextPerformance(cell) {
      return {
        type: 'empty',
        value: cell.firstParameter
      };
    }


    function buildValuePerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        if (isPercentage(cell)) {
          return buildPercentPerformance(cell);
        } else if (isDecimal(cell)) {
          return buildDecimalPerformance(cell);
        } else {
          return buildExactPerformance(cell.firstParameter);
        }
      }
    }

    function buildValueSEPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        if (isPercentage(cell)) {
          return buildExactPercentSEPerformance(cell.firstParameter, cell.secondParameter);
        } else if (isDecimal(cell)) {
          return buildExactDecimalSEPerformance(cell.firstParameter, cell.secondParameter);
        } else {
          return buildExactSEPerformance(cell.firstParameter, cell.secondParameter);
        }
      }
    }

    function buildValueCIPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        if (isPercentage(cell)) {
          return buildExactPercentConfidencePerformance(cell);
        } else if (isDecimal(cell)) {
          return buildExactDecimalConfidencePerformance(cell);
        } else {
          return buildExactConfidencePerformance(cell);
        }
      }
    }

    function buildEventsSampleSizePerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        var input = {
          events: cell.firstParameter,
          sampleSize: cell.secondParameter
        };
        return buildExactPerformance(cell.firstParameter / cell.secondParameter, input);
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
        } else if (isPercentage(cell)) {
          input.scale = 'percentage';
          value = value / 100;
        }
        return buildExactPerformance(value, input);
      }
    }

    function buildPercentPerformance(cell) {
      return buildExactPerformance(cell.firstParameter / 100, {
        scale: 'percentage',
        value: cell.firstParameter
      });
    }

    function buildDecimalPerformance(cell) {
      return buildExactPerformance(cell.firstParameter, {
        scale: 'decimal',
        value: cell.firstParameter
      });
    }

    function isPercentage(cell) {
      return cell.constraint === 'Proportion (percentage)';
    }

    function isDecimal(cell) {
      return cell.constraint === 'Proportion (decimal)';
    }

    return {
      buildNormalPerformance: buildNormalPerformance,
      buildBetaPerformance: buildBetaPerformance,
      buildGammaPerformance: buildGammaPerformance,
      buildEmptyPerformance: buildEmptyPerformance,
      buildTextPerformance: buildTextPerformance,
      buildValuePerformance: buildValuePerformance,
      buildValueSEPerformance: buildValueSEPerformance,
      buildValueCIPerformance: buildValueCIPerformance,
      buildEventsSampleSizePerformance: buildEventsSampleSizePerformance,
      buildValueSampleSizePerformance: buildValueSampleSizePerformance
    };
  };
  return dependencies.concat(PerformanceService);
});
