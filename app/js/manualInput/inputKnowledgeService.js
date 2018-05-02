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
          var knowledge = MANUAL_DISTRIBUTION_KNOWLEDGE.getKnowledge(cell);
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
          return MANUAL_DISTRIBUTION_KNOWLEDGE.getKnowledge(inputCell).finishInputCell(inputCell, tableEntry);
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
              }
            },
            manualNormal: {
              id: 'manualNormal',
              label: 'Normal',
              firstParameter: buildDefined('mean'),
              secondParameter: buildPositiveFloat('Standard error'),
              fits: function(tableEntry) {
                return tableEntry.performance.type === 'dnorm';
              }
            },
            manualGamma: {
              id: 'manualGamma',
              label: 'Gamma',
              firstParameter: buildFloatAboveZero('alpha'),
              secondParameter: buildFloatAboveZero('beta'),
              fits: function(tableEntry) {
                return tableEntry.performance.type === 'dgamma';
              }
            },
            manualExact: {
              id: 'manualExact',
              label: 'Exact',
              firstParameter: buildDefined('Value'),
              fits: function(tableEntry) {
                return tableEntry.performance.type === 'exact';
              }
            }
          };
        }
      }
    };
    var MANUAL_DISTRIBUTION_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return cell.inputParameters ? this[cell.inputParameters.id] : {};
      },
      manualBeta: {
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
        toString: function(cell) {
          return 'exact(' + cell.firstParameter + ')';
        },
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        },
        finishInputCell: finishValueCell
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
            exactValueSE: buildExactValueSE('Value, SE'),
            exactValueCI: buildConfidenceInterval('Value')
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
          var knowledge = CONTINUOUS_MEAN_KNOWLEDGE.getKnowledge(cell);
          return _.extend({
            getOptions: this.getOptions,
            finishInputCell: this.finishInputCell
          }, knowledge);
        },
        getOptions: function() {
          return {
            continuousMeanNoDispersion: {
              id: 'continuousMeanNoDispersion',
              label: 'Mean',
              firstParameter: buildDefined('Mean'),
            },
            continuousMeanStdErr: {
              id: 'continuousMeanStdErr',
              label: 'Mean, SE',
              firstParameter: buildDefined('Mean'),
              secondParameter: buildPositiveFloat('Standard error'),
              canBeNormal: true
            },
            continuousMeanConfidenceInterval: _.extend(buildConfidenceInterval('Mean'), {
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
            exactValueCI: buildConfidenceInterval('Median')
          };
        }
      },
      cumulativeProbability: {
        getKnowledge: function(cell) {
          var knowledge = CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE.getKnowledge(cell);
          return _.extend({}, knowledge, {
            getOptions: this.getOptions
          });
        },
        getOptions: function() {
          return {
            cumulativeProbabilityValue: {
              id: 'cumulativeProbabilityValue',
              scale: {
                percentage: 'Percentage',
                decimal: 'Decimal'
              },
              label: 'Value',
              firstParameter: {
                label: 'Value',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.positive(),
                  ConstraintService.belowOrEqualTo(100)
                ]
              }
            },
            cumulativeProbabilityValueCI: _.extend(buildConfidenceInterval('Value'), {
              scale: {
                percentage: 'Percentage',
                decimal: 'Decimal'
              }
            })
          };
        }
      }
    };
    var CONTINUOUS_MEAN_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return cell.inputParameters ? this[cell.inputParameters.id] : {};
      },
      continuousMeanNoDispersion: {
        toString: valueToString,
        finishInputCell: finishValueCell,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        }
      },
      continuousMeanStdErr: {
        toString: valueSEToString,
        buildPerformance: function(cell) {
          if (cell.isNormal) {
            return PerformanceService.buildNormalPerformance(cell.firstParameter, cell.secondParameter);
          } else {
            return PerformanceService.buildExactPerformance(cell.firstParameter, {
              value: cell.firstParameter,
              stdErr: cell.secondParameter
            });
          }
        }
      },
      continuousMeanConfidenceInterval: {
        getKnowledge: function(cell) {
          return cell.inputParameters ? this[cell.inputParameters.id] : {};
        },
        toString: valueCIToString,
        buildPerformance: function(cell) {
          var input = {
            lowerBound: cell.secondParameter,
            upperBound: cell.thirdParameter
          };
          if (cell.isNormal) {
            var sigma = boundsToStandardError(cell.secondParameter, cell.thirdParameter);
            return PerformanceService.buildNormalPerformance(cell.firstParameter, sigma, _.extend(input, {
              mu: cell.firstParameter,
            }));
          } else {
            return PerformanceService.buildExactPerformance(cell.firstParameter, _.extend(input, {
              value: cell.firstParameter,
            }));
          }
        }
      }
    };
    var CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return cell.inputParameters ? this[cell.inputParameters.id] : {};
      },
      cumulativeProbabilityValue: {
        toString: valueToString,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        },
      },
      cumulativeProbabilityValueCI: {
        toString: function(cell) {
          return cell.scale === 'decimal' ? valueCIToString(cell) : valueCIPercentToString(cell);
        },
        buildPerformance: function(cell) {
          if (cell.scale === 'Decimal') {
            return PerformanceService.buildExactConfidencePerformance(cell);
          } else {
            return PerformanceService.buildExactPerformance(cell.firstParameter / 100, {
              value: cell.firstParameter,
              lowerBound: cell.secondParameter,
              upperBound: cell.thirdParameter,
              scale: 'percentage'
            });
          }
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
          var knowledge = ASSISTED_DISTRIBUTION_CONTINUOUS_KNOWLEDGE.getKnowledge(cell);
          return _.extend({
            finishInputCell: this.finishInputCell,
            getOptions: this.getOptions
          }, knowledge);
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
              thirdParameter: buildIntegerAboveZero('Sample size')
            },
            assistedContinuousStdDev: {
              id: 'assistedContinuousStdDev',
              label: 'Mean, SD, sample size',
              firstParameter: buildDefined('Mean'),
              secondParameter: buildPositiveFloat('Standard deviation'),
              thirdParameter: buildIntegerAboveZero('Sample size')
            }
          };
        }
      }
    };
    var ASSISTED_DISTRIBUTION_CONTINUOUS_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return cell.inputParameters ? this[cell.inputParameters.id] : {};
      },
      assistedContinuousStdErr: {
        toString: function(cell) {
          var mu = cell.firstParameter;
          var sigma = cell.secondParameter;
          var sampleSize = cell.thirdParameter;
          return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';

        }, buildPerformance: function(cell) {
          return PerformanceService.buildStudentTPerformance(cell.first, cell.secondParameter, cell.thirdParameter - 1);
        }
      },
      assistedContinuousStdDev: {
        toString: function(cell) {
          var mu = cell.firstParameter;
          var sigma = roundedStandardDeviationToStandardError(cell.secondParameter, cell.thirdParameter);
          var sampleSize = cell.thirdParameter;
          return mu + ' (' + cell.secondParameter + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';

        }, buildPerformance: function(cell) {
          return PerformanceService.buildStudentTPerformance(cell.first, roundedStandardDeviationToStandardError(cell.secondParameter, cell.thirdParameter), cell.thirdParameter - 1);
        }
      }
    };

    // public

    function getKnowledge(cell) {
      return INPUT_TYPE_KNOWLEDGE.getKnowledge(cell);
    }

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

    function buildExactValueKnowledge(label) {
      var knowledge = buildExactKnowledge('exactValue', label);
      knowledge.fits = function(tableEntry) {
        return !tableEntry.performance.input;
      };
      return knowledge;
    }

    function buildExactValueSE(label) {
      var knowledge = buildExactKnowledge('exactValueSE', label);
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

    function finishValueCell(cell, tableEntry) {
      var inputCell = angular.copy(cell);
      inputCell.firstParameter = tableEntry.performance.value;
      return inputCell;
    }

    // to string 
    function valueToString(cell) {
      return cell.firstParameter + (cell.scale === 'percentage' ? '%' : '') + NO_DISTRIBUTION;
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

    function buildConfidenceInterval(label) {
      return {
        id: 'exactValueCI',
        label: label + ', 95% C.I.',
        firstParameter: buildDefined(label),
        secondParameter: {
          label: 'Lower bound',
          constraints: [
            ConstraintService.defined(),
            ConstraintService.belowOrEqualTo('firstParameter')
          ]
        },
        thirdParameter: {
          label: 'Upper bound',
          constraints: [
            ConstraintService.defined(),
            ConstraintService.aboveOrEqualTo('firstParameter')
          ]
        },
        fits: function(tableEntry) {
          return tableEntry.performance.input && tableEntry.performance.input.lowerBound && tableEntry.performance.input.upperBound;
        },
        toString: valueCIToString,
        finishInputCell: function(cell, tableEntry) {
          var inputCell = angular.copy(cell);
          inputCell.firstParameter = tableEntry.performance.input.value;
          inputCell.secondParameter = tableEntry.performance.input.lowerBound;
          inputCell.thirdParameter = tableEntry.performance.input.upperBound;
          return inputCell;
        },
        buildPerformance: function(cell) {
          return PerformanceService.buildExactConfidencePerformance(cell);
        }
      };
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
