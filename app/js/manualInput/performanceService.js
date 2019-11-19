'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = ['significantDigits'];
  var PerformanceService = function(significantDigits) {
    function buildExactPerformance(value, input) {
      return {
        type: 'exact',
        value: value,
        input: input
      };
    }

    function buildExactConfidencePerformance(cell) {
      return buildExactPerformance(
        cell.firstParameter, {
        value: cell.firstParameter,
        lowerBound: cell.lowerBoundNE ? 'NE' : cell.secondParameter,
        upperBound: cell.upperBoundNE ? 'NE' : cell.thirdParameter
      });
    }

    function buildExactPercentConfidencePerformance(cell) {
      return buildExactPerformance(
        significantDigits(cell.firstParameter / 100), {
        value: cell.firstParameter,
        lowerBound: cell.lowerBoundNE ? 'NE' : cell.secondParameter,
        upperBound: cell.upperBoundNE ? 'NE' : cell.thirdParameter,
        scale: 'percentage'
      });
    }

    function buildExactDecimalConfidencePerformance(cell) {
      return buildExactPerformance(
        cell.firstParameter, {
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
        if (isPercentage(cell)) {
          return getNormalPercentagePerformance(cell);
        } else {
          return getNormalPerformance(cell);
        }
      }
    }

    function getNormalPerformance(cell) {
      return {
        type: 'dnorm',
        parameters: {
          mu: cell.firstParameter,
          sigma: cell.secondParameter
        }
      };
    }

    function getNormalPercentagePerformance(cell) {
      return {
        type: 'dnorm',
        parameters: {
          mu: significantDigits(cell.firstParameter / 100),
          sigma: significantDigits(cell.secondParameter / 100)
        },
        input: {
          mu: cell.firstParameter,
          sigma: cell.secondParameter,
          scale: 'percentage'
        }
      };
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

    function buildPercentPerformance(cell) {
      return buildExactPerformance(
        significantDigits(cell.firstParameter / 100), {
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

    function buildRangeEffectPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        var percentageModifier = isPercentage(cell) ? 100 : 1;
        var value = significantDigits((cell.firstParameter + cell.secondParameter) / (2 * percentageModifier));
        var input = {
          lowerBound: cell.firstParameter,
          upperBound: cell.secondParameter
        };
        if (isPercentage(cell)) {
          input.scale = 'percentage';
        }
        return buildExactPerformance(value, input);
      }
    }

    function buildRangeDistribtutionPerformance(cell) {
      if (cell.isInvalid) {
        return undefined;
      } else {
        var percentageModifier = isPercentage(cell) ? 100 : 1;
        return {
          type: 'range',
          parameters: {
            lowerBound: significantDigits(cell.firstParameter / percentageModifier),
            upperBound: significantDigits(cell.secondParameter / percentageModifier)
          }
        };
      }
    }

    function isPercentage(cell) {
      return cell.constraint === 'percentage';
    }

    function isDecimal(cell) {
      return cell.constraint === 'decimal';
    }

    return {
      buildNormalPerformance: buildNormalPerformance,
      buildBetaPerformance: buildBetaPerformance,
      buildGammaPerformance: buildGammaPerformance,
      buildEmptyPerformance: buildEmptyPerformance,
      buildTextPerformance: buildTextPerformance,
      buildValuePerformance: buildValuePerformance,
      buildValueCIPerformance: buildValueCIPerformance,
      buildRangeEffectPerformance: buildRangeEffectPerformance,
      buildRangeDistribtutionPerformance: buildRangeDistribtutionPerformance
    };
  };
  return dependencies.concat(PerformanceService);
});
