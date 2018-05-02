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
    var DISTRIBUTION_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.inputMethod].getKnowledge(cell);
      },
      assistedDistribution: {
        getKnowledge: function(cell) {
          return ASSISTED_DISTRIBUTION_KNOWLEDGE.getKnowledge(cell);
        }
      },
      manualDistribution: {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this.getOptions()[cell.inputParameters.id] : {
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          };
        },
        getOptions: function() {
          return {
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
              finishInputCell: function(cell, tableEntry) {
                var inputCell = angular.copy(cell);
                inputCell.firstParameter = tableEntry.performance.parameters.alpha;
                inputCell.secondParameter = tableEntry.performance.parameters.beta;
                return inputCell;
              }
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
              finishInputCell: function(cell, tableEntry) {
                var inputCell = angular.copy(cell);
                inputCell.firstParameter = tableEntry.performance.parameters.alpha;
                inputCell.secondParameter = tableEntry.performance.parameters.beta;
                return inputCell;
              }
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
          };
        }
      }
    };
    var EFFECT_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.dataType].getKnowledge(cell);
      },
      dichotomous: {
        getKnowledge: function(cell) {
          var knowledge = DICHOTOMOUS_EFFECT_KNOWLEDGE.getKnowledge(cell);
          return _.extend({
            finishInputCell: this.finishInputCell,
            getOptions: this.getOptions
          }, knowledge);
        },
        finishInputCell: function(cell, tableEntry) {
          var correctOption = _.find(this.getOptions(), function(option) {
            return option.fits(tableEntry);
          });
          var inputCell = angular.copy(cell);
          inputCell.inputParameters = correctOption;
          inputCell.isNormal = tableEntry.performance.type === 'dnorm';
          return DICHOTOMOUS_EFFECT_KNOWLEDGE.getKnowledge(inputCell).finishInputCell(inputCell, tableEntry);
        },
        getOptions: function() {
          return {
            dichotomousDecimal: {
              id: 'dichotomousDecimal',
              label: 'Decimal',
              firstParameter: buildPositiveWithMax('Value', 1.0),
              fits: function(tableEntry) {
                return !tableEntry.performance.input;
              }
            },
            dichotomousDecimalSampleSize: {
              id: 'dichotomousDecimalSampleSize',
              label: 'Decimal, sample size',
              firstParameter: buildPositiveWithMax('Value', 1.0),
              secondParameter: buildIntegerAboveZero('Sample size'),
              canBeNormal: true,
              fits: function(tableEntry) {
                return tableEntry.performance.input && tableEntry.performance.input.sampleSize &&
                  !isFinite(tableEntry.performance.input.events) &&
                  tableEntry.performance.input.scale !== 'percentage';
              }
            },
            dichotomousPercentage: {
              id: 'dichotomousPercentage',
              label: 'Percentage',
              firstParameter: buildPositiveWithMax('Value', 100),
              fits: function(tableEntry) {
                return tableEntry.performance.input &&
                  !tableEntry.performance.input.sampleSize &&
                  tableEntry.performance.input.scale === 'percentage';
              }
            },
            dichotomousPercentageSampleSize: {
              id: 'dichotomousPercentageSampleSize',
              label: 'Percentage, sample size',
              firstParameter: buildPositiveWithMax('Value', 100),
              secondParameter: buildIntegerAboveZero('Sample size'),
              canBeNormal: true,
              fits: function(tableEntry) {
                return tableEntry.performance.input &&
                  tableEntry.performance.input.sampleSize &&
                  tableEntry.performance.input.scale === 'percentage';
              }
            },
            dichotomousFraction: {
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
              }
            }
          };
        }
      },
      continuous: {
        getKnowledge: function(cell) {
          return CONTINUOUS_KNOWLEDGE.getKnowledge(cell);
        }
      },
      other: {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this.getOptions()[cell.inputParameters.id] : {
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          };
        },
        finishInputCell: function(cell, tableEntry) {
          var correctOption = _.find(this.getOptions(), function(option) {
            return option.fits(tableEntry);
          });
          var inputCell = angular.copy(cell);
          inputCell.inputParameters = correctOption;
          return EFFECT_KNOWLEDGE.getKnowledge(inputCell).finishInputCell(inputCell, tableEntry);
        },
        getOptions: function() {
          return {
            exactValue: buildExactValueKnowledge('Value'),
            exactValueSE: buildExactValueSEKnowledge('Value, SE'),
            exactValueCI: buildExactValueConfidenceIntervalKnowledge('Value')
          };
        }
      }
    };
    var DICHOTOMOUS_EFFECT_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return cell.inputParameters ? this[cell.inputParameters.id] : {};
      },
      dichotomousDecimal: {
        toString: valueToString,
        finishInputCell: finishValueCell,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        },
      },
      dichotomousDecimalSampleSize: {
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
        finishInputCell: function(cell, tableEntry) {
          var inputCell = angular.copy(cell);
          inputCell.firstParameter = cell.isNormal ?
            tableEntry.performance.input.mu :
            tableEntry.performance.input.value;
          inputCell.secondParameter = tableEntry.performance.input.sampleSize;
          return inputCell;
        },
        buildPerformance: function(cell) {
          if (cell.isNormal) {
            var proportion = cell.firstParameter;
            var sampleSize = cell.secondParameter;
            var sigma = stdErr(proportion, sampleSize);
            var input = {
              mu: proportion,
              sampleSize: sampleSize
            };
            return PerformanceService.buildNormalPerformance(proportion, sigma, input);
          } else {
            return PerformanceService.buildExactPerformance(cell.firstParameter, {
              value: cell.firstParameter,
              sampleSize: cell.secondParameter
            });
          }
        }
      },
      dichotomousPercentage: {
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
      },
      dichotomousPercentageSampleSize: {
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
        finishInputCell: function(cell, tableEntry) {
          var inputCell = angular.copy(cell);
          inputCell.firstParameter = inputCell.isNormal ?
            tableEntry.performance.input.mu :
            tableEntry.performance.input.value;
          inputCell.secondParameter = tableEntry.performance.input.sampleSize;
          return inputCell;
        },
        buildPerformance: function(cell) {
          if (cell.isNormal) {
            var proportion = cell.firstParameter / 100;
            var sampleSize = cell.secondParameter;
            var sigma = stdErr(proportion, sampleSize);
            var input = {
              mu: cell.firstParameter,
              sampleSize: cell.secondParameter,
              scale: 'percentage'
            };
            return PerformanceService.buildNormalPerformance(cell.firstParameter / 100, sigma, input);
          } else {
            return PerformanceService.buildExactPerformance(cell.firstParameter / 100, {
              value: cell.firstParameter,
              sampleSize: cell.secondParameter,
              scale: 'percentage'
            });
          }
        }
      },
      dichotomousFraction: {
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
      },
    };
    var CONTINUOUS_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.parameterOfInterest].getKnowledge(cell);
      },
      mean: {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this.getOptions()[cell.inputParameters.id] : {
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          };
        },
        getOptions: function() {
          return {
            exactValue: buildExactValueKnowledge('Mean'),
            exactValueSE: _.extend(buildExactValueSEKnowledge('Mean'), {
              canBeNormal: true
            }),
            exactValueCI: _.extend(buildExactValueConfidenceIntervalKnowledge('Mean'), {
              canBeNormal: true
            })
          };
        }
      },
      median: {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this.getOptions()[cell.inputParameters.id] : {
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          };
        },
        getOptions: function() {
          return {
            exactValue: buildExactValueKnowledge('Median'),
            exactValueCI: buildExactValueConfidenceIntervalKnowledge('Median')
          };
        }
      },
      cumulativeProbability: {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this.getOptions()[cell.inputParameters.id] : {
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          };
        },
        getOptions: function() {
          var decimal = buildExactValueKnowledge('Decimal', 'decimal');
          decimal.firstParameter.constraints = decimal.firstParameter.constraints.concat(ConstraintService.positive(), [ConstraintService.belowOrEqualTo(1)]);
          var percentage = buildPercentKnowledge();
          var decimalCI = addCeilConstraints(buildExactValueConfidenceIntervalKnowledge('Decimal', 'decimalCI'), 1);
          var percentageCI = addCeilConstraints(buildPercentageConfidenceIntervalKnowledge('Percentage', 'percentageCI'), 100);
          var retval = {
            decimal: decimal,
            decimalCI: decimalCI,
            percentage: percentage,
            percentageCI: percentageCI
          };
          return retval;
        }
      }
    };

    var ASSISTED_DISTRIBUTION_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return this[cell.dataType].getKnowledge(cell);
      },
      dichotomous: {
        getKnowledge: function() {
          return this;
        },
        toString: function(cell) {
          var events = cell.firstParameter;
          var sampleSize = cell.secondParameter;
          return events + ' / ' + sampleSize + '\nDistribution: Beta(' + (events + 1) + ', ' + (sampleSize - events + 2) + ')';
        },
        finishInputCell: function(cell, tableEntry) {
          var inputCell = angular.copy(cell);
          inputCell.inputParameters = this.getOptions().assistedDichotomous;
          inputCell.firstParameter = tableEntry.performance.parameters.alpha - 1;
          inputCell.secondParameter = tableEntry.performance.parameters.beta + inputCell.firstParameter - 2;
          return inputCell;
        },
        buildPerformance: function(cell) {
          return PerformanceService.buildBetaPerformance(cell.firstParameter + 1, cell.secondParameter - cell.firstParameter + 2);
        },
        getOptions: function() {
          return {
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
              secondParameter: buildIntegerAboveZero('Sample size')
            },
          };
        }
      },
      continuous: {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this.getOptions()[cell.inputParameters.id] : {
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          };
        },
        finishInputCell: function(cell, tableEntry) {
          var inputCell = angular.copy(cell);
          inputCell.inputParameters = this.getOptions().assistedContinuousStdErr;
          inputCell.firstParameter = tableEntry.performance.parameters.mu;
          inputCell.secondParameter = tableEntry.performance.parameters.stdErr;
          inputCell.thirdParameter = tableEntry.performance.parameters.dof;
          return inputCell;
        },
        getOptions: function() {
          return {
            assistedContinuousStdErr: {
              id: 'assistedContinuousStdErr',
              label: 'Mean, SE, sample size',
              firstParameter: buildDefined('Mean'),
              secondParameter: buildPositiveFloat('Standard error'),
              thirdParameter: buildIntegerAboveZero('Sample size'),
              toString: function(cell) {
                var mu = cell.firstParameter;
                var sigma = cell.secondParameter;
                var sampleSize = cell.thirdParameter;
                return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';
              }, 
              buildPerformance: function(cell) {
                return PerformanceService.buildStudentTPerformance(cell.first, cell.secondParameter, cell.thirdParameter - 1);
              }
            },
            assistedContinuousStdDev: {
              id: 'assistedContinuousStdDev',
              label: 'Mean, SD, sample size',
              firstParameter: buildDefined('Mean'),
              secondParameter: buildPositiveFloat('Standard deviation'),
              thirdParameter: buildIntegerAboveZero('Sample size'),
              toString: function(cell) {
                var mu = cell.firstParameter;
                var sigma = roundedStandardDeviationToStandardError(cell.secondParameter, cell.thirdParameter);
                var sampleSize = cell.thirdParameter;
                return mu + ' (' + cell.secondParameter + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';
              }, 
              buildPerformance: function(cell) {
                return PerformanceService.buildStudentTPerformance(cell.first, roundedStandardDeviationToStandardError(cell.secondParameter, cell.thirdParameter), cell.thirdParameter - 1);
              }
            }
          };
        }
      }
    };

    // public

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
      return getKnowledge(cell).getOptions();
    }

    // private
    function getKnowledge(cell) {
      return INPUT_TYPE_KNOWLEDGE.getKnowledge(cell);
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
      id = id ? id : 'exactValueSE';
      var knowledge = buildExactKnowledge(id, label);
      knowledge.fits = function(tableEntry) {
        return !tableEntry.performance.input;
      };
      return knowledge;
    }

    function buildExactValueSEKnowledge(label, id) {
      id = id ? id : 'exactValueSE';
      var knowledge = buildExactKnowledge(id, label);
      knowledge.fits = function(tableEntry) {
        return tableEntry.performance.input && tableEntry.performance.input.stdErr;
      };
      knowledge.secondParameter = buildPositiveFloat('Standard error');
      knowledge.toString = valueSEToString;
      knowledge.finishInputCell = function(cell, tableEntry) {
        var inputCell = angular.copy(cell);
        inputCell.firstParameter = tableEntry.performance.input.value;
        inputCell.secondParameter = tableEntry.performance.input.stdErr;
        return inputCell;
      };
      knowledge.buildPerformance = function(cell) {
        return PerformanceService.buildExactPerformance(cell.firstParameter, {
          value: cell.firstParameter,
          stdErr: cell.secondParameter
        });
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
        return tableEntry.performance.input && tableEntry.performance.input.lowerBound && tableEntry.performance.input.upperBound;
      };
      knowledge.toString = valueCIToString;
      knowledge.finishInputCell = finishValueConfidenceIntervalCell;
      knowledge.buildPerformance = function(cell) {
        return PerformanceService.buildExactConfidencePerformance(cell);
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
          upperBound: cell.thirdParameter
        });
      };
      return knowledge;
    }

    function finishValueCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.value;
      return inputCell;
    }

    function finishValueConfidenceIntervalCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.input.value;
      inputCell.secondParameter = tableEntry.performance.input.lowerBound;
      inputCell.thirdParameter = tableEntry.performance.input.upperBound;
      return inputCell;
    }

    function addCeilConstraints(knowledge, ceil) {
      knowledge.firstParameter.constraints = knowledge.firstParameter.constraints.concat([ConstraintService.positive(), ConstraintService.belowOrEqualTo(ceil)]);
      knowledge.secondParameter.constraints = knowledge.secondParameter.constraints.concat([ConstraintService.positive(), ConstraintService.belowOrEqualTo(ceil)]);
      knowledge.thirdParameter.constraints = knowledge.thirdParameter.constraints.concat([ConstraintService.positive(), ConstraintService.belowOrEqualTo(ceil)]);
      return knowledge;
    }

    function buildPercentKnowledge() {
      var knowledge = buildExactValueKnowledge('Percentage', 'percentage');
      knowledge.firstParameter.constraints = knowledge.firstParameter.constraints.concat(ConstraintService.positive(), [ConstraintService.belowOrEqualTo(100)]);
      knowledge.toString = valuePercentToString;
      knowledge.buildPerformance = buildPercentPerformance;
      return knowledge;
    }

    function buildPercentPerformance(cell) {
      return PerformanceService.buildExactPerformance(cell.firstParameter / 100, {
        scale: 'percentage', value: cell.firstParameter
      });
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
      var returnString = cell.firstParameter + ' (' + cell.secondParameter + '; ' + cell.thirdParameter + ')';
      if (cell.isNormal) {
        return returnString + '\nNormal(' + cell.firstParameter + ', ' + boundsToStandardError(cell.secondParameter, cell.thirdParameter) + ')';
      }
      return returnString + NO_DISTRIBUTION;
    }

    function valueCIPercentToString(cell) {
      return cell.firstParameter + '% (' + cell.secondParameter + '%; ' + cell.thirdParameter + '%)' + NO_DISTRIBUTION;
    }

    // build constraints
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

    // math util
    function stdErr(mu, sampleSize) {
      return Math.sqrt(mu * (1 - mu) / sampleSize);
    }

    function roundedStdErr(mu, sampleSize) {
      return Math.round(Math.sqrt(mu * (1 - mu) / sampleSize) * 1000) / 1000;
    }

    function boundsToStandardError(lowerBound, upperBound) {
      return (upperBound - lowerBound) / (2 * 1.96);
    }

    function roundedStandardDeviationToStandardError(standardDeviation, sampleSize) {
      return Math.round(1000 * standardDeviation / Math.sqrt(sampleSize)) / 1000;
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
