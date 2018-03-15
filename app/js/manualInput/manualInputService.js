'use strict';
define(['lodash', 'angular'], function(_) {
  var dependencies = ['numberFilter'];
  var ManualInputService = function(numberFilter) {
    var distributionKnowledge = {
      exact: {
        toString: function(input) {
          switch (input.exactType) {
            case 'exact':
              if (isNullNaNOrUndefined(input.value)) {
                return 'Missing or invalid input';
              } else {
                return 'point estimate(' + input.value + ')';
              }
              break;
            case 'exactSE':
              if (isNullNaNOrUndefined(input.value) || isNullNaNOrUndefinedOrNegative(input.stdErr)) {
                return 'Missing or invalid input';
              } else {
                return 'point estimate(' + input.value + ' ± ' + input.stdErr + ')';
              }
              break;
            case 'exactConv':
              if (isNullNaNOrUndefined(input.value) ||
                isNullNaNOrUndefined(input.lowerbound) ||
                isNullNaNOrUndefined(input.upperbound)) {
                return 'Missing or invalid input';
              } else {
                return 'point estimate(' + input.value + ' (' + input.lowerbound + ',' + input.upperbound + '))';
              }
              break;
          }
        },
        isInvalidInput: function(input) {
          var invalidStdErrOrBounds = false;
          if(input.stdErr){
            invalidStdErrOrBounds = isNullNaNOrUndefinedOrNegative(input.stdErr);
          } else if(input.lowerbound){
            invalidStdErrOrBounds = isNullNaNOrUndefinedOrNegative(input.lowerbound) || isNullNaNOrUndefinedOrNegative(input.upperbound);
          }
          return isNullNaNOrUndefined(input.value) || invalidStdErrOrBounds;
        },
        buildPerformance: function(data) {
          switch (data.exactType) {
            case 'exact':
              return _.pick(data, ['type', 'value']);
            case 'exactSE':
              return _.pick(data, ['type', 'value', 'stdErr']);
            case 'exactConv':
              return _.pick(data, ['type', 'value', 'lowerbound', 'upperbound']);
          }
        }
      },
      dnorm: {
        toString: function(input) {
          if (distributionKnowledge.dnorm.isInvalidInput(input)) {
            return 'Missing or invalid input';
          } else {
            return 'N(' + numberFilter(input.mu, 3) + ', ' + input.sigma + ')';
          }
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.mu) || isNullNaNOrUndefinedOrNegative(input.sigma);
        },
        buildPerformance: function(data) {
          return {
            type: data.type,
            parameters: _.pick(data, ['mu', 'sigma'])
          };
        }
      },
      dbeta: {
        toString: function(input) {
          if (distributionKnowledge.dbeta.isInvalidInput(input)) {
            return 'Missing or invalid input';
          } else {
            return 'Beta(' + input.alpha + ', ' + input.beta + ')';
          }
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.alpha) || input.alpha <= 0 || isNullNaNOrUndefined(input.beta) || input.beta <= 0;
        },
        buildPerformance: function(data) {
          return {
            type: data.type,
            parameters: _.pick(data, ['alpha', 'beta'])
          };
        }
      },
      dt: {
        toString: function(input) {
          if (distributionKnowledge.dt.isInvalidInput(input)) {
            return 'Missing or invalid input';
          } else {
            return 't(' + input.mu + ', ' + input.stdErr + ', ' + input.dof + ')';
          }
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.mu) || isNullNaNOrUndefinedOrNegative(input.stdErr) || isNullNaNOrUndefined(input.dof);
        },
        buildPerformance: function(data) {
          return {
            type: data.type,
            parameters: _.pick(data, ['mu', 'stdErr', 'dof'])
          };
        }
      },
      dsurv: {
        toString: function(input) {
          if (distributionKnowledge.dsurv.isInvalidInput(input)) {
            return 'Missing or invalid input';
          } else {
            return 'Gamma(' + input.alpha + ', ' + input.beta + ')';
          }
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.alpha) || input.alpha <= 0 || isNullNaNOrUndefined(input.beta) || input.beta <= 0;
        },
        buildPerformance: function(data, criterion) {
          var parameters = _.pick(data, ['alpha', 'beta']);
          parameters.summaryMeasure = criterion.summaryMeasure;
          if (criterion.summaryMeasure === 'survivalAtTime') {
            parameters.time = criterion.timePointOfInterest;
          }
          return {
            type: data.type,
            parameters: parameters
          };
        }
      }
    };

    // Exposed functions
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

    function isOldDataInconsistent(newDataType, oldInput) {
      return newDataType === 'survival' && oldInput.type !== 'dsurv' ||
        oldInput.type === 'dsurv' && newDataType !== 'survival';
    }

    function determineInitialDistributionType(criterion) {
      if (criterion.dataSource === 'study') {
        if (criterion.dataType === 'survival') {
          return 'dsurv';
        } else if (criterion.dataType === 'dichotomous') {
          return 'dbeta';
        } else if (criterion.dataType === 'continuous') {
          return 'dt';
        }
      } else { // direct distribution input
        return criterion.dataType === 'survival' ? 'dsurv' : 'exact';
      }

    }

    function prepareInputData(criteria, treatments, oldInputData) {
      var inputData = {};
      _.forEach(criteria, function(criterion) {
        inputData[criterion.hash] = {};
        var defaultData = {
          type: determineInitialDistributionType(criterion),
          value: undefined,
          source: criterion.dataSource,
          isInvalid: true
        };
        _.forEach(treatments, function(treatment) {
          if (oldInputData && oldInputData[criterion.hash] && oldInputData[criterion.hash][treatment.hash]) {
            var oldInput = oldInputData[criterion.hash][treatment.hash];
            inputData[criterion.hash][treatment.hash] = isOldDataInconsistent(criterion.dataType, oldInput) ?
              defaultData : oldInput;
          } else {
            inputData[criterion.hash][treatment.hash] = defaultData;
          }
        });
      });
      return inputData;
    }

    function createDistribution(inputCell, criterion) {
      var newData = {};
      // Exact input
      if (criterion.dataSource !== 'study') {
        switch (inputCell.exactType) {
          case 'exact':
            return inputCell;
          case 'exactSE':
            return inputCell.normalised ? {
              mu: inputCell.value,
              sigma: inputCell.stdErr,
              type: 'dnorm'
            } : inputCell;
          case 'exactConv':
            return inputCell.normalised ? {
              mu: inputCell.value,
              sigma: inputCell.lowerbound + inputCell.upperbound, //FIXME
              type: 'dnorm'
            } : inputCell;
        }
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
          case 'SDnorm':
            newData.sigma = inputCell.sigma / Math.sqrt(inputCell.sampleSize);
            newData.type = 'dnorm';
            break;
          case 'SEt':
            newData.stdErr = inputCell.stdErr;
            newData.dof = inputCell.sampleSize - 1;
            newData.type = 'dt';
            break;
          case 'SDt':
            newData.stdErr = inputCell.sigma / Math.sqrt(inputCell.sampleSize);
            newData.dof = inputCell.sampleSize - 1;
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

    function isInvalidCell(cell) {
      return distributionKnowledge[cell.type].isInvalidInput(cell);
    }

    function buildScale(criterion) {
      var scale;
      if (criterion.dataType === 'dichotomous') {
        scale = [0, 1];
      } else if (criterion.dataType === 'continuous') {
        scale = [-Infinity, Infinity];
      } else if (criterion.dataType === 'survival') {
        if (criterion.summaryMeasure === 'mean' || criterion.summaryMeasure === 'median') {
          scale = [0, Infinity];
        } else if (criterion.summaryMeasure === 'survivalAtTime') {
          scale = [0, 1];
        }
      } else {
        scale = [-Infinity, Infinity];
      }
      return scale;
    }

    function createInputFromOldWorkspace(criteria, alternatives, oldWorkspace, inputData) {
      var newInputData = _.cloneDeep(inputData);
      _.forEach(criteria, function(criterion) {
        _.forEach(alternatives, function(alternative) {
          var critKey;
          _.forEach(oldWorkspace.problem.criteria, function(problemCrit, key) {
            if (problemCrit.title === criterion.title) {
              critKey = key;
            }
          });
          var altKey;
          _.forEach(oldWorkspace.problem.alternatives, function(problemAlt, key) {
            if (problemAlt.title === alternative.title) {
              altKey = key;
            }
          });
          var tableEntry = _.find(oldWorkspace.problem.performanceTable, function(tableEntry) {
            return tableEntry.criterion === critKey && tableEntry.alternative === altKey;
          });
          if (tableEntry) {
            var inputDataCell = _.cloneDeep(newInputData[criterion.hash][alternative.hash]);
            switch (tableEntry.performance.type) {
              case 'exact':
                inputDataCell.value = tableEntry.performance.value;
                if (tableEntry.performance.stdErr) { inputDataCell.stdErr = tableEntry.performance.stdErr; }
                if (tableEntry.performance.lowerbound) { inputDataCell.lowerbound = tableEntry.performance.lowerbound; }
                if (tableEntry.performance.upperbound) { inputDataCell.upperbound = tableEntry.performance.upperbound; }
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
            inputDataCell.isInvalid = isInvalidCell(distributionData);
            inputDataCell.label = inputToString(distributionData);
            newInputData[criterion.hash][alternative.hash] = inputDataCell;
          }
        });
      });
      return newInputData;
    }

    function copyWorkspaceCriteria(workspace) {
      return _.map(workspace.problem.criteria, function(criterion, key) {
        var newCrit = _.pick(criterion, ['title', 'description', 'source', 'sourceLink', 'unitOfMeasurement']);
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
      var newCriteria = _.map(criteria, function(criterion) {
        return {
          title: criterion.title,
          description: criterion.description,
          unitOfMeasurement: criterion.unitOfMeasurement,
          scale: buildScale(criterion),
          source: criterion.source,
          sourceLink: criterion.sourceLink
        };
      });
      return _.keyBy(newCriteria, 'title');
    }

    function buildAlternatives(treatments) {
      var alternatives = {};
      _.forEach(treatments, function(treatment) {
        alternatives[treatment.title] = {
          title: treatment.title
        };
      });
      return alternatives;
    }

    function buildPerformanceTable(inputData, criteria, treatments) {
      var newPerformanceTable = [];
      _.forEach(criteria, function(criterion) {
        _.forEach(treatments, function(treatment) {
          var data = createDistribution(inputData[criterion.hash][treatment.hash], criterion);
          newPerformanceTable.push({
            alternative: treatment.title,
            criterion: criterion.title,
            performance: distributionKnowledge[data.type].buildPerformance(data, criterion)
          });
        });
      });
      return newPerformanceTable;
    }

    function isNullNaNOrUndefinedOrNegative(value){
      return isNullNaNOrUndefined(value) || value < 0;
    }

    function isNullNaNOrUndefined(value) {
      return isNullOrUndefined(value) || isNaN(value);
    }

    function isNullOrUndefined(value) {
      return value === null || value === undefined;
    }
    
    function inputToString(inputData) {
      return distributionKnowledge[inputData.type].toString(inputData);
    }

    return {
      createProblem: createProblem,
      createDistribution: createDistribution,
      prepareInputData: prepareInputData,
      inputToString: inputToString,
      isInvalidCell: isInvalidCell,
      createInputFromOldWorkspace: createInputFromOldWorkspace,
      copyWorkspaceCriteria: copyWorkspaceCriteria
    };
  };

  return dependencies.concat(ManualInputService);
});