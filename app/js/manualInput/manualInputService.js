'use strict';
define(['lodash', 'angular'], function (_) {
  var dependencies = [];
  var ManualInputService = function () {
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
        }
      }
    };
    var distributionKnowledge = {
      assistedDistribution: {
        checkInputValues: function (cell) {
          return assistedDistributionKnowlegde[cell.dataType].checkInputValues(cell);
        },
        toString: function (cell) {
          return assistedDistributionKnowlegde[cell.dataType].toString(cell);
        },
        buildPerformance: function (cell) {
          return assistedDistributionKnowlegde[cell.dataType].buildPerformance(cell);
        }
      },
      manualDistribution: {
        checkInputValues: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Beta':
              var alpha = cell.firstParameter;
              var beta = cell.secondParameter;
              if (isNullNaNOrUndefined(alpha) || alpha <= 0) {
                return 'Invalid alpha';
              } else if (isNullNaNOrUndefined(beta) || beta <= 0) {
                return 'Invalid beta';
              } else if (alpha - 1 > (beta + alpha - 2)) {
                return 'Alpha-1 should be greater then Alpha+Beta-2';
              } else if (alpha % 1 !== 0 || beta % 1 !== 0) {
                return 'Values should be integer';
              }
              break;
            case 'Normal':
              var mu = cell.firstParameter;
              var sigma = cell.secondParameter;
              if (isNullNaNOrUndefined(mu)) {
                return 'Invalid mean';
              } else if (isNullNaNOrUndefinedOrNegative(sigma)) {
                return 'Invalid standard error';
              }
              break;
            case 'Gamma':
              var alpha = cell.firstParameter;
              var beta = cell.secondParameter;
              if (isNullNaNOrUndefined(alpha) || alpha <= 0) {
                return 'Invalid alpha';
              } else if (isNullNaNOrUndefined(beta) || beta <= 0) {
                return 'Invalid beta';
              }
              break;
            default:
              return 'Invalid parameters';
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Beta':
              if (!checkInputValues(cell)) {
                return 'Beta(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
              }
            case 'Normal':
              if (!checkInputValues(cell)) {
                return 'Normal(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
              }
            case 'Gamma':
              if (!checkInputValues(cell)) {
                return 'Gamma(' + cell.firstParameter + ', ' + cell.secondParameter + ')';
              }
            default:
              return 'Missing or invalid input';
          }
        },
        buildPerformance: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Beta':
              return {
                type: 'dbeta',
                parameters: {
                  alpha: cell.firstParameter,
                  beta: cell.secondParameter
                }
              };
            case 'Normal':
              return {
                type: 'dnorm',
                parameters: {
                  mu: cell.firstParameter,
                  sigma: cell.secondParameter
                }
              };
            case 'Gamma':
              return {
                type: 'dgamma',
                parameters: {
                  alpha: cell.firstParameter,
                  beta: cell.secondParameter
                }
              };
          }
        }
      }
    };
    var effectKnowledge = {
      dichotomous: {
        checkInputValues: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Decimal':
              if (isNullNaNOrUndefinedOrNegative(cell.firstParameter) || cell.firstParameter > 1) {
                return 'Value should be between or equal to 0 and 1';
              } else if (cell.secondParameter && !isInteger(cell.secondParameter) % 1 !== 0) {
                return 'Sample size should be integer';
              }
              break;
            case 'Percentage':
              if (isNullNaNOrUndefinedOrNegative(cell.firstParameter) || cell.firstParameter > 100) {
                return 'Value should be between or equal to 0 and 100';
              } else if (cell.secondParameter && !isInteger(cell.secondParameter)) {
                return 'Sample size should be integer';
              }
              break;
            case 'Fraction':
              if (isNullNaNOrUndefinedOrNegative(cell.firstParameter) || isNullNaNOrUndefinedOrNegative(cell.secondParameter)) {
                return 'Both values must be defined and non-negative';
              } else if (cell.firstParameter > cell.secondParameter) {
                return 'Number of events may not exceed sample size';
              }
              break;
            default:
              return 'Invalid parameters';
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Decimal':
              if (!checkInputValues(cell)) {
                var returnString = cell.firstParameter;
                if (cell.secondParameter) {
                  returnString = returnString + ' (' + cell.secondParameter + ')';
                }
                return returnString + '\nDistribution: none';
              }
            case 'Percentage':
              if (!checkInputValues(cell)) {
                var returnString = cell.firstParameter + '%';
                if (cell.secondParameter) {
                  returnString = returnString + ' (' + cell.secondParameter + ')';
                }
                return returnString + '\nDistribution: none';
              }
            case 'Fraction':
              if (!checkInputValues(cell)) {
                return cell.firstParameter + ' / ' + cell.secondParameter + '\nDistribution: none';
              }
            default:
              return 'Missing or invalid input';
          }
        }
      },
      continuous: {
        checkInputValues: function (cell) {
          return continuousKnowledge[cell.parameterOfInterest].checkInputValues(cell);
        },
        toString: function (cell) {
          return continuousKnowledge[cell.parameterOfInterest].toString(cell);
        }
      },
      other: {
        checkInputValues: function (cell) {
          var value = cell.firstParameter;
          if (isNullNaNOrUndefined(value)) {
            return 'Missing or invalid value';
          }
          switch (cell.inputParameters.label) {
            case 'Value':
              break;
            case 'Value, SE':
              if (isNullNaNOrUndefinedOrNegative(cell.secondParameter)) {
                return 'Standard error must be positive';
              }
              break;
            case 'Value, 95% C.I.':
              var intervalError = checkInterval(cell.firstParameter, cell.secondParameter, cell.thirdParameter);
              if (intervalError) {
                return intervalError;
              }
              break;
            default:
              return 'Invalid parameters';
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Value':
              return valueToString(cell);
            case 'Value, SE':
              return valueSEToString(cell);
            case 'Value, 95% C.I.':
              return valueCIToString(cell);
            default:
              return 'Missing or invalid input';
          }
        }
      }
    };
    var continuousKnowledge = {
      mean: {
        checkInputValues: function (cell) {
          if (isNullNaNOrUndefined(cell.firstParameter)) {
            return 'Missing or invalid mean';
          }
          switch (cell.inputParameters.label) {
            case 'Mean':
              break;
            case 'Mean, SE':
              if (isNullNaNOrUndefinedOrNegative(cell.secondParameter)) {
                return 'Standard error must be positive';
              }
              break;
            case 'Mean, 95% C.I.':
              var intervalError = checkInterval(cell.firstParameter, cell.secondParameter, cell.thirdParameter);
              if (intervalError) {
                return intervalError;
              }
              break;
            default:
              return 'Invalid parameters';
          }

        },
        toString: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Mean':
              return valueToString(cell);
            case 'Mean, SE':
              return valueSEToString(cell);
            case 'Mean, 95% C.I.':
              return valueCIToString(cell);
            default:
              return 'Missing or invalid input';
          }
        }
      },
      median: {
        checkInputValues: function (cell) {
          if (isNullNaNOrUndefined(cell.firstParameter)) {
            return 'Missing or invalid median';
          }
          switch (cell.inputParameters.label) {
            case 'Median':
              break;
            case 'Median, 95% C.I.':
              var intervalError = checkInterval(cell.firstParameter, cell.secondParameter, cell.thirdParameter);
              if (intervalError) {
                return intervalError;
              }
              break;
            default:
              return 'Invalid parameters';
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Median':
              return valueToString(cell);
            case 'Median, 95% C.I.':
              return valueCIToString(cell);
            default:
              return 'Missing or invalid input';
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
          switch (cell.inputParameters.label) {
            case 'Value':
              break;
            case 'Value, 95% C.I.':
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
              return 'Invalid parameters';
          }
        },
        toString: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Value':
              if (cell.display === 'decimal') {
                return valueToString(cell);
              } else if (cell.display === 'percentage' && !checkInputValues(cell)) {
                return cell.firstParameter + '%\nDistribution: none';
              }

            case 'Value, 95% C.I.':
              if (cell.display === 'decimal') {
                return valueCIToString(cell);
              } else if (cell.display === 'percentage' && !checkInputValues(cell)) {
                return valueCIPercentToString(cell);
              }
            default:
              return 'Missing or invalid input';
          }
        }
      }
    };
    var assistedDistributionKnowlegde = {
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
            return cell.firstParameter + ' / ' + cell.secondParameter + '\nDistribution: Beta(' + (events + 1) + ', ' + (sampleSize - events + 2) + ')';
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
          switch (cell.inputParameters.label) {
            case 'Student\'s t, SE':
              if (!checkInputValues(cell)) {
                return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + sigma + ')';
              }
            case 'Student\'s t, SD':
              if (!checkInputValues(cell)) {
                return mu + ' (' + sigma + '), ' + sampleSize + '\nDistribution: t(' + (sampleSize - 1) + ', ' + mu + ', ' + (Math.round(1000*sigma / Math.sqrt(sampleSize))/1000) + ')';
              }
            default:
              return 'Missing or invalid input';
          }
        },
        buildPerformance: function (cell) {
          switch (cell.inputParameters.label) {
            case 'Student\'s t, SE':
              return {
                type: 'dt',
                parameters: {
                  mu: cell.firstParameter,
                  stdErr: cell.secondParameter,
                  dof: cell.thirdParameter - 1
                }
              };
            case 'Student\'s t, SD':
              return {
                type: 'dt',
                parameters: {
                  mu: cell.firstParameter,
                  stdErr: Math.round(cell.secondParameter / Math.sqrt(cell.secondParameter)*1000)/1000,
                  dof: cell.thirdParameter - 1
                }
              };
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

    function createDistribution(inputCell, criterion) {
      var newData = {};
      // Exact input
      if (criterion.dataSource !== 'study') {
        inputCell.type = 'exact';
        return inputCell;
      }

      // Study data input
      if (criterion.dataType === 'dichotomous') {
        newData.alpha = inputCell.count + 1;
        newData.beta = inputCell.sampleSize - inputCell.count + 1;
        newData.type = 'dbeta';
      } else if (criterion.dataType === 'continuous') {
        newData.mu = inputCell.mu; // All these possibilities have a mu
        switch (inputCell.continuousType) {
          case 'SEnorm':
            newData.sigma = inputCell.stdErr;
            newData.type = 'dnorm';
            break;
          case 'SEt':
            newData.stdErr = inputCell.stdErr;
            newData.dof = inputCell.sampleSize - 1;
            newData.type = 'dt';
            break;
          case 'SD':
            if (inputCell.isNormal) {
              newData.sigma = inputCell.sigma / Math.sqrt(inputCell.sampleSize);
              newData.type = 'dnorm';
            } else {
              newData.stdErr = inputCell.sigma / Math.sqrt(inputCell.sampleSize);
              newData.dof = inputCell.sampleSize - 1;
              newData.type = 'dt';
            }
            break;
          default: // happens when user went back to step 1 and changed a criterion's type
            newData.type = 'dt';
            break;
        }
      } else if (criterion.dataType === 'survival') {
        // survival
        if (_.isNumber(inputCell.events) && _.isNumber(inputCell.exposure)) {
          newData.alpha = inputCell.events + 0.001;
          newData.beta = inputCell.exposure + 0.001;
        }
        newData.type = 'dsurv';
      }
      return newData;
    }

    function buildScale(criterion) {
      switch (criterion.dataType) {
        case 'dichotomous':
          return [0, 1];
        default:
          return [-Infinity, Infinity];
      }
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
            var distributionData = createDistribution(inputDataCell, criterion);
            inputDataCell.isInvalid = checkInputValues(distributionData);
            inputDataCell.label = inputToString(distributionData);
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
      return isNullOrUndefined(value) || isNaN(value);
    }

    function isNullOrUndefined(value) {
      return value === null || value === undefined;
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
        return cell.firstParameter + '\nDistribution: none';
      } else {
        return 'Missing or invalid input';
      }
    }

    function valueSEToString(cell) {
      if (!checkInputValues(cell)) {
        return cell.firstParameter + ' (' + cell.secondParameter + ')' + '\nDistribution: none';
      } else {
        return 'Missing or invalid input';
      }
    }

    function valueCIToString(cell) {
      if (!checkInputValues(cell)) {
        return cell.firstParameter + ' (' + cell.secondParameter + ', ' + cell.thirdParameter + ')' + '\nDistribution: none';
      } else {
        return 'Missing or invalid input';
      }
    }

    function valueCIPercentToString(cell) {
      if (!checkInputValues(cell)) {
        return cell.firstParameter + '% (' + cell.secondParameter + '%, ' + cell.thirdParameter + '%)' + '\nDistribution: none';
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
      createDistribution: createDistribution,
      prepareInputData: prepareInputData,
      createInputFromOldWorkspace: createInputFromOldWorkspace,
      copyWorkspaceCriteria: copyWorkspaceCriteria
    };
  };

  return dependencies.concat(ManualInputService);
});