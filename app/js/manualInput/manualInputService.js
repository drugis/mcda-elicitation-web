'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = [];
  var ManualInputService = function () {
    var NO_DISTRIBUTION = '\nDistribution: none';
    var INVALID_PARAMETERS = 'Invalid parameters';

    var inputTypeKnowledge = {
      distribution: {
        checkInputValues: function (cell) {
          return distributionKnowledge[cell.inputMethod].checkInputValues(cell);
        },
        toString: function (cell) {
          return distributionKnowledge[cell.inputMethod].toString(cell);
        },
        buildPerformance: function (cell) {
          return distributionKnowledge[cell.inputMethod].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return distributionKnowledge[cell.inputMethod].getOptions(cell);
        }
      },
      effect: {
        checkInputValues: function (cell) {
          return effectKnowledge[cell.dataType].checkInputValues(cell);
        },
        toString: function (cell) {
          return effectKnowledge[cell.dataType].toString(cell);
        },
        buildPerformance: function (cell) {
          return effectKnowledge[cell.dataType].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return effectKnowledge[cell.dataType].getOptions(cell);
        }
      }
    };
    var distributionKnowledge = {
      assistedDistribution: {
        checkInputValues: function (cell) {
          return assistedDistributionKnowledge[cell.dataType].checkInputValues(cell);
        },
        toString: function (cell) {
          return assistedDistributionKnowledge[cell.dataType].toString(cell);
        },
        buildPerformance: function (cell) {
          return assistedDistributionKnowledge[cell.dataType].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return assistedDistributionKnowledge[cell.dataType].options;
        }
      },
      manualDistribution: {
        checkInputValues: function (cell) {
          switch (cell.inputParameters.id) {
            case 'manualBeta':
              var alpha = cell.firstParameter;
              var beta = cell.secondParameter;
              if (isNullNaNOrUndefined(alpha) || alpha <= 0) {
                return 'Invalid alpha';
              } else if (isNullNaNOrUndefined(beta) || beta <= 0) {
                return 'Invalid beta';
              } else if (alpha % 1 !== 0 || beta % 1 !== 0) {
                return 'Values should be integer';
              }
              break;
            case 'manualNormal':
              var mu = cell.firstParameter;
              var sigma = cell.secondParameter;
              if (isNullNaNOrUndefined(mu)) {
                return 'Invalid mean';
              } else if (isNullNaNOrUndefinedOrNegative(sigma)) {
                return 'Invalid standard error';
              }
              break;
            case 'manualGamma':
              var alpha = cell.firstParameter;
              var beta = cell.secondParameter;
              if (isNullNaNOrUndefined(alpha) || alpha <= 0) {
                return 'Invalid alpha';
              } else if (isNullNaNOrUndefined(beta) || beta <= 0) {
                return 'Invalid beta';
              }
              break;
            default:
              return INVALID_PARAMETERS;
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.id) {
            case 'manualBeta':
              if (!checkInputValues(cell)) {
                return 'Beta(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
              }
            case 'manualNormal':
              if (!checkInputValues(cell)) {
                return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
              }
            case 'manualGamma':
              if (!checkInputValues(cell)) {
                return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
              }
            default:
              return 'Missing or invalid input';
          }
        },
        buildPerformance: function (cell) {
          switch (cell.inputParameters.id) {
            case 'manualBeta':
              return {
                type: 'dbeta',
                parameters: {
                  alpha: cell.firstParameter,
                  beta: cell.secondParameter
                }
              };
            case 'manualNormal':
              return {
                type: 'dnorm',
                parameters: {
                  mu: cell.firstParameter,
                  sigma: cell.secondParameter
                }
              };
            case 'manualGamma':
              return {
                type: 'dgamma',
                parameters: {
                  alpha: cell.firstParameter,
                  beta: cell.secondParameter
                }
              };
          }
        },
        getOptions: function () {
          return {
            beta: {
              id: 'manualBeta',
              label: 'Beta',
              firstParameter: 'alpha',
              secondParameter: 'beta'
            },
            normal: {
              id: 'manualNormal',
              label: 'Normal',
              firstParameter: 'mean',
              secondParameter: 'SE'
            },
            gamma: {
              id: 'manualGamma',
              label: 'Gamma',
              firstParameter: 'alpha',
              secondParameter: 'beta'
            }
          };
        }
      }
    };
    var effectKnowledge = {
      dichotomous: {
        checkInputValues: function (cell) {
          switch (cell.inputParameters.id) {
            case 'dichotomousDecimal':
              if (isNullNaNOrUndefinedOrNegative(cell.firstParameter) || cell.firstParameter > 1 ||
                (cell.isNormal && isNullNaNOrUndefinedOrNegative(cell.secondParameter))) {
                return 'Value should be between or equal to 0 and 1';
              } else if (cell.secondParameter && !isInteger(cell.secondParameter)) {
                return 'Sample size should be integer';
              }
              break;
            case 'dichotomousPercentage':
              if (isNullNaNOrUndefinedOrNegative(cell.firstParameter) || cell.firstParameter > 100 ||
                (cell.isNormal && isNullNaNOrUndefinedOrNegative(cell.secondParameter))) {
                return 'Value should be between or equal to 0 and 100';
              } else if (cell.secondParameter && !isInteger(cell.secondParameter)) {
                return 'Sample size should be integer';
              }
              break;
            case 'dichotomousFraction':
              if (isNullNaNOrUndefinedOrNegative(cell.firstParameter) || isNullNaNOrUndefinedOrNegative(cell.secondParameter)) {
                return 'Both values must be defined and non-negative';
              } else if (cell.firstParameter > cell.secondParameter) {
                return 'Number of events may not exceed sample size';
              }
              break;
            default:
              return INVALID_PARAMETERS;
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.id) {
            case 'dichotomousDecimal':
              if (!checkInputValues(cell)) {
                var returnString = cell.firstParameter;
                if (cell.secondParameter) {
                  returnString = returnString + ' (' + cell.secondParameter + ')';
                  if (cell.isNormal) {
                    return returnString + '\nNormal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
                  }
                }
                return returnString + NO_DISTRIBUTION;
              }
            case 'dichotomousPercentage':
              if (!checkInputValues(cell)) {
                var returnString = cell.firstParameter + '%';
                if (cell.secondParameter) {
                  returnString = returnString + ' (' + cell.secondParameter + ')';
                  if (cell.isNormal) {
                    return returnString + '\nNormal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
                  }
                }
                return returnString + NO_DISTRIBUTION;
              }
            case 'dichotomousFraction':
              if (!checkInputValues(cell)) {
                var returnString = cell.firstParameter + ' / ' + cell.secondParameter;
                if (cell.isNormal) {
                  return returnString + '\nNormal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
                }
                return returnString + NO_DISTRIBUTION;
              }
            default:
              return 'Missing or invalid input';
          }
        },
        buildPerformance: function (cell) {
          switch (cell.inputParameters.id) {
            case 'dichotomousDecimal':
              return {
                type: 'exact',
                value: cell.firstParameter,
                isNormal: cell.isNormal
              };
            case 'dichotomousPercentage':
              return {
                type: 'exact',
                value: cell.firstParameter / 100,
                percentage: true,
                isNormal: cell.isNormal
              };
            case 'dichotomousFraction':
              return {
                type: 'exact',
                value: (cell.firstParameter / cell.secondParameter),
                events: cell.firstParameter,
                sampleSize: cell.secondParameter,
                isNormal: cell.isNormal
              };
          }
        },
        getOptions: function () {
          return {
            decimal: {
              id: 'dichotomousDecimal',
              label: 'Decimal',
              firstParameter: 'Value',
              secondParameter: 'Sample size (optional)',
              canBeNormal: true
            },
            percentage: {
              id: 'dichotomousPercentage',
              label: 'Percentage',
              firstParameter: 'Value',
              secondParameter: 'Sample size (optional)',
              canBeNormal: true
            },
            fraction: {
              id: 'dichotomousFraction',
              label: 'Fraction',
              firstParameter: 'Events',
              secondParameter: 'Sample size',
              canBeNormal: true
            }
          };
        }
      },
      continuous: {
        checkInputValues: function (cell) {
          return continuousKnowledge[cell.parameterOfInterest].checkInputValues(cell);
        },
        toString: function (cell) {
          return continuousKnowledge[cell.parameterOfInterest].toString(cell);
        },
        buildPerformance: function (cell) {
          return continuousKnowledge[cell.parameterOfInterest].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return continuousKnowledge[cell.parameterOfInterest].options;
        }
      },
      other: {
        checkInputValues: function (cell) {
          var value = cell.firstParameter;
          if (isNullNaNOrUndefined(value)) {
            return 'Missing or invalid value';
          }
          switch (cell.inputParameters.id) {
            case 'value':
              break;
            case 'valueSE':
              if (isNullNaNOrUndefinedOrNegative(cell.secondParameter)) {
                return 'Standard error invalid, missing, or negative';
              }
              break;
            case 'valueCI':
              var intervalError = checkInterval(cell.firstParameter, cell.secondParameter, cell.thirdParameter);
              if (intervalError) {
                return intervalError;
              }
              break;
            default:
              return INVALID_PARAMETERS;
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.id) {
            case 'value':
              return valueToString(cell);
            case 'valueSE':
              return valueSEToString(cell);
            case 'valueCI':
              return valueCIToString(cell);
            default:
              return 'Missing or invalid input';
          }
        },
        buildPerformance: function (cell) {
          switch (cell.inputParameters.id) {
            case 'value':
              return {
                type: 'exact',
                value: cell.firstParameter
              };
            case 'valueSE':
              return {
                type: 'exact',
                value: cell.firstParameter,
                stdErr: cell.secondParameter
              };
            case 'valueCI':
              return {
                type: 'exact',
                value: cell.firstParameter,
                lowerBound: cell.secondParameter,
                upperBound: cell.thirdParameter
              };
          }
        },
        getOptions: function () {
          return {
            value: {
              id: 'value',
              label: 'Value',
              firstParameter: 'Value'
            },
            valueSE: {
              id: 'valueSE',
              label: 'Value, SE',
              firstParameter: 'Value',
              secondParameter: 'Standard error'
            },
            valueCI: {
              id: 'valueCI',
              label: 'Value, 95% C.I.',
              firstParameter: 'Value',
              secondParameter: 'Lower bound',
              thirdParameter: 'Upper bound'
            }
          };
        }
      }
    };
    var continuousKnowledge = {
      mean: {
        checkInputValues: function (cell) {
          if (isNullNaNOrUndefined(cell.firstParameter)) {
            return 'Missing or invalid mean';
          }
          switch (cell.inputParameters.id) {
            case 'continuousMeanNoDispersion':
              break;
            case 'continuousMeanStdErr':
              if (isNullNaNOrUndefinedOrNegative(cell.secondParameter)) {
                return 'Standard error missing, invalid, or negative';
              }
              break;
            case 'continuousMeanConfidenceInterval':
              var intervalError = checkInterval(cell.firstParameter, cell.secondParameter, cell.thirdParameter);
              if (intervalError) {
                return intervalError;
              }
              break;
            default:
              return INVALID_PARAMETERS;
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.id) {
            case 'continuousMeanNoDispersion':
              return valueToString(cell);
            case 'continuousMeanStdErr':
              return valueSEToString(cell, cell.isNormal);
            case 'continuousMeanConfidenceInterval':
              return valueCIToString(cell, cell.isNormal);
            default:
              return 'Missing or invalid input';
          }
        }, buildPerformance: function (cell) {
          switch (cell.inputParameters.id) {
            case 'continuousMeanNoDispersion':
              return {
                type: 'exact',
                value: cell.firstParameter
              };
            case 'continuousMeanStdErr':
              return {
                type: 'exact',
                value: cell.firstParameter,
                stdErr: cell.secondParameter,
                isNormal: cell.isNormal
              };
            case 'continuousMeanConfidenceInterval':
              return {
                type: 'exact',
                value: cell.firstParameter,
                lowerBound: cell.secondParameter,
                upperBound: cell.thirdParameter,
                isNormal: cell.isNormal
              };
          }
        },
        options: {
          mean: {
            id: 'continuousMeanNoDispersion',
            label: 'Mean',
            firstParameter: 'Mean'
          },
          meanSE: {
            id: 'continuousMeanStdErr',
            label: 'Mean, SE',
            firstParameter: 'Mean',
            secondParameter: 'Standard error',
            canBeNormal: true
          },
          meanCI: {
            id: 'continuousMeanConfidenceInterval',
            label: 'Mean, 95% C.I.',
            firstParameter: 'Mean',
            secondParameter: 'Lower bound',
            thirdParameter: 'Upper bound',
            canBeNormal: true
          }
        }
      },
      median: {
        checkInputValues: function (cell) {
          if (isNullNaNOrUndefined(cell.firstParameter)) {
            return 'Missing or invalid median';
          }
          switch (cell.inputParameters.id) {
            case 'medianNoDispersion':
              break;
            case 'medianConfidenceInterval':
              var intervalError = checkInterval(cell.firstParameter, cell.secondParameter, cell.thirdParameter);
              if (intervalError) {
                return intervalError;
              }
              break;
            default:
              return INVALID_PARAMETERS;
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.id) {
            case 'medianNoDispersion':
              return valueToString(cell);
            case 'medianConfidenceInterval':
              return valueCIToString(cell);
            default:
              return 'Missing or invalid input';
          }
        }, buildPerformance: function (cell) {
          switch (cell.inputParameters.id) {
            case 'medianNoDispersion':
              return {
                type: 'exact',
                value: cell.firstParameter
              };
            case 'medianConfidenceInterval':
              return {
                type: 'exact',
                value: cell.firstParameter,
                lowerBound: cell.secondParameter,
                upperBound: cell.thirdParameter
              };
          }
        },
        options: {
          median: {
            id: 'medianNoDispersion',
            label: 'Median',
            firstParameter: 'Median'
          },
          medianCI: {
            id: 'medianConfidenceInterval',
            label: 'Median, 95% C.I.',
            firstParameter: 'Median',
            secondParameter: 'Lower bound',
            thirdParameter: 'Upper bound'
          }
        }
      },
      cumulativeProbability: {
        checkInputValues: function (cell) {
          var value = cell.firstParameter;
          if (isNullNaNOrUndefinedOrNegative(value)) {
            return 'Missing, invalid, or negative value';
          } else if (cell.display === 'decimal' && value > 1) {
            return 'Value must be 1 or less';
          } else if (cell.display === 'percentage' && value > 100) {
            return 'Percentage must be 100 or less';
          }
          switch (cell.inputParameters.id) {
            case 'cumulatitiveProbabilityValue':
              break;
            case 'cumulatitiveProbabilityValueCI':
              var intervalError = checkInterval(cell.firstParameter, cell.secondParameter, cell.thirdParameter);
              if (intervalError) {
                return intervalError;
              } else if (cell.display === 'decimal' && cell.thirdParameter > 1) {
                return 'Upperbound can at most be 1';
              } else if (cell.display === 'percentage' && cell.thirdParameter > 100) {
                return 'Upperbound can at most be 100';
              }
              break;
            default:
              return INVALID_PARAMETERS;
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.id) {
            case 'cumulatitiveProbabilityValue':
              if (cell.display === 'decimal') {
                return valueToString(cell);
              } else if (cell.display === 'percentage' && !checkInputValues(cell)) {
                return cell.firstParameter + '%\nDistribution: none';
              }
            case 'cumulatitiveProbabilityValueCI':
              if (cell.display === 'decimal') {
                return valueCIToString(cell);
              } else if (cell.display === 'percentage' && !checkInputValues(cell)) {
                return valueCIPercentToString(cell);
              }
            default:
              return 'Missing or invalid input';
          }
        }, buildPerformance: function (cell) {
          switch (cell.inputParameters.id) {
            case 'cumulatitiveProbabilityValue':
              return {
                type: 'exact',
                value: cell.firstParameter
              };
            case 'cumulatitiveProbabilityValueCI':
              if (cell.display === 'Decimal') {
                return {
                  type: 'exact',
                  value: cell.firstParameter,
                  lowerBound: cell.secondParameter,
                  upperBound: cell.thirdParameter
                };
              } else {
                return {
                  type: 'exact',
                  value: cell.firstParameter / 100,
                  lowerBound: cell.secondParameter / 100,
                  upperBound: cell.thirdParameter / 100,
                  percentage: true
                };
              }
          }
        },
        options: {
          value: {
            id: 'cumulatitiveProbabilityValue',
            display: {
              percentage: 'Percentage',
              decimal: 'Decimal'
            },
            label: 'Value',
            firstParameter: 'Value'
          },
          valueCI: {
            id: 'cumulatitiveProbabilityValueCI',
            display: {
              percentage: 'Percentage',
              decimal: 'Decimal'
            },
            label: 'Value, 95% C.I.',
            firstParameter: 'Value',
            secondParameter: 'Lower bound',
            thirdParameter: 'Upper bound'
          }
        }
      }
    };
    var assistedDistributionKnowledge = {
      dichotomous: {
        checkInputValues: function (cell) {
          var events = cell.firstParameter;
          var sampleSize = cell.secondParameter;
          if (isNullNaNOrUndefinedOrNegative(events)) {
            return 'Missing, invalid, or negative events';
          } else if (isNullNaNOrUndefined(sampleSize) || sampleSize < 1) {
            return 'Missing, invalid, or lower than 1 sample size';
          } else if (!isInteger(events) || !isInteger(sampleSize)) {
            return 'Events and sample size must be integer';
          } else if (events > sampleSize) {
            return 'Events must be lower or equal to sample size';
          }
        },
        toString: function (cell) {
          var events = cell.firstParameter;
          var sampleSize = cell.secondParameter;
          if (!checkInputValues(cell)) {
            return events + ' / ' + sampleSize + '\nDistribution: Beta(' + (events + 1) + ', ' + (sampleSize - events + 2) + ')';
          }
          return 'Missing or invalid input';
        },
        buildPerformance: function (cell) {
          return {
            type: 'dbeta',
            parameters: {
              alpha: cell.firstParameter + 1,
              beta: cell.secondParameter - cell.firstParameter + 2
            }
          };
        },
        options: {
          dichotomous: {
            id: 'assistedDichotomous',
            label: 'dichotomous',
            firstParameter: 'Events',
            secondParameter: 'Sample size'
          }
        }
      },
      continuous: {
        checkInputValues: function (cell) {
          if (isNullNaNOrUndefined(cell.firstParameter)) {
            return 'Missing or invalid mean';
          } else if (isNullNaNOrUndefinedOrNegative(cell.secondParameter)) {
            return 'Missing, invalid, or negative standard error/deviation';
          } else if (isNullNaNOrUndefinedOrNegative(cell.thirdParameter) || !isInteger(cell.thirdParameter)) {
            return 'Missing, invalid, negative, or non-integer sample size';
          }
        },
        toString: function (cell) {
          var mu = cell.firstParameter;
          var sigma = cell.secondParameter;
          var sampleSize = cell.thirdParameter;
          switch (cell.inputParameters.id) {
            case 'assistedContinuousStdErr':
              if (!checkInputValues(cell)) {
                return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';
              }
            case 'assistedContinuousStdDev':
              if (!checkInputValues(cell)) {
                return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + (Math.round(1000 * sigma / Math.sqrt(sampleSize)) / 1000) + ')';
              }
            default:
              return 'Missing or invalid input';
          }
        },
        buildPerformance: function (cell) {
          switch (cell.inputParameters.id) {
            case 'assistedContinuousStdErr':
              return {
                type: 'dt',
                parameters: {
                  mu: cell.firstParameter,
                  stdErr: cell.secondParameter,
                  dof: cell.thirdParameter - 1
                }
              };
            case 'assistedContinuousStdDev':
              return {
                type: 'dt',
                parameters: {
                  mu: cell.firstParameter,
                  stdErr: Math.round(cell.secondParameter / Math.sqrt(cell.secondParameter) * 1000) / 1000,
                  dof: cell.thirdParameter - 1
                }
              };
          }
        },
        options: {
          stdErr: {
            id: 'assistedContinuousStdErr',
            label: 'Student\'s t, SE',
            firstParameter: 'Mean',
            secondParameter: 'Standard error',
            thirdParameter: 'Sample size'
          },
          stdDev: {
            id: 'assistedContinuousStdDev',
            label: 'Student\'s t, SD',
            firstParameter: 'Mean',
            secondParameter: 'Standard deviation',
            thirdParameter: 'Sample size'
          }
        }
      },
      other: {
        checkInputValues: function (cell) {
          if (isNullNaNOrUndefined(cell.firstParameter)) {
            return 'Missing or invalid value';
          }
        },
        toString: function (cell) {
          if (!checkInputValues(cell)) {
            return valueToString(cell);
          }
          return 'Missing or invalid input';
        },
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter
          };
        },
        options: {
          assistedOther: {
            id: 'assistedOther',
            label: 'other',
            firstParameter: 'Value'
          }
        }
      }
    };

    // Exposed functions
    function checkInputValues(cell) {
      return inputTypeKnowledge[cell.inputType].checkInputValues(cell);
    }

    function inputToString(cell) {
      return inputTypeKnowledge[cell.inputType].toString(cell);
    }

    function getOptions(cell) {
      return inputTypeKnowledge[cell.inputType].getOptions(cell);
    }

    function createProblem(criteria, treatments, title, description, performanceTable, useFavorability) {
      var problem = {
        title: title,
        description: description,
        criteria: buildCriteria(criteria),
        alternatives: buildAlternatives(treatments),
        performanceTable: buildPerformanceTable(performanceTable, criteria, treatments)
      };
      if (useFavorability) {
        problem.valueTree = {
          title: 'Benefit-risk balance',
          children: [{
            title: 'Favourable effects',
            criteria: _.map(_.filter(criteria, 'isFavorable'), 'title')
          }, {
            title: 'Unfavourable effects',
            criteria: _.map(_.reject(criteria, 'isFavorable'), 'title')
          }]
        };
      }
      return problem;
    }

    function prepareInputData(criteria, alternatives, oldInputData) {
      return _.reduce(criteria, function (accum, criterion) {
        accum[criterion.hash] = _.reduce(alternatives, function (accum, alternative) {
          if (oldInputData && oldInputData[criterion.hash] && oldInputData[criterion.hash][alternative.hash]) {
            accum[alternative.hash] = oldInputData[criterion.hash][alternative.hash];
          } else {
            accum[alternative.hash] = _.cloneDeep(criterion);
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

    function createInputFromOldWorkspace(criteria, alternatives, oldWorkspace, inputData) {
      var newInputData = _.cloneDeep(inputData);
      _.forEach(criteria, function (criterion) {
        _.forEach(alternatives, function (alternative) {
          var critKey;
          _.forEach(oldWorkspace.problem.criteria, function (problemCrit, key) {
            if (problemCrit.title === criterion.title) {
              critKey = key;
            }
          });
          var altKey;
          _.forEach(oldWorkspace.problem.alternatives, function (problemAlt, key) {
            if (problemAlt.title === alternative.title) {
              altKey = key;
            }
          });
          var tableEntry = _.find(oldWorkspace.problem.performanceTable, function (tableEntry) {
            return tableEntry.criterion === critKey && tableEntry.alternative === altKey;
          });
          if (tableEntry) {
            var inputDataCell = _.cloneDeep(newInputData[criterion.hash][alternative.hash]);
            switch (tableEntry.performance.type) {
              case 'exact':
                inputDataCell.value = tableEntry.performance.value;
                inputDataCell.exactType = 'exact';
                if (tableEntry.performance.stdErr) {
                  inputDataCell.stdErr = tableEntry.performance.stdErr;
                  inputDataCell.isNormal = tableEntry.performance.isNormal;
                  inputDataCell.exactType = 'exactSE';
                }
                if (tableEntry.performance.lowerBound) {
                  inputDataCell.lowerBound = tableEntry.performance.lowerBound;
                  inputDataCell.upperBound = tableEntry.performance.upperBound;
                  inputDataCell.isNormal = tableEntry.performance.isNormal;
                  inputDataCell.exactType = 'exactConf';
                }
                break;
              case 'dt':
                inputDataCell.sampleSize = tableEntry.performance.parameters.dof + 1;
                inputDataCell.stdErr = tableEntry.performance.parameters.stdErr;
                inputDataCell.mu = tableEntry.performance.parameters.mu;
                inputDataCell.continuousType = 'SEt';
                break;
              case 'dnorm':
                inputDataCell.stdErr = tableEntry.performance.parameters.sigma;
                inputDataCell.mu = tableEntry.performance.parameters.mu;
                inputDataCell.continuousType = 'SEnorm';
                break;
              case 'dbeta':
                inputDataCell.count = tableEntry.performance.parameters.alpha - 1;
                inputDataCell.sampleSize = tableEntry.performance.parameters.beta + inputDataCell.count - 1;
                break;
              case 'dsurv':
                inputDataCell.events = tableEntry.performance.parameters.alpha - 0.001;
                inputDataCell.exposure = tableEntry.performance.parameters.beta - 0.001;
                inputDataCell.summaryMeasure = tableEntry.performance.parameters.summaryMeasure;
                inputDataCell.timeScale = tableEntry.performance.parameters.time;
                break;
            }
            inputDataCell.isInvalid = checkInputValues(inputDataCell);
            inputDataCell.label = inputToString(inputDataCell);
            newInputData[criterion.hash][alternative.hash] = inputDataCell;
          }
        });
      });
      return newInputData;
    }

    function copyWorkspaceCriteria(workspace) {
      return _.map(workspace.problem.criteria, function (criterion, key) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement', 'strengthOfEvidence', 'uncertainties']);
        if (workspace.problem.valueTree) {
          newCrit.isFavorable = _.includes(workspace.problem.valueTree.children[0].criteria, key) ? true : false;
        }
        var tableEntry = _.find(workspace.problem.performanceTable, ['criterion', key]);
        newCrit.dataSource = tableEntry.performance.type === 'exact' ? 'exact' : 'study';
        if (newCrit.dataSource === 'study') {
          switch (tableEntry.performance.type) {
            case 'dsurv':
              newCrit.dataType = 'survival';
              newCrit.summaryMeasure = tableEntry.performance.parameters.summaryMeasure;
              newCrit.timePointOfInterest = tableEntry.performance.parameters.time;
              newCrit.timeScale = 'time scale not set';
              break;
            case 'dt':
              newCrit.dataType = 'continuous';
              break;
            case 'dnorm':
              newCrit.dataType = 'continuous';
              break;
            case 'dbeta':
              newCrit.dataType = 'dichotomous';
              break;
            default:
              newCrit.dataType = 'Unknown';
          }
        }
        return newCrit;
      });
    }

    // Private functions
    function buildCriteria(criteria) {
      var newCriteria = _.map(criteria, function (criterion) {
        return {
          title: criterion.title,
          description: criterion.description,
          unitOfMeasurement: criterion.unitOfMeasurement,
          scale: buildScale(criterion),
          source: criterion.source,
          sourceLink: criterion.sourceLink,
          strengthOfEvidence: criterion.strengthOfEvidence
        };
      });
      return _.keyBy(newCriteria, 'title');
    }

    function buildAlternatives(treatments) {
      var alternatives = {};
      _.forEach(treatments, function (treatment) {
        alternatives[treatment.title] = {
          title: treatment.title
        };
      });
      return alternatives;
    }

    function buildPerformanceTable(inputData, criteria, treatments) {
      var newPerformanceTable = [];
      _.forEach(criteria, function (criterion) {
        _.forEach(treatments, function (treatment) {
          var cell = inputData[criterion.hash][treatment.hash];
          newPerformanceTable.push({
            alternative: treatment.title,
            criterion: criterion.title,
            performance: inputTypeKnowledge[cell.inputType].buildPerformance(cell)
          });
        });
      });
      return newPerformanceTable;
    }

    function isNullNaNOrUndefinedOrNegative(value) {
      return isNullNaNOrUndefined(value) || value < 0;
    }

    function isNullNaNOrUndefined(value) {
      return value === null || value === undefined || isNaN(value);
    }

    function checkInterval(value, lowerBound, upperBound) {
      if (isNullNaNOrUndefined(lowerBound) || isNullNaNOrUndefined(upperBound)) {
        return 'Missing or invalid convidence interval';
      } else if (lowerBound > value || value > upperBound) {
        return 'Lower bound too high, or upper bound too low';
      }
    }

    function valueToString(cell) {
      if (!checkInputValues(cell)) {
        return cell.firstParameter + NO_DISTRIBUTION;
      } else {
        return 'Missing or invalid input';
      }
    }

    function valueSEToString(cell, isNormal) {
      if (!checkInputValues(cell)) {
        var returnString = cell.firstParameter + ' (' + cell.secondParameter + ')';
        if (isNormal) {
          return returnString + '\nNormal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        }
        return returnString + NO_DISTRIBUTION;
      } else {
        return 'Missing or invalid input';
      }
    }

    function valueCIToString(cell, isNormal) {
      if (!checkInputValues(cell)) {
        var returnString = cell.firstParameter + ' (' + cell.secondParameter + '; ' + cell.thirdParameter + ')';
        if (isNormal) {
          return returnString + '\nNormal(' + cell.firstParameter + ', ' + ((cell.thirdParameter - cell.secondParameter) / (2 * 1.96)) + ')';
        }
        return returnString + NO_DISTRIBUTION;
      } else {
        return 'Missing or invalid input';
      }
    }

    function valueCIPercentToString(cell) {
      if (!checkInputValues(cell)) {
        return cell.firstParameter + '% (' + cell.secondParameter + '%; ' + cell.thirdParameter + '%)' + NO_DISTRIBUTION;
      } else {
        return 'Missing or invalid input';
      }
    }

    function isInteger(value) {
      return value % 1 === 0;
    }

    return {
      createProblem: createProblem,
      inputToString: inputToString,
      checkInputValues: checkInputValues,
      prepareInputData: prepareInputData,
      createInputFromOldWorkspace: createInputFromOldWorkspace,
      copyWorkspaceCriteria: copyWorkspaceCriteria,
      getOptions: getOptions
    };
  };

  return dependencies.concat(ManualInputService);
});