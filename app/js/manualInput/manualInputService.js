'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = ['ConstraintService'];
  var ManualInputService = function (ConstraintService) {
    var NO_DISTRIBUTION = '\nDistribution: none';
    var INVALID_INPUT_MESSAGE = 'Missing or invalid input';

    var INPUT_TYPE_KNOWLEDGE = {
      distribution: {
        toString: function (cell) {
          return DISTRIBUTION_KNOWLEDGE[cell.inputMethod].toString(cell);
        },
        buildPerformance: function (cell) {
          return DISTRIBUTION_KNOWLEDGE[cell.inputMethod].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return DISTRIBUTION_KNOWLEDGE[cell.inputMethod].getOptions(cell);
        }
      },
      effect: {
        toString: function (cell) {
          return EFFECT_KNOWLEDGE[cell.dataType].toString(cell);
        },
        buildPerformance: function (cell) {
          return EFFECT_KNOWLEDGE[cell.dataType].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return EFFECT_KNOWLEDGE[cell.dataType].getOptions(cell);
        }
      }
    };
    var DISTRIBUTION_KNOWLEDGE = {
      assistedDistribution: {
        toString: function (cell) {
          return ASSISTED_DISTRIBUTION_KNOWLEDGE[cell.dataType].toString(cell);
        },
        buildPerformance: function (cell) {
          return ASSISTED_DISTRIBUTION_KNOWLEDGE[cell.dataType].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return ASSISTED_DISTRIBUTION_KNOWLEDGE[cell.dataType].options;
        }
      },
      manualDistribution: {
        toString: function (cell) {
          return MANUAL_DISTRIBUTION_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        },
        buildPerformance: function (cell) {
          return MANUAL_DISTRIBUTION_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        getOptions: function () {
          return {
            beta: {
              id: 'manualBeta',
              label: 'Beta',
              firstParameter: {
                label: 'alpha',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.above(0),
                  ConstraintService.integer()
                ]
              },
              secondParameter: {
                label: 'beta',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.above(0),
                  ConstraintService.integer()
                ]
              }
            },
            normal: {
              id: 'manualNormal',
              label: 'Normal',
              firstParameter: {
                label: 'mean',
                constraints: [
                  ConstraintService.defined(),
                ]
              },
              secondParameter: {
                label: 'SE',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.above(0)
                ]
              }
            },
            gamma: {
              id: 'manualGamma',
              label: 'Gamma',
              firstParameter: {
                label: 'alpha',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.above(0)
                ]
              },
              secondParameter: {
                label: 'beta',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.above(0)
                ]
              }
            }
          };
        }
      }
    };
    var MANUAL_DISTRIBUTION_KNOWLEDGE = {
      manualBeta: {
        toString: function (cell) {
          return 'Beta(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        },
        buildPerformance: function (cell) {
          return {
            type: 'dbeta',
            parameters: {
              alpha: cell.firstParameter,
              beta: cell.secondParameter
            }
          };
        }
      },
      manualNormal: {
        toString: function (cell) {
          return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        },
        buildPerformance: function (cell) {
          return {
            type: 'dnorm',
            parameters: {
              mu: cell.firstParameter,
              sigma: cell.secondParameter
            }
          };
        }
      },
      manualGamma: {
        toString: function (cell) {
          return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        },
        buildPerformance: function (cell) {
          return {
            type: 'dgamma',
            parameters: {
              alpha: cell.firstParameter,
              beta: cell.secondParameter
            }
          };
        }
      }
    };
    var EFFECT_KNOWLEDGE = {
      dichotomous: {
        toString: function (cell) {
          return DICHOTOMOUS_EFFECT_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        },
        buildPerformance: function (cell) {
          return DICHOTOMOUS_EFFECT_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        getOptions: function () {
          return {
            decimal: {
              id: 'dichotomousDecimal',
              label: 'Decimal',
              firstParameter: {
                label: 'Value',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.positive(),
                  ConstraintService.belowOrEqualTo(1.0)
                ]
              },
              secondParameter: {
                label: 'Sample size (optional)',
                constraints: [
                  ConstraintService.notNaNOrNull(),
                  ConstraintService.positive(),
                  ConstraintService.integer()
                ]
              },
              canBeNormal: true
            },
            percentage: {
              id: 'dichotomousPercentage',
              label: 'Percentage',
              firstParameter: {
                label: 'Value',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.positive(),
                  ConstraintService.belowOrEqualTo(100)
                ]
              },
              secondParameter: {
                label: 'Sample size (optional)',
                constraints: [
                  ConstraintService.notNaNOrNull(),
                  ConstraintService.positive(),
                  ConstraintService.integer()
                ]
              },
              canBeNormal: true
            },
            fraction: {
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
              secondParameter: {
                label: 'Sample size',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.aboveOrEqualTo(1),
                  ConstraintService.integer()
                ]
              },
              canBeNormal: true
            }
          };
        }
      },
      continuous: {
        toString: function (cell) {
          return CONTINUOUS_KNOWLEDGE[cell.parameterOfInterest].toString(cell);
        },
        buildPerformance: function (cell) {
          return CONTINUOUS_KNOWLEDGE[cell.parameterOfInterest].buildPerformance(cell);
        },
        getOptions: function (cell) {
          return CONTINUOUS_KNOWLEDGE[cell.parameterOfInterest].options;
        }
      },
      other: {
        toString: function (cell) {
          return OTHER_EFFECT_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        },
        buildPerformance: function (cell) {
          return OTHER_EFFECT_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        getOptions: function () {
          return {
            value: {
              id: 'value',
              label: 'Value',
              firstParameter: {
                label: 'Value',
                constraints: [
                  ConstraintService.defined()
                ]
              }
            },
            valueSE: {
              id: 'valueSE',
              label: 'Value, SE',
              firstParameter: {
                label: 'Value',
                constraints: [
                  ConstraintService.defined()
                ]
              },
              secondParameter: {
                label: 'Standard error',
                constraints: [
                  ConstraintService.defined(),
                  ConstraintService.positive()
                ]
              }
            },
            valueCI: createConfidenceInterval('valueCI', 'Value')
          };
        }
      }
    };
    var DICHOTOMOUS_EFFECT_KNOWLEDGE = {
      dichotomousDecimal: {
        toString: function (cell) {
          var proportion = cell.firstParameter;
          var sampleSize = cell.secondParameter;
          var returnString = proportion;
          if (sampleSize) {
            returnString = returnString + ' (' + sampleSize + ')';
          }
          if (cell.isNormal) {
            var sigma = Math.sqrt(proportion * (1 - proportion) / sampleSize);
            returnString += '\nNormal(' + proportion + ', ' + sigma + ')';
          } else {
            returnString += NO_DISTRIBUTION;
          }
          return returnString;
        },
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter,
            isNormal: cell.isNormal
          };
        }
      },
      dichotomousPercentage: {
        toString: function (cell) {
          var percentage = cell.firstParameter;
          var sampleSize = cell.secondParameter;
          var returnString = percentage + '%';
          if (sampleSize) {
            returnString = returnString + ' (' + sampleSize + ')';
          }
          if (cell.isNormal) {
            var proportion = percentage / 100;
            var sigma = Math.round(Math.sqrt(proportion * (1 - proportion) / sampleSize) * 1000) / 1000;
            returnString += '\nNormal(' + proportion + ', ' + sigma + ')';
          } else {
            returnString += NO_DISTRIBUTION;
          }
          return returnString;
        },
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter / 100,
            percentage: true,
            isNormal: cell.isNormal
          };
        }
      },
      dichotomousFraction: {
        toString: function (cell) {
          var sampleSize = cell.secondParameter;
          var returnString = cell.firstParameter + ' / ' + sampleSize;
          if (cell.isNormal) {
            var proportion = cell.firstParameter / sampleSize;
            var sigma = Math.round(Math.sqrt(proportion * (1 - proportion) / sampleSize) * 1000) / 1000;
            returnString += '\nNormal(' + proportion + ', ' + sigma + ')';
          } else {
            returnString += NO_DISTRIBUTION;
          }
          return returnString;

        },
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: (cell.firstParameter / cell.secondParameter),
            events: cell.firstParameter,
            sampleSize: cell.secondParameter,
            isNormal: cell.isNormal
          };
        }
      },
    };
    var CONTINUOUS_KNOWLEDGE = {
      mean: {
        toString: function (cell) {
          return CONTINUOUS_MEAN_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        }, buildPerformance: function (cell) {
          return CONTINUOUS_MEAN_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        options: {
          mean: {
            id: 'continuousMeanNoDispersion',
            label: 'Mean',
            firstParameter: {
              label: 'Mean',
              constraints: [
                ConstraintService.defined()
              ]
            }
          },
          meanSE: {
            id: 'continuousMeanStdErr',
            label: 'Mean, SE',
            firstParameter: {
              label: 'Mean',
              constraints: [
                ConstraintService.defined()
              ]
            },
            secondParameter: {
              label: 'Standard error',
              constraints: [
                ConstraintService.defined(),
                ConstraintService.positive()
              ]
            },
            canBeNormal: true
          },
          meanCI: _.extend(createConfidenceInterval('continuousMeanConfidenceInterval', 'Mean'), {
            canBeNormal: true
          })
        }
      },
      median: {
        toString: function (cell) {
          return CONTINUOUS_MEDIAN_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        },
        buildPerformance: function (cell) {
          return CONTINUOUS_MEDIAN_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        options: {
          median: {
            id: 'continuousMedianNoDispersion',
            label: 'Median',
            firstParameter: {
              label: 'Median',
              constraints: [
                ConstraintService.defined()
              ]
            }
          },
          medianCI: createConfidenceInterval('continuousMedianConfidenceInterval', 'Median')
        }
      },
      cumulativeProbability: {
        toString: function (cell) {
          return CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        }, buildPerformance: function (cell) {
          return CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        options: {
          value: {
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
          valueCI: _.extend(createConfidenceInterval('cumulativeProbabilityValueCI', 'Value'), {
            scale: {
              percentage: 'Percentage',
              decimal: 'Decimal'
            }
          })
        }
      }
    };
    var CONTINUOUS_MEAN_KNOWLEDGE = {
      continuousMeanNoDispersion: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter
          };
        }
      },
      continuousMeanStdErr: {
        toString: valueSEToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter,
            stdErr: cell.secondParameter,
            isNormal: cell.isNormal
          };
        }
      },
      continuousMeanConfidenceInterval: {
        toString: valueCIToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter,
            lowerBound: cell.secondParameter,
            upperBound: cell.thirdParameter,
            isNormal: cell.isNormal
          };
        }
      }
    };
    var CONTINUOUS_MEDIAN_KNOWLEDGE = {
      continuousMedianNoDispersion: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter
          };
        }
      },
      continuousMedianConfidenceInterval: {
        toString: valueCIToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter,
            lowerBound: cell.secondParameter,
            upperBound: cell.thirdParameter
          };
        }
      }
    };
    var CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE = {
      cumulativeProbabilityValue: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter
          };
        }
      },
      cumulativeProbabilityValueCI: {
        toString: function (cell) {
          return cell.scale === 'decimal' ? valueCIToString(cell) : valueCIPercentToString(cell);
        },
        buildPerformance: function (cell) {
          if (cell.scale === 'Decimal') {
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
      }
    };
    var OTHER_EFFECT_KNOWLEDGE = {
      value: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter
          };
        }
      },
      valueSE: {
        toString: valueSEToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter,
            stdErr: cell.secondParameter
          };
        }
      },
      valueCI: {
        toString: valueCIToString,
        buildPerformance: function (cell) {
          return {
            type: 'exact',
            value: cell.firstParameter,
            lowerBound: cell.secondParameter,
            upperBound: cell.thirdParameter
          };
        }
      }
    };
    var ASSISTED_DISTRIBUTION_KNOWLEDGE = {
      dichotomous: {
        toString: function (cell) {
          var events = cell.firstParameter;
          var sampleSize = cell.secondParameter;
          return events + ' / ' + sampleSize + '\nDistribution: Beta(' + (events + 1) + ', ' + (sampleSize - events + 2) + ')';
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
            firstParameter: {
              label: 'Events',
              constraints: [
                ConstraintService.defined(),
                ConstraintService.positive(),
                ConstraintService.integer(),
                ConstraintService.belowOrEqualTo('secondParameter')
              ]
            },
            secondParameter: {
              label: 'Sample size',
              constraints: [
                ConstraintService.defined(),
                ConstraintService.above(0),
                ConstraintService.integer()
              ]
            }
          }
        }
      },
      continuous: {
        toString: function (cell) {
          return ASSISTED_DISTRIBUTION_CONTINUOUS_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        },
        buildPerformance: function (cell) {
          return ASSISTED_DISTRIBUTION_CONTINUOUS_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        options: {
          stdErr: {
            id: 'assistedContinuousStdErr',
            label: 'Student\'s t, SE',
            firstParameter: {
              label: 'Mean',
              constraints: [
                ConstraintService.defined()
              ]
            },
            secondParameter: {
              label: 'Standard error',
              constraints: [
                ConstraintService.defined(),
                ConstraintService.positive()
              ]
            },
            thirdParameter: {
              label: 'Sample size',
              constraints: [
                ConstraintService.defined(),
                ConstraintService.above(0),
                ConstraintService.integer()
              ]
            }
          },
          stdDev: {
            id: 'assistedContinuousStdDev',
            label: 'Student\'s t, SD',
            firstParameter: {
              label: 'Mean',
              constraints: [
                ConstraintService.defined()
              ]
            },
            secondParameter: {
              label: 'Standard deviation',
              constraints: [
                ConstraintService.defined(),
                ConstraintService.positive()]
            },
            thirdParameter: {
              label: 'Sample size',
              constraints: [
                ConstraintService.defined(),
                ConstraintService.above(0)(),
                ConstraintService.integer()()
              ]
            }
          }
        }
      },
      other: {
        toString: valueToString,
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
            firstParameter: {
              label: 'Value',
              constraints: [
                ConstraintService.defined()
              ]
            }
          }
        }
      }
    };
    var ASSISTED_DISTRIBUTION_CONTINUOUS_KNOWLEDGE = {
      assistedContinuousStdErr: {
        toString: function (cell) {
          var mu = cell.firstParameter;
          var sigma = cell.secondParameter;
          var sampleSize = cell.thirdParameter;
          return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';

        }, buildPerformance: function (cell) {
          return {
            type: 'dt',
            parameters: {
              mu: cell.firstParameter,
              stdErr: cell.secondParameter,
              dof: cell.thirdParameter - 1
            }
          };
        }
      },
      assistedContinuousStdDev: {
        toString: function (cell) {
          var mu = cell.firstParameter;
          var sigma = standardDeviationToStandardError(cell.secondParameter, cell.thirdParameter);
          var sampleSize = cell.thirdParameter;
          return mu + ' (' + cell.secondParameter + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';

        }, buildPerformance: function (cell) {
          return {
            type: 'dt',
            parameters: {
              mu: cell.firstParameter,
              stdErr: standardDeviationToStandardError(cell.secondParameter, cell.thirdParameter),
              dof: cell.thirdParameter - 1
            }
          };
        }
      }
    };

    // Exposed functions
    function getInputError(cell) {
      var error;
      var inputValues = _.pick(cell, ['firstParameter', 'secondParameter', 'thirdParameter']);
      _.find(_.toPairs(inputValues), function (inputPair) {
        var inputParameter = cell.inputParameters[inputPair[0]];
        var inputValue = inputPair[1];
        return _.find(inputParameter.constraints, function (constraint) {
          error = constraint(inputValue, inputParameter.label, inputValues);
          return error;
        });
      });
      return error;
    }

    function inputToString(cell) {
      if (getInputError(cell)) {
        return INVALID_INPUT_MESSAGE;
      }
      return INPUT_TYPE_KNOWLEDGE[cell.inputType].toString(cell);
    }

    function getOptions(cell) {
      return INPUT_TYPE_KNOWLEDGE[cell.inputType].getOptions(cell);
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

    // function createInputFromOldWorkspace(criteria, alternatives, oldWorkspace, inputData) {
    //   var newInputData = _.cloneDeep(inputData);
    //   _.forEach(criteria, function (criterion) {
    //     _.forEach(alternatives, function (alternative) {
    //       var critKey;
    //       _.forEach(oldWorkspace.problem.criteria, function (problemCrit, key) {
    //         if (problemCrit.title === criterion.title) {
    //           critKey = key;
    //         }
    //       });
    //       var altKey;
    //       _.forEach(oldWorkspace.problem.alternatives, function (problemAlt, key) {
    //         if (problemAlt.title === alternative.title) {
    //           altKey = key;
    //         }
    //       });
    //       var tableEntry = _.find(oldWorkspace.problem.performanceTable, function (tableEntry) {
    //         return tableEntry.criterion === critKey && tableEntry.alternative === altKey;
    //       });
    //       if (tableEntry) {
    //         var inputDataCell = _.cloneDeep(newInputData[criterion.hash][alternative.hash]);
    //         switch (tableEntry.performance.type) {
    //           case 'exact':
    //             inputDataCell.value = tableEntry.performance.value;
    //             inputDataCell.exactType = 'exact';
    //             if (tableEntry.performance.stdErr) {
    //               inputDataCell.stdErr = tableEntry.performance.stdErr;
    //               inputDataCell.isNormal = tableEntry.performance.isNormal;
    //               inputDataCell.exactType = 'exactSE';
    //             }
    //             if (tableEntry.performance.lowerBound) {
    //               inputDataCell.lowerBound = tableEntry.performance.lowerBound;
    //               inputDataCell.upperBound = tableEntry.performance.upperBound;
    //               inputDataCell.isNormal = tableEntry.performance.isNormal;
    //               inputDataCell.exactType = 'exactConf';
    //             }
    //             break;
    //           case 'dt':
    //             inputDataCell.sampleSize = tableEntry.performance.parameters.dof + 1;
    //             inputDataCell.stdErr = tableEntry.performance.parameters.stdErr;
    //             inputDataCell.mu = tableEntry.performance.parameters.mu;
    //             inputDataCell.continuousType = 'SEt';
    //             break;
    //           case 'dnorm':
    //             inputDataCell.stdErr = tableEntry.performance.parameters.sigma;
    //             inputDataCell.mu = tableEntry.performance.parameters.mu;
    //             inputDataCell.continuousType = 'SEnorm';
    //             break;
    //           case 'dbeta':
    //             inputDataCell.count = tableEntry.performance.parameters.alpha - 1;
    //             inputDataCell.sampleSize = tableEntry.performance.parameters.beta + inputDataCell.count - 1;
    //             break;
    //           case 'dsurv':
    //             inputDataCell.events = tableEntry.performance.parameters.alpha - 0.001;
    //             inputDataCell.exposure = tableEntry.performance.parameters.beta - 0.001;
    //             inputDataCell.summaryMeasure = tableEntry.performance.parameters.summaryMeasure;
    //             inputDataCell.timeScale = tableEntry.performance.parameters.time;
    //             break;
    //         }
    //         inputDataCell.isInvalid = getInputError(inputDataCell);
    //         inputDataCell.label = inputToString(inputDataCell);
    //         newInputData[criterion.hash][alternative.hash] = inputDataCell;
    //       }
    //     });
    //   });
    //   return newInputData;
    // }

    // function copyWorkspaceCriteria(workspace) {
    //   return _.map(workspace.problem.criteria, function (criterion, key) {
    //     var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement', 'strengthOfEvidence', 'uncertainties']);
    //     if (workspace.problem.valueTree) {
    //       newCrit.isFavorable = _.includes(workspace.problem.valueTree.children[0].criteria, key) ? true : false;
    //     }
    //     var tableEntry = _.find(workspace.problem.performanceTable, ['criterion', key]);
    //     newCrit.dataSource = tableEntry.performance.type === 'exact' ? 'exact' : 'study';
    //     if (newCrit.dataSource === 'study') {
    //       switch (tableEntry.performance.type) {
    //         case 'dsurv':
    //           newCrit.dataType = 'survival';
    //           newCrit.summaryMeasure = tableEntry.performance.parameters.summaryMeasure;
    //           newCrit.timePointOfInterest = tableEntry.performance.parameters.time;
    //           newCrit.timeScale = 'time scale not set';
    //           break;
    //         case 'dt':
    //           newCrit.dataType = 'continuous';
    //           break;
    //         case 'dnorm':
    //           newCrit.dataType = 'continuous';
    //           break;
    //         case 'dbeta':
    //           newCrit.dataType = 'dichotomous';
    //           break;
    //         default:
    //           newCrit.dataType = 'Unknown';
    //       }
    //     }
    //     return newCrit;
    //   });
    // }

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
            performance: INPUT_TYPE_KNOWLEDGE[cell.inputType].buildPerformance(cell)
          });
        });
      });
      return newPerformanceTable;
    }

    function createConfidenceInterval(id, label) {
      return {
        id: id,
        label: label + ', 95% C.I.',
        firstParameter: {
          label: label,
          constraints: [
            ConstraintService.defined()
          ]
        },
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

    function standardDeviationToStandardError(standardDeviation, sampleSize) {
      return Math.round(1000 * standardDeviation / Math.sqrt(sampleSize)) / 1000;
    }
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
        return returnString + '\nNormal(' + cell.firstParameter + ', ' + ((cell.thirdParameter - cell.secondParameter) / (2 * 1.96)) + ')';
      }
      return returnString + NO_DISTRIBUTION;
    }

    function valueCIPercentToString(cell) {
      return cell.firstParameter + '% (' + cell.secondParameter + '%; ' + cell.thirdParameter + '%)' + NO_DISTRIBUTION;
    }

    return {
      createProblem: createProblem,
      inputToString: inputToString,
      getInputError: getInputError,
      prepareInputData: prepareInputData,
      createInputFromOldWorkspace: undefined,//createInputFromOldWorkspace,
      copyWorkspaceCriteria: undefined,//copyWorkspaceCriteria,
      getOptions: getOptions
    };
  };

  return dependencies.concat(ManualInputService);
});