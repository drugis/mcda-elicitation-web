'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = ['ConstraintService', 'PerformanceService', 'generateUuid'];
  var ManualInputService = function(ConstraintService, PerformanceService, generateUuid) {
    var NO_DISTRIBUTION = '\nDistribution: none';
    var INVALID_INPUT_MESSAGE = 'Missing or invalid input';
    var SCHEMA_VERSION = '1.0.0';

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
              fits: function(tableEntry){
                return tableEntry.performance.type === 'dbeta';
              }
            },
            manualNormal: {
              id: 'manualNormal',
              label: 'Normal',
              firstParameter: buildDefined('mean'),
              secondParameter: buildPositiveFloat('Standard error'),
              fits: function(tableEntry){
                return tableEntry.performance.type === 'dnorm';
              }
            },
            manualGamma: {
              id: 'manualGamma',
              label: 'Gamma',
              firstParameter: buildFloatAboveZero('alpha'),
              secondParameter: buildFloatAboveZero('beta'),
              fits: function(tableEntry){
                return tableEntry.performance.type === 'dgamma';
              }
            },
            manualExact: {
              id: 'manualExact',
              label: 'Exact',
              firstParameter: buildDefined('Value'),
              fits: function(tableEntry){
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
        }
      },
      manualNormal: {
        toString: function(cell) {
          return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        },
        buildPerformance: function(cell) {
          return PerformanceService.buildNormalPerformance(cell.firstParameter, cell.secondParameter);
        }
      },
      manualGamma: {
        toString: function(cell) {
          return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        },
        buildPerformance: function(cell) {
          return PerformanceService.buildGammaPerformance(cell.firstParameter, cell.secondParameter);
        },
        finishInputCell: function(cell, tableEntry){
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
        finishInputCell: function(cell, tableEntry){
          var inputCell = angular.copy(cell);
          inputCell.firstParameter = tableEntry.performance.value;
          return inputCell;
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
          if (tableEntry.performance.type === 'dnorm') {
            inputCell.inputParameters.isNormal = true;
          }
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
          var knowledge = OTHER_EFFECT_KNOWLEDGE.getKnowledge(cell);
          return _.extend({}, knowledge, {
            getOptions: this.getOptions
          });
        },
        getOptions: function() {
          return {
            value: {
              id: 'value',
              label: 'Value',
              firstParameter: buildDefined('Value')
            },
            valueSE: {
              id: 'valueSE',
              label: 'Value, SE',
              firstParameter: buildDefined('Value'),
              secondParameter: buildPositiveFloat('Standard error')
            },
            valueCI: buildConfidenceInterval('valueCI', 'Value')
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
          inputCell.secondParameter = tableEntry.performance.sampleSize;
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
          return _.extend({}, knowledge, {
            getOptions: this.getOptions
          });
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
            continuousMeanConfidenceInterval: _.extend(buildConfidenceInterval('continuousMeanConfidenceInterval', 'Mean'), {
              canBeNormal: true
            })
          }
        }
      },
      median: {
        getKnowledge: function(cell) {
          var knowledge = CONTINUOUS_MEDIAN_KNOWLEDGE.getKnowledge(cell);
          return _.extend({}, knowledge, {
            getOptions: this.getOptions
          });
        },
        getOptions: function() {
          return {
            continuousMedianNoDispersion: {
              id: 'continuousMedianNoDispersion',
              label: 'Median',
              firstParameter: buildDefined('Median'),
            },
            continuousMedianConfidenceInterval: buildConfidenceInterval('continuousMedianConfidenceInterval', 'Median')
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
            cumulativeProbabilityValueCI: _.extend(buildConfidenceInterval('cumulativeProbabilityValueCI', 'Value'), {
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
            var sigma = boundsToStandardError(cell.secondParameter, cell.thirdParameter)
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
    var CONTINUOUS_MEDIAN_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return cell.inputParameters ? this[cell.inputParameters.id] : {};
      },
      continuousMedianNoDispersion: {
        toString: valueToString,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        }
      },
      continuousMedianConfidenceInterval: {
        toString: valueCIToString,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactConfidencePerformance(cell);
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
    var OTHER_EFFECT_KNOWLEDGE = {
      getKnowledge: function(cell) {
        return cell.inputParameters ? this[cell.inputParameters.id] : {};
      },
      value: {
        toString: valueToString,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter);
        }
      },
      valueSE: {
        toString: valueSEToString,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactPerformance(cell.firstParameter, {
            value: cell.firstParameter,
            stdErr: cell.secondParameter
          });

        }
      },
      valueCI: {
        toString: valueCIToString,
        buildPerformance: function(cell) {
          return PerformanceService.buildExactConfidencePerformance(cell);
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
          return _.extend({}, knowledge, {
            getOptions: this.getOptions
          });
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

    // Exposed functions
    function getInputError(cell) {
      var error;
      var inputParameters = _.pick(cell.inputParameters, ['firstParameter', 'secondParameter', 'thirdParameter']);
      _.find(inputParameters, function(inputParameter, key) {
        var inputValue = cell[key];
        return _.find(inputParameter.constraints, function(constraint) {
          error = constraint(inputValue, inputParameter.label, cell);
          return error;
        });
      });
      return error;
    }

    function inputToString(cell) {
      if (getInputError(cell)) {
        return INVALID_INPUT_MESSAGE;
      }
      return INPUT_TYPE_KNOWLEDGE.getKnowledge(cell).toString(cell);
    }

    function getOptions(cell) {
      return INPUT_TYPE_KNOWLEDGE[cell.inputType].getKnowledge(cell).getOptions();
    }

    function createProblem(criteria, treatments, title, description, inputData, useFavorability) {
      var newCriteria = buildCriteria(criteria);
      var problem = {
        schemaVersion: SCHEMA_VERSION,
        title: title,
        description: description,
        criteria: newCriteria,
        alternatives: buildAlternatives(treatments),
        performanceTable: buildPerformanceTable(inputData, newCriteria, treatments)
      };
      if (useFavorability) {
        problem.valueTree = {
          title: 'Benefit-risk balance',
          children: [{
            title: 'Favourable effects',
            criteria: _.keys(_.pickBy(newCriteria, function(newCrit) {
              var matched = _.find(criteria, ['title', newCrit.title]);
              return matched.isFavorable;
            }))
          }, {
            title: 'Unfavourable effects',
            criteria: _.keys(_.omitBy(newCriteria, function(newCrit) {
              var matched = _.find(criteria, ['title', newCrit.title]);
              return matched.isFavorable;
            }))
          }]
        };
      }
      return problem;
    }

    function prepareInputData(criteria, alternatives, oldInputData) {
      return _.reduce(criteria, function(accum, criterion) {
        accum[criterion.id] = _.reduce(alternatives, function(accum, alternative) {
          if (oldInputData && oldInputData[criterion.id] && oldInputData[criterion.id][alternative.id]) {
            accum[alternative.id] = oldInputData[criterion.id][alternative.id];
          } else {
            accum[alternative.id] = _.cloneDeep(criterion.inputMetaData);
            accum[alternative.id].isInvalid = true;
          }
          return accum;
        }, {});
        return accum;
      }, {});
    }

    function buildScale(criterion) {
      if (criterion.dataType === 'dichotomous' ||
        (criterion.dataType === 'continuous' && criterion.parameterOfInterest === 'cumulativeProbability')) {
        return [0, 1];
      }
      return [-Infinity, Infinity];
    }

    function createInputFromOldWorkspace(criteria, alternatives, oldWorkspace) {
      return _.reduce(oldWorkspace.problem.performanceTable, function(accum, tableEntry) {
        var criterion = _.find(criteria, ['oldId', tableEntry.criterion]);
        var alternative = _.find(alternatives, ['oldId', tableEntry.alternative]);
        if (criterion && alternative && criterion.inputMetaData.inputType !== 'Unknown') {
          if (!accum[criterion.id]) {
            accum[criterion.id] = {};
          }
          accum[criterion.id][alternative.id] = createInputCell(criterion, tableEntry);
        }
        return accum;
      }, {});
    }

    function createInputCell(criterion, tableEntry) {
      var knowledge = INPUT_TYPE_KNOWLEDGE.getKnowledge(criterion.inputMetaData);
      return knowledge.finishInputCell(criterion.inputMetaData, tableEntry);
    }

    function copyWorkspaceCriteria(workspace) {
      var copyFunctions = {
        'unknown': copySchemaZeroCriteria,
        '1.0.0': copySchemaOneCriteria
      };
      var schemaVersion = workspace.problem.schemaVersion ? workspace.problem.schemaVersion : 'unknown';
      return copyFunctions[schemaVersion](workspace);
    }

    // Private functions

    function copySchemaZeroCriteria(workspace) {
      return _.map(workspace.problem.criteria, function(criterion, criterionId) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement',
          'strengthOfEvidence', 'uncertainties']); // omit scales, preferences
        newCrit.id = generateUuid()
        newCrit.oldId = criterionId;
        if (workspace.problem.valueTree) {
          newCrit.isFavorable = _.includes(workspace.problem.valueTree.children[0].criteria, criterionId) ? true : false;
        }
        var tableEntry = _.find(workspace.problem.performanceTable, ['criterion', criterionId]);
        var MANUAL_DISTRIBUTIONS = ['exact', 'dnorm', 'dbeta', 'dgamma'];
        var performanceType = tableEntry.performance.type;
        if (_.includes(MANUAL_DISTRIBUTIONS, performanceType)) {
          newCrit.inputMetaData = {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          };
        } else if (performanceType === 'dt') {
          newCrit.inputMetaData = {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'continuous'
          };
        } else {
          newCrit.inputMetaData = {
            inputType: 'Unknown'
          };
        }
        return newCrit;
      });
    }

    function copySchemaOneCriteria(workspace) {
      return _.map(workspace.problem.criteria, function(criterion, criterionId) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement',
          'strengthOfEvidence', 'uncertainties', 'inputType', 'inputMethod', 'dataType', 'parameterOfInterest']); // omit scales, preferences
        newCrit.id = generateUuid();
        newCrit.oldId = criterionId;
        if (workspace.problem.valueTree) {
          newCrit.isFavorable = _.includes(workspace.problem.valueTree.children[0].criteria, criterionId) ? true : false;
        }
        return newCrit;
      });
    }

    function buildCriteria(criteria) {
      var newCriteria = _.map(criteria, function(criterion) {
        var newCriterion = _.pick(criterion, ['title',
          'description',
          'unitOfMeasurement',
          'source',
          'sourceLink',
          'strengthOfEvidence',
          'uncertainties']);
        newCriterion.scale = buildScale(criterion);
        newCriterion.inputMetaData = _.pick(criterion, ['inputType', 'inputMethod', 'dataType', 'parameterOfInterest']);
        return [criterion.id, newCriterion];
      });
      return _.fromPairs(newCriteria);
    }

    function buildAlternatives(alternatives) {
      return _.reduce(alternatives, function(accum, alternative) {
        accum[alternative.id] = {
          title: alternative.title
        };
        return accum;
      }, {});
    }

    function buildPerformanceTable(inputData, criteria, treatments) {
      var newPerformanceTable = [];
      _.forEach(criteria, function(criterion, criterionId) {
        _.forEach(treatments, function(treatment) {
          var cell = inputData[criterionId][treatment.id];
          newPerformanceTable.push({
            alternative: treatment.id,
            criterion: criterionId,
            performance: INPUT_TYPE_KNOWLEDGE[cell.inputType].getKnowledge(cell).buildPerformance(cell)
          });
        });
      });
      return newPerformanceTable;
    }

    // toString utils
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

    function buildConfidenceInterval(id, label) {
      return {
        id: id,
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

    return {
      createProblem: createProblem,
      inputToString: inputToString,
      getInputError: getInputError,
      prepareInputData: prepareInputData,
      createInputFromOldWorkspace: createInputFromOldWorkspace,
      copyWorkspaceCriteria: copyWorkspaceCriteria,
      getOptions: getOptions
    };
  };

  return dependencies.concat(ManualInputService);
});
