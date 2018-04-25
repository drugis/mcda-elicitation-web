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
            manualBeta: {
              id: 'manualBeta',
              label: 'Beta',
              firstParameter: buildIntegerAboveZero('alpha'),
              secondParameter: buildIntegerAboveZero('beta'),
            },
            manualNormal: {
              id: 'manualNormal',
              label: 'Normal',
              firstParameter: buildDefined('mean'),
              secondParameter: buildPositiveFloat('Standard error')
            },
            manualGamma: {
              id: 'manualGamma',
              label: 'Gamma',
              firstParameter: buildFloatAboveZero('alpha'),
              secondParameter: buildFloatAboveZero('beta')
            },
            manualExact: {
              id: 'manualExact',
              label: 'Exact',
              firstParameter: buildDefined('Value'),
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
          return buildBetaPerformance(cell.firstParameter, cell.secondParameter);
        },
      },
      manualNormal: {
        toString: function (cell) {
          return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        },
        buildPerformance: function (cell) {
          return buildNormalPerformance(cell.firstParameter, cell.secondParameter);
        }
      },
      manualGamma: {
        toString: function (cell) {
          return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
        },
        buildPerformance: function (cell) {
          return buildGammaPerformance(cell.firstParameter, cell.secondParameter);
        }
      },
      manualExact: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter);
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
            dichotomousDecimal: {
              id: 'dichotomousDecimal',
              label: 'Decimal',
              firstParameter: buildPositiveWithMax('Value', 1.0)
            },
            dichotomousDecimalSampleSize: {
              id: 'dichotomousDecimalSampleSize',
              label: 'Decimal, sample size',
              firstParameter: buildPositiveWithMax('Value', 1.0),
              secondParameter: buildIntegerAboveZero('Sample size'),
              canBeNormal: true
            },
            dichotomousPercentage: {
              id: 'dichotomousPercentage',
              label: 'Percentage',
              firstParameter: buildPositiveWithMax('Value', 100)
            },
            dichotomousPercentageSampleSize: {
              id: 'dichotomousPercentageSampleSize',
              label: 'Percentage, sample size',
              firstParameter: buildPositiveWithMax('Value', 100),
              secondParameter: buildIntegerAboveZero('Sample size'),
              canBeNormal: true
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
      dichotomousDecimal: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter);
        },
      },
      dichotomousDecimalSampleSize: {
        toString: function (cell) {
          var proportion = cell.firstParameter;
          var sampleSize = cell.secondParameter;
          var returnString = proportion + ' (' + sampleSize + ')';
          if (cell.isNormal) {
            var sigma = Math.sqrt(proportion * (1 - proportion) / sampleSize);
            returnString += '\nNormal(' + proportion + ', ' + sigma + ')';
          } else {
            returnString += NO_DISTRIBUTION;
          }
          return returnString;
        },
        buildPerformance: function (cell) {
          if (cell.isNormal) {
            var proportion = cell.firstParameter;
            var sampleSize = cell.secondParameter;
            var sigma = stdErr(proportion, sampleSize);
            var input = {
              mu: proportion,
              sampleSize: sampleSize
            };
            return buildNormalPerformance(proportion, sigma, input);
          } else {
            return buildExactPerformance(cell.firstParameter, {
              value: cell.firstParameter,
              sampleSize: cell.secondParameter
            });
          }
        }
      },
      dichotomousPercentage: {
        toString: function (cell) {
          return cell.firstParameter + '%' + NO_DISTRIBUTION;
        },
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter / 100, {
            value: cell.firstParameter,
            scale: 'percentage'
          });
        }
      },
      dichotomousPercentageSampleSize: {
        toString: function (cell) {
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
        buildPerformance: function (cell) {
          if (cell.isNormal) {
            var proportion = cell.firstParameter / 100;
            var sampleSize = cell.secondParameter;
            var sigma = stdErr(proportion, sampleSize);
            var input = {
              mu: cell.firstParameter,
              sampleSize: cell.secondParameter,
              scale: 'percentage'
            };
            return buildNormalPerformance(cell.firstParameter / 100, sigma, input);
          } else {
            return buildExactPerformance(cell.firstParameter / 100, {
              value: cell.firstParameter,
              sampleSize: cell.secondParameter,
              scale: 'percentage'
            });
          }

        }
      },
      dichotomousFraction: {
        toString: function (cell) {
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
        buildPerformance: function (cell) {
          var input = {
            events: cell.firstParameter,
            sampleSize: cell.secondParameter
          };
          if (cell.isNormal) {
            var mu = cell.firstParameter / cell.secondParameter;
            var sigma = stdErr(mu, cell.secondParameter);
            return buildNormalPerformance(mu, sigma, input);
          } else {
            return buildExactPerformance(cell.firstParameter / cell.secondParameter, input);
          }
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
      },
      median: {
        toString: function (cell) {
          return CONTINUOUS_MEDIAN_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        },
        buildPerformance: function (cell) {
          return CONTINUOUS_MEDIAN_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        options: {
          continuousMedianNoDispersion: {
            id: 'continuousMedianNoDispersion',
            label: 'Median',
            firstParameter: buildDefined('Median'),
          },
          continuousMedianConfidenceInterval: buildConfidenceInterval('continuousMedianConfidenceInterval', 'Median')
        }
      },
      cumulativeProbability: {
        toString: function (cell) {
          return CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE[cell.inputParameters.id].toString(cell);
        }, buildPerformance: function (cell) {
          return CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE[cell.inputParameters.id].buildPerformance(cell);
        },
        options: {
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
        }
      }
    };
    var CONTINUOUS_MEAN_KNOWLEDGE = {
      continuousMeanNoDispersion: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter);
        }
      },
      continuousMeanStdErr: {
        toString: valueSEToString,
        buildPerformance: function (cell) {
          if (cell.isNormal) {
            return buildNormalPerformance(cell.firstParameter, cell.secondParameter);
          } else {
            return buildExactPerformance(cell.firstParameter, {
              value: cell.firstParameter,
              stdErr: cell.secondParameter
            });
          }
        }
      },
      continuousMeanConfidenceInterval: {
        toString: valueCIToString,
        buildPerformance: function (cell) {
          if (cell.isNormal) {
            var sigma = boundsToStandardError(cell.secondParameter, cell.thirdParameter)
            return buildNormalPerformance(cell.firstParameter, sigma, {
              mu: cell.firstParameter,
              lowerBound: cell.secondParameter,
              upperBound: cell.thirdParameter
            });
          }
        }
      }
    };
    var CONTINUOUS_MEDIAN_KNOWLEDGE = {
      continuousMedianNoDispersion: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter);
        }
      },
      continuousMedianConfidenceInterval: {
        toString: valueCIToString,
        buildPerformance: function (cell) {
          return buildExactConfidencePerformance(cell);
        }
      }
    };
    var CONTINUOUS_CUMULATIVE_PROBABILITY_KNOWLEDGE = {
      cumulativeProbabilityValue: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter);
        },
      },
      cumulativeProbabilityValueCI: {
        toString: function (cell) {
          return cell.scale === 'decimal' ? valueCIToString(cell) : valueCIPercentToString(cell);
        },
        buildPerformance: function (cell) {
          if (cell.scale === 'Decimal') {
            return buildExactConfidencePerformance(cell);
          } else {
            return buildExactPerformance(cell.firstParameter / 100, {
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
      value: {
        toString: valueToString,
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter);
        }
      },
      valueSE: {
        toString: valueSEToString,
        buildPerformance: function (cell) {
          return buildExactPerformance(cell.firstParameter, {
            value: cell.firstParameter,
            stdErr: cell.secondParameter
          });

        }
      },
      valueCI: {
        toString: valueCIToString,
        buildPerformance: function (cell) {
          return buildExactConfidencePerformance(cell);
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
          return buildBetaPerformance(cell.firstParameter + 1, cell.secondParameter - cell.firstParameter + 2);
        },
        options: {
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
          assistedContinuousStdErr: {
            id: 'assistedContinuousStdErr',
            label: 'Student\'s t, SE',
            firstParameter: buildDefined('Mean'),
            secondParameter: buildPositiveFloat('Standard error'),
          },
          assistedContinuousStdDev: {
            id: 'assistedContinuousStdDev',
            label: 'Student\'s t, SD',
            firstParameter: buildDefined('Mean'),
            secondParameter: buildPositiveFloat('Standard deviation'),
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
          return buildStudentTPerformance(cell.first, cell.secondParameter, cell.thirdParameter - 1);
        }
      },
      assistedContinuousStdDev: {
        toString: function (cell) {
          var mu = cell.firstParameter;
          var sigma = standardDeviationToStandardError(cell.secondParameter, cell.thirdParameter);
          var sampleSize = cell.thirdParameter;
          return mu + ' (' + cell.secondParameter + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';

        }, buildPerformance: function (cell) {
          return buildStudentTPerformance(cell.first, standardDeviationToStandardError(cell.secondParameter, cell.thirdParameter), cell.thirdParameter - 1);
        }
      }
    };

    // Exposed functions
    function getInputError(cell) {
      var error;
      var inputParameters = _.pick(cell.inputParameters, ['firstParameter', 'secondParameter', 'thirdParameter']);
      _.find(inputParameters, function (inputParameter, key) {
        var inputValue = cell[key];
        return _.find(inputParameter.constraints, function (constraint) {
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
      return INPUT_TYPE_KNOWLEDGE[cell.inputType].toString(cell);
    }

    function getOptions(cell) {
      return INPUT_TYPE_KNOWLEDGE[cell.inputType].getOptions(cell);
    }

    function createProblem(criteria, treatments, title, description, inputData, useFavorability) {
      var problem = {
        title: title,
        description: description,
        criteria: buildCriteria(criteria),
        alternatives: buildAlternatives(treatments),
        performanceTable: buildPerformanceTable(inputData, criteria, treatments)
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

    function copyWorkspaceCriteria(workspace) {
      return _.map(workspace.problem.criteria, function (criterion, key) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement', 'strengthOfEvidence', 'uncertainties']);
        if (workspace.problem.valueTree) {
          newCrit.isFavorable = _.includes(workspace.problem.valueTree.children[0].criteria, key) ? true : false;
        }
        var tableEntry = _.find(workspace.problem.performanceTable, ['criterion', key]);
        switch (tableEntry.performance.type) {
          case 'exact':
            if (tableEntry.input) {
              //
            } else {
              newCrit.inputType = 'distribution';
              newCrit.inputMethod = 'manualDistribution';
            }
            break;
          case 'dnorm':
            if (tableEntry.input) {
              //
            } else {
              newCrit.inputType = 'distribution';
              newCrit.inputMethod = 'manualDistribution';
            }
            break;
          case 'dbeta':
            newCrit.inputType = 'distribution';
            newCrit.inputMethod = 'manualDistribution';
            break;
          case 'dgamma':
            newCrit.inputType = 'distribution';
            newCrit.inputMethod = 'manualDistribution';
            break;
          case 'dt':
            newCrit.inputType = 'distribution';
            newCrit.inputMethod = 'assistedDistribution';
            newCrit.dataType = 'continuous';
            break;
          default:
            newCrit.inputType = 'Unknown';
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

    function buildAlternatives(alternatives) {
      return _.reduce(alternatives, function (accum, alternative) {
        accum[alternative.title] = {
          title: alternative.title
        };
        return accum;
      }, {});
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
        constraints: [
          ConstraintService.defined(),
        ]
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

    // build performances
    function buildExactPerformance(value, input) {
      return {
        type: 'exact',
        value: value,
        input: input
      };
    }

    function buildExactConfidencePerformance(cell) {
      return buildExactPerformance(cell.firstParameter, {
        value: cell.firstParameter,
        lowerBound: cell.secondParameter,
        upperBound: cell.thirdParameter
      });
    }

    function buildNormalPerformance(mu, sigma, input) {
      return {
        type: 'dnorm',
        parameters: {
          mu: mu,
          sigma: sigma
        },
        input: input
      };
    }

    function buildBetaPerformance(alpha, beta, input) {
      return {
        type: 'dbeta',
        parameters: {
          alpha: alpha,
          beta: beta
        },
        input: input
      };
    }

    function buildGammaPerformance(alpha, beta, input) {
      return {
        type: 'dgamma',
        parameters: {
          alpha: alpha,
          beta: beta
        },
        input: input
      };
    }

    function buildStudentTPerformance(mu, sigma, dof, input) {
      return {
        type: 'dt',
        parameters: {
          mu: mu,
          stdErr: sigma,
          dof: dof
        },
        input: input
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

    function standardDeviationToStandardError(standardDeviation, sampleSize) {
      return Math.round(1000 * standardDeviation / Math.sqrt(sampleSize)) / 1000;
    }

    return {
      createProblem: createProblem,
      inputToString: inputToString,
      getInputError: getInputError,
      prepareInputData: prepareInputData,
      createInputFromOldWorkspace: undefined,//createInputFromOldWorkspace,
      copyWorkspaceCriteria: copyWorkspaceCriteria,
      getOptions: getOptions
    };
  };

  return dependencies.concat(ManualInputService);
});