'use strict';
define(['lodash', 'angular'], function(_, angular) {
  var dependencies = ['ConstraintService', 'PerformanceService'];
  var InputKnowledgeService = function(ConstraintService, PerformanceService) {
    var NO_DISTRIBUTION = '\nDistribution: none';

    var INPUT_TYPE_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.inputType].getKnowledge(cell);
      },
      distribution: {
        getKnowledge: function(cell) {
          return DISTRIBUTION_KNOWLEDGE.getKnowledge(cell);
        }
      },
      effect: {
        getKnowledge: function(cell) {
          return EFFECT_KNOWLEDGE.getKnowledge(cell);
        }
      }
    };

    var DICHOTOMOUS_EFFECT_DECIMAL = {
      id: 'dichotomousDecimal',
      label: 'Decimal',
      firstParameter: buildPositiveWithMax('Value', 1.0),
      fits: function(tableEntry) {
        return !tableEntry.performance.input;
      },
      toString: valueToString,
      finishInputCell: finishValueCell,
      buildPerformance: function(cell) {
        return PerformanceService.buildExactPerformance(cell.firstParameter);
      }
    };

    var DICHOTOMOUS_EFFECT_DECIMAL_SAMPLE_SIZE = {
      id: 'dichotomousDecimalSampleSize',
      label: 'Decimal, sample size',
      firstParameter: buildPositiveWithMax('Value', 1.0),
      secondParameter: buildIntegerAboveZero('Sample size'),
      canBeNormal: true,
      fits: function(tableEntry) {
        return tableEntry.performance.input &&
          tableEntry.performance.input.sampleSize &&
          !isFinite(tableEntry.performance.input.events) &&
          tableEntry.performance.input.scale !== 'percentage';
      },
      toString: function(cell) {
        var proportion = cell.firstParameter;
        var sampleSize = cell.secondParameter;
        var returnString = proportion + ' (' + sampleSize + ')';
        if (cell.isNormal) {
          var sigma = roundedStdErr(proportion, sampleSize);
          returnString += '\nNormal(' + proportion + ', ' + sigma + ')';
        } else {
          returnString += NO_DISTRIBUTION;
        }
        return returnString;
      },
      finishInputCell: finishProportionSampleSizeCell,
      buildPerformance: function(cell) {
        var proportion = cell.firstParameter;
        var sampleSize = cell.secondParameter;
        var input = {
          value: proportion,
          sampleSize: sampleSize
        };
        if (cell.isNormal) {
          var sigma = stdErr(proportion, sampleSize);
          return PerformanceService.buildNormalPerformance(proportion, sigma, input);
        } else {
          return PerformanceService.buildExactPerformance(proportion, input);
        }
      }
    };

    var DICHOTOMOUS_EFFECT_PERCENTAGE = {
      id: 'dichotomousPercentage',
      label: 'Percentage',
      firstParameter: buildPositiveWithMax('Value', 100),
      fits: function(tableEntry) {
        return tableEntry.performance.input &&
          !tableEntry.performance.input.sampleSize &&
          tableEntry.performance.input.scale === 'percentage';
      },
      toString: function(cell) {
        return cell.firstParameter + '%' + NO_DISTRIBUTION;
      },
      finishInputCell: function(cell, tableEntry) {
        var inputCell = angular.copy(cell);
        inputCell.firstParameter = tableEntry.performance.input.value;
        return inputCell;
      },
      buildPerformance: function(cell) {
        return PerformanceService.buildExactPerformance(cell.firstParameter / 100, {
          value: cell.firstParameter,
          scale: 'percentage'
        });
      }
    };

    var DICHOTOMOUS_EFFECT_PERCENTAGE_SAMPLE_SIZE = {
      id: 'dichotomousPercentageSampleSize',
      label: 'Percentage, sample size',
      firstParameter: buildPositiveWithMax('Value', 100),
      secondParameter: buildIntegerAboveZero('Sample size'),
      canBeNormal: true,
      fits: function(tableEntry) {
        return tableEntry.performance.input &&
          tableEntry.performance.input.sampleSize &&
          tableEntry.performance.input.scale === 'percentage';
      },
      toString: function(cell) {
        var percentage = cell.firstParameter;
        var sampleSize = cell.secondParameter;
        var returnString = percentage + '% (' + sampleSize + ')';
        if (cell.isNormal) {
          var proportion = percentage / 100;
          var sigma = roundedStdErr(proportion, sampleSize);
          returnString += '\nNormal(' + proportion + ', ' + sigma + ')';
        } else {
          returnString += NO_DISTRIBUTION;
        }
        return returnString;
      },
      finishInputCell: finishProportionSampleSizeCell,
      buildPerformance: function(cell) {
        var proportion = cell.firstParameter / 100;
        var sampleSize = cell.secondParameter;
        var input = {
          value: cell.firstParameter,
          sampleSize: cell.secondParameter,
          scale: 'percentage'
        };
        if (cell.isNormal) {
          var sigma = stdErr(proportion, sampleSize);
          return PerformanceService.buildNormalPerformance(proportion, sigma, input);
        } else {
          return PerformanceService.buildExactPerformance(proportion, input);
        }
      }
    };

    var DICHOTOMOUS_EFFECT_FRACTION = {
      id: 'dichotomousFraction',
      label: 'Fraction',
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
      canBeNormal: true,
      fits: function(tableEntry) {
        return tableEntry.performance.input &&
          isFinite(tableEntry.performance.input.events) &&
          tableEntry.performance.input.sampleSize;
      },
      toString: function(cell) {
        var sampleSize = cell.secondParameter;
        var returnString = cell.firstParameter + ' / ' + sampleSize;
        if (cell.isNormal) {
          var proportion = cell.firstParameter / sampleSize;
          var sigma = roundedStdErr(proportion, sampleSize);
          returnString += '\nNormal(' + proportion + ', ' + sigma + ')';
        } else {
          returnString += NO_DISTRIBUTION;
        }
        return returnString;
      },
      finishInputCell: function(cell, tableEntry) {
        var inputCell = angular.copy(cell);
        inputCell.firstParameter = tableEntry.performance.input.events;
        inputCell.secondParameter = tableEntry.performance.input.sampleSize;
        inputCell.isNormal = tableEntry.performance.type === 'dnorm';
        return inputCell;
      },
      buildPerformance: function(cell) {
        var input = {
          events: cell.firstParameter,
          sampleSize: cell.secondParameter
        };
        if (cell.isNormal) {
          var mu = cell.firstParameter / cell.secondParameter;
          var sigma = stdErr(mu, cell.secondParameter);
          return PerformanceService.buildNormalPerformance(mu, sigma, input);
        } else {
          return PerformanceService.buildExactPerformance(cell.firstParameter / cell.secondParameter, input);
        }
      }
    };

    var DISTRIBUTION_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.inputMethod].getKnowledge(cell);
      },
      assistedDistribution: {
        getKnowledge: function(cell) {
          return ASSISTED_DISTRIBUTION_KNOWLEDGE.getKnowledge(cell);
        }
      },
      manualDistribution: buildKnowledge({
        manualBeta: {
          id: 'manualBeta',
          label: 'Beta',
          firstParameter: buildIntegerAboveZero('alpha'),
          secondParameter: buildIntegerAboveZero('beta'),
          fits: function(tableEntry) {
            return tableEntry.performance.type === 'dbeta';
          },
          toString: function(cell) {
            return 'Beta(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
          },
          buildPerformance: function(cell) {
            return PerformanceService.buildBetaPerformance(cell.firstParameter, cell.secondParameter);
          },
          finishInputCell: finishAlphaBetaCell
        },
        manualNormal: {
          id: 'manualNormal',
          label: 'Normal',
          firstParameter: buildDefined('mean'),
          secondParameter: buildPositiveFloat('Standard error'),
          fits: function(tableEntry) {
            return tableEntry.performance.type === 'dnorm';
          },
          toString: function(cell) {
            return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
          },
          buildPerformance: function(cell) {
            return PerformanceService.buildNormalPerformance(cell.firstParameter, cell.secondParameter);
          },
          finishInputCell: function(cell, tableEntry) {
            var inputCell = angular.copy(cell);
            inputCell.firstParameter = tableEntry.performance.parameters.mu;
            inputCell.secondParameter = tableEntry.performance.parameters.sigma;
            return inputCell;
          }
        },
        manualGamma: {
          id: 'manualGamma',
          label: 'Gamma',
          firstParameter: buildFloatAboveZero('alpha'),
          secondParameter: buildFloatAboveZero('beta'),
          fits: function(tableEntry) {
            return tableEntry.performance.type === 'dgamma';
          },
          toString: function(cell) {
            return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
          },
          buildPerformance: function(cell) {
            return PerformanceService.buildGammaPerformance(cell.firstParameter, cell.secondParameter);
          },
          finishInputCell: finishAlphaBetaCell
        },
        manualExact: {
          id: 'manualExact',
          label: 'Exact',
          firstParameter: buildDefined('Value'),
          fits: function(tableEntry) {
            return tableEntry.performance.type === 'exact';
          },
          toString: function(cell) {
            return 'exact(' + cell.firstParameter + ')';
          },
          buildPerformance: function(cell) {
            return PerformanceService.buildExactPerformance(cell.firstParameter);
          },
          finishInputCell: finishValueCell
        }
      })
    };
    var CONTINUOUS_EFFECT_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.parameterOfInterest].getKnowledge(cell);
      },
      mean: buildKnowledge({
        exactValue: buildExactValueKnowledge('Mean'),
        exactValueSE: _.extend(buildExactValueSEKnowledge('Mean'), {
          canBeNormal: true
        }),
        exactValueCI: _.extend(buildExactValueConfidenceIntervalKnowledge('Mean'), {
          canBeNormal: true
        })
      }),
      median: buildKnowledge({
        exactValue: buildExactValueKnowledge('Median'),
        exactValueCI: buildExactValueConfidenceIntervalKnowledge('Median')
      }),
      cumulativeProbability: buildKnowledge(function() {
        var decimal = buildExactValueKnowledge('Decimal', 'decimal');
        decimal.firstParameter.constraints = decimal.firstParameter.constraints.concat(
          [ConstraintService.positive(),
          ConstraintService.belowOrEqualTo(1)]);
        var percentage = buildPercentageKnowledge();
        var decimalCI = addCeilConstraints(buildExactValueConfidenceIntervalKnowledge('Decimal', 'decimalCI'), 1);
        var percentageCI = addCeilConstraints(buildPercentageConfidenceIntervalKnowledge('Percentage', 'percentageCI'), 100);
        var retval = {
          decimal: decimal,
          decimalCI: decimalCI,
          percentage: percentage,
          percentageCI: percentageCI
        };
        return retval;
      }()) //!!
    };

    var EFFECT_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.dataType].getKnowledge(cell);
      },
      dichotomous: buildKnowledge({
        dichotomousDecimal: DICHOTOMOUS_EFFECT_DECIMAL,
        dichotomousDecimalSampleSize: DICHOTOMOUS_EFFECT_DECIMAL_SAMPLE_SIZE,
        dichotomousPercentage: DICHOTOMOUS_EFFECT_PERCENTAGE,
        dichotomousPercentageSampleSize: DICHOTOMOUS_EFFECT_PERCENTAGE_SAMPLE_SIZE,
        dichotomousFraction: DICHOTOMOUS_EFFECT_FRACTION
      }),
      continuous: CONTINUOUS_EFFECT_KNOWLEDGE,
      other: buildKnowledge({
        exactValue: buildExactValueKnowledge('Value'),
        exactValueSE: buildExactValueSEKnowledge('Value'),
        exactValueCI: buildExactValueConfidenceIntervalKnowledge('Value')
      })
    };

    var ASSISTED_DISTRIBUTION_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.dataType].getKnowledge(cell);
      },
      dichotomous: buildKnowledge({
        assistedDichotomous: {
          id: 'assistedDichotomous',
          label: 'dichotomous',
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
          fits: function() {
            return true;
          },
          toString: function(cell) {
            var events = cell.firstParameter;
            var sampleSize = cell.secondParameter;
            return events + ' / ' + sampleSize + '\nDistribution: Beta(' + (events + 1) + ', ' + (sampleSize - events + 1) + ')';
          },
          finishInputCell: function(cell, tableEntry) {
            var inputCell = angular.copy(cell);
            inputCell.firstParameter = tableEntry.performance.input.events;
            inputCell.secondParameter = tableEntry.performance.input.sampleSize;
            return inputCell;
          },
          buildPerformance: function(cell) {
            return PerformanceService.buildBetaPerformance(cell.firstParameter + 1, cell.secondParameter - cell.firstParameter + 1, {
              events: cell.firstParameter,
              sampleSize: cell.secondParameter
            });
          }
        }
      }),
      continuous: buildKnowledge({
        assistedContinuousStdErr: {
          id: 'assistedContinuousStdErr',
          label: 'Mean, SE, sample size',
          firstParameter: buildDefined('Mean'),
          secondParameter: buildPositiveFloat('Standard error'),
          thirdParameter: buildIntegerAboveZero('Sample size'),
          fits: function(tableEntry) {
            return !tableEntry.performance.input || tableEntry.performance.input.sigma === tableEntry.performance.stdErr;
          },
          toString: function(cell) {
            var mu = cell.firstParameter;
            var sigma = cell.secondParameter;
            var sampleSize = cell.thirdParameter;
            return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';
          },
          buildPerformance: function(cell) {
            return PerformanceService.buildStudentTPerformance(cell.firstParameter, cell.secondParameter, cell.thirdParameter - 1, {
              mu: cell.firstParameter,
              sigma: cell.secondParameter,
              sampleSize: cell.thirdParameter
            });
          },
          finishInputCell: finishStudentsTCell
        },
        assistedContinuousStdDev: {
          id: 'assistedContinuousStdDev',
          label: 'Mean, SD, sample size',
          firstParameter: buildDefined('Mean'),
          secondParameter: buildPositiveFloat('Standard deviation'),
          thirdParameter: buildIntegerAboveZero('Sample size'),
          fits: function(tableEntry) {
            return tableEntry.performance.input && tableEntry.performance.input.sigma !== tableEntry.performance.stdErr;
          },
          toString: function(cell) {
            var mu = cell.firstParameter;
            var sigma = roundToThreeDigits(standardDeviationToStandardError(cell.secondParameter, cell.thirdParameter));
            var sampleSize = cell.thirdParameter;
            return mu + ' (' + cell.secondParameter + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';
          },
          buildPerformance: function(cell) {
            return PerformanceService.buildStudentTPerformance(cell.firstParameter, standardDeviationToStandardError(cell.secondParameter, cell.thirdParameter), cell.thirdParameter - 1, {
              mu: cell.firstParameter,
              sigma: cell.secondParameter,
              sampleSize: cell.thirdParameter
            });
          },
          finishInputCell: finishStudentsTCell
        }
      })
    };

    /**********
     * public *
     **********/
    function buildPerformance(cell) {
      return getKnowledge(cell).buildPerformance(cell);
    }

    function finishInputCell(inputMetaData, tableEntry) {
      return getKnowledge(inputMetaData).finishInputCell(inputMetaData, tableEntry);
    }

    function inputToString(cell) {
      return getKnowledge(cell).toString(cell);
    }

    function getOptions(cell) {
      var leafCell = _.omit(cell, ['inputParameters']); // don't go to knowledge leaves
      return getKnowledge(leafCell).getOptions();
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

    function buildPercentPerformance(cell) {
      return PerformanceService.buildExactPerformance(cell.firstParameter / 100, {
        scale: 'percentage', value: cell.firstParameter
      });
    }

    // knowledge

    function getKnowledge(cell) {
      return INPUT_TYPE_KNOWLEDGE.getKnowledge(cell);
    }

    function buildKnowledge(options) {
      var knowledge = {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this.getOptions()[cell.inputParameters.id] : {
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          };
        },
        getOptions: function() {
          return options;
        }
      };
      knowledge.finishInputCell = buildCellFinisher(options, knowledge);
      return knowledge;
    }

    function buildExactKnowledge(id, label) {
      return {
        id: id,
        label: label,
        firstParameter: buildDefined('Value'),
        toString: valueToString,
        finishInputCell: finishValueCell,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        }
      };
    }

    function buildExactValueKnowledge(label, id) {
      id = id ? id : 'exactValue';
      var knowledge = buildExactKnowledge(id, label);
      knowledge.fits = function(tableEntry) {
        return !tableEntry.performance.input;
      };
      return knowledge;
    }

    function buildExactValueSEKnowledge(label, id) {
      id = id ? id : 'exactValueSE';
      var knowledge = buildExactKnowledge(id, label + ', SE');
      knowledge.fits = function(tableEntry) {
        return tableEntry.performance.input && isFinite(tableEntry.performance.input.stdErr);
      };
      knowledge.secondParameter = buildPositiveFloat('Standard error');
      knowledge.toString = valueSEToString;
      knowledge.finishInputCell = function(cell, tableEntry) {
        var inputCell = angular.copy(cell);
        inputCell.firstParameter = tableEntry.performance.input.value;
        inputCell.secondParameter = tableEntry.performance.input.stdErr;
        inputCell.isNormal = tableEntry.performance.type === 'dnorm';
        return inputCell;
      };
      knowledge.buildPerformance = function(cell) {
        if (cell.isNormal) {
          return PerformanceService.buildNormalPerformance(cell.firstParameter, cell.secondParameter, {
            value: cell.firstParameter,
            stdErr: cell.secondParameter
          });
        } else {
          return PerformanceService.buildExactPerformance(cell.firstParameter, {
            value: cell.firstParameter,
            stdErr: cell.secondParameter
          });
        }
      };
      return knowledge;
    }

    function buildExactValueConfidenceIntervalKnowledge(label, id) {
      id = id ? id : 'exactValueCI';
      var knowledge = buildExactKnowledge(id, (label + ', 95% C.I.'));
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
        if (cell.isNormal) {
          return PerformanceService.buildNormalPerformance(cell.firstParameter, boundsToStandardError(cell.secondParameter, cell.thirdParameter), {
            value: cell.firstParameter,
            lowerBound: cell.secondParameter,
            upperBound: cell.thirdParameter
          });
        } else {
          return PerformanceService.buildExactConfidencePerformance(cell);
        }
      };
      return knowledge;
    }

    function buildPercentageConfidenceIntervalKnowledge(label, id) {
      var knowledge = buildExactValueConfidenceIntervalKnowledge(label, id);
      knowledge.toString = valueCIPercentToString;
      knowledge.buildPerformance = function(cell) {
        return PerformanceService.buildExactPerformance((cell.firstParameter / 100), {
          value: cell.firstParameter,
          lowerBound: cell.secondParameter,
          upperBound: cell.thirdParameter,
          scale: 'percentage'
        });
      };
      knowledge.fits = function(tableEntry) {
        return tableEntry.performance.input &&
          (isFinite(tableEntry.performance.input.lowerBound) || tableEntry.performance.input.lowerBound === 'NE') &&
          (isFinite(tableEntry.performance.input.upperBound) || tableEntry.performance.input.upperBound === 'NE') &&
          tableEntry.performance.input.scale === 'percentage';
      };
      return knowledge;
    }

    function buildPercentageKnowledge() {
      var knowledge = buildExactValueKnowledge('Percentage', 'percentage');
      knowledge.firstParameter.constraints = knowledge.firstParameter.constraints.concat(ConstraintService.positive(), [ConstraintService.belowOrEqualTo(100)]);
      knowledge.toString = valuePercentToString;
      knowledge.buildPerformance = buildPercentPerformance;
      knowledge.fits = function(tableEntry) {
        return tableEntry.performance.input &&
          tableEntry.performance.input.value &&
          !tableEntry.performance.input.lowerBound &&
          tableEntry.performance.input.scale === 'percentage';
      };
      return knowledge;
    }

    // finish cell functions

    function finishValueCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.value;
      return inputCell;
    }

    function finishValueConfidenceIntervalCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.input.value;
      if (tableEntry.performance.input.lowerBound === 'NE') {
        inputCell.lowerBoundNE = true;
      } else {
        inputCell.secondParameter = tableEntry.performance.input.lowerBound;
      }
      if (tableEntry.performance.input.upperBound === 'NE') {
        inputCell.upperBoundNE = true;
      } else {
        inputCell.thirdParameter = tableEntry.performance.input.upperBound;
      }
      inputCell.isNormal = tableEntry.performance.type === 'dnorm';
      return inputCell;
    }

    function finishStudentsTCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      if (tableEntry.performance.input) {
        inputCell.firstParameter = tableEntry.performance.input.mu;
        inputCell.secondParameter = tableEntry.performance.input.sigma;
        inputCell.thirdParameter = tableEntry.performance.input.sampleSize;
      } else {
        inputCell.firstParameter = tableEntry.performance.parameters.mu;
        inputCell.secondParameter = tableEntry.performance.parameters.stdErr;
        inputCell.thirdParameter = tableEntry.performance.parameters.dof + 1;
      }
      return inputCell;
    }

    function finishAlphaBetaCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.parameters.alpha;
      inputCell.secondParameter = tableEntry.performance.parameters.beta;
      return inputCell;
    }

    function finishProportionSampleSizeCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.input.value;
      inputCell.secondParameter = tableEntry.performance.input.sampleSize;
      inputCell.isNormal = tableEntry.performance.type === 'dnorm';
      return inputCell;
    }

    // to string 
    function valueToString(cell) {
      return cell.firstParameter + NO_DISTRIBUTION;
    }

    function valuePercentToString(cell) {
      return cell.firstParameter + '%' + NO_DISTRIBUTION;
    }

    function valueSEToString(cell) {
      var returnString = cell.firstParameter + ' (' + cell.secondParameter + ')';
      if (cell.isNormal) {
        return returnString + '\nNormal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
      }
      return returnString + NO_DISTRIBUTION;
    }

    function valueCIToString(cell) {
      var returnString = cell.firstParameter + ' (';
      if (cell.lowerBoundNE) {
        returnString += 'NE; ';
      } else {
        returnString += cell.secondParameter + '; ';
      }
      if (cell.upperBoundNE) {
        returnString += 'NE)';
      } else {
        returnString += cell.thirdParameter + ')';
      }
      if (cell.isNormal) {
        return returnString + '\nNormal(' + cell.firstParameter + ', ' + boundsToStandardError(cell.secondParameter, cell.thirdParameter) + ')';
      }
      return returnString + NO_DISTRIBUTION;
    }

    function valueCIPercentToString(cell) {
      var returnString = cell.firstParameter + '% (';
      if (cell.lowerBoundNE) {
        returnString += 'NE; ';
      } else {
        returnString += cell.secondParameter + '%; ';
      }
      if (cell.upperBoundNE) {
        returnString += 'NE)';
      } else {
        returnString += cell.thirdParameter + '%)';
      }
      return returnString + NO_DISTRIBUTION;
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

    function buildPositiveWithMax(label, max) {
      var param = buildFloatAboveZero(label);
      param.constraints.push(ConstraintService.belowOrEqualTo(max));
      return param;
    }

    function addCeilConstraints(knowledge, ceil) {
      knowledge.firstParameter.constraints = knowledge.firstParameter.constraints.concat([ConstraintService.positive(), ConstraintService.belowOrEqualTo(ceil)]);
      knowledge.secondParameter.constraints = knowledge.secondParameter.constraints.concat([ConstraintService.positive(), ConstraintService.belowOrEqualTo(ceil)]);
      knowledge.thirdParameter.constraints = knowledge.thirdParameter.constraints.concat([ConstraintService.positive(), ConstraintService.belowOrEqualTo(ceil)]);
      return knowledge;
    }

    // math util
    function stdErr(mu, sampleSize) {
      return mu * (1 - mu) / Math.sqrt(sampleSize);
    }

    function roundedStdErr(mu, sampleSize) {
      return roundToThreeDigits(stdErr(mu, sampleSize));
    }

    function boundsToStandardError(lowerBound, upperBound) {
      return roundToThreeDigits((upperBound - lowerBound) / (2 * 1.96));
    }

    function roundToThreeDigits(value) {
      return Math.round(value * 1000) / 1000;
    }

    function standardDeviationToStandardError(standardDeviation, sampleSize) {
      return standardDeviation / Math.sqrt(sampleSize);
    }

    // interface
    return {
      buildPerformance: buildPerformance,
      finishInputCell: finishInputCell,
      inputToString: inputToString,
      getOptions: getOptions
    };

  };
  return dependencies.concat(InputKnowledgeService);
});
