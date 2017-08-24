'use strict';
define(function(require) {
  var dependencies = [];
  var _ = require('lodash');
  var ManualInputService = function() {
    var distributionKnowledge = {
      exact: {
        toString: function(input) {
          if (distributionKnowledge.exact.isMissingInput(input)) {
            return 'Missing input';
          } else if (distributionKnowledge.exact.isInvalidInput(input)) {
            return 'Invalid input';
          } else {
            return 'exact(' + input.value + ')';
          }
        },
        isMissingInput: function(input) {
          return isNullOrUndefined(input.value);
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.value);
        },
        buildPerformance: function(data) {
          return _.pick(data, ['type', 'value']);
        }
      },
      dnorm: {
        toString: function(input) {
          if (distributionKnowledge.dnorm.isMissingInput(input)) {
            return 'Missing input';
          } else if (distributionKnowledge.dnorm.isInvalidInput(input)) {
            return 'Invalid input';
          } else {
            return 'N(' + input.mu + ', ' + input.sigma + ')';
          }
        },
        isMissingInput: function(input) {
          return isNullOrUndefined(input.mu) || isNullOrUndefined(input.sigma);
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.mu) || isNullNaNOrUndefined(input.sigma);
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
          if (distributionKnowledge.dbeta.isMissingInput(input)) {
            return 'Missing input';
          } else if (distributionKnowledge.dbeta.isInvalidInput(input)) {
            return 'Invalid input';
          } else {
            return 'Beta(' + input.alpha + ', ' + input.beta + ')';
          }
        },
        isMissingInput: function(input) {
          return isNullOrUndefined(input.alpha) || isNullOrUndefined(input.beta);
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.alpha) || isNullNaNOrUndefined(input.beta);
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
          if (distributionKnowledge.dt.isMissingInput(input)) {
            return 'Missing input';
          } else if (distributionKnowledge.dt.isInvalidInput(input)) {
            return 'Invalid input';
          } else {
            return 't(' + input.mu + ', ' + input.stdErr + ', ' + input.dof + ')';
          }
        },
        isMissingInput: function(input) {
          return isNullOrUndefined(input.mu) || isNullOrUndefined(input.stdErr) || isNullOrUndefined(input.dof);
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.mu) || isNullNaNOrUndefined(input.stdErr) || isNullNaNOrUndefined(input.dof);
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
          if (distributionKnowledge.dsurv.isMissingInput(input)) {
            return 'Missing input';
          } else if (distributionKnowledge.dsurv.isInvalidInput(input)) {
            return 'Invalid input';
          } else {
            return 'Gamma(' + input.alpha + ', ' + input.beta + ')';
          }
        },
        isMissingInput: function(input) {
          return isNullOrUndefined(input.alpha) || isNullOrUndefined(input.beta);
        },
        isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.alpha) || isNullNaNOrUndefined(input.beta);
        },
        buildPerformance: function(data, criterion) {
          var parameters = _.pick(data, ['alpha', 'beta', 'summaryMeasure']);
          parameters.summaryMeasure =criterion.summaryMeasure;
          if(criterion.summaryMeasure === 'survivalAtTime') {
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
    function createProblem(criteria, treatments, title, description, performanceTable) {
      var problem = {
        title: title,
        description: description,
        valueTree: {
          title: 'Benefit-risk balance',
          children: [{
            title: 'Favourable effects',
            criteria: _.map(_.filter(criteria, 'isFavorable'), 'name')
          }, {
            title: 'Unfavourable effects',
            criteria: _.map(_.reject(criteria, 'isFavorable'), 'name')
          }]
        },
        criteria: buildCriteria(criteria),
        alternatives: buildAlternatives(treatments),
        performanceTable: buildPerformanceTable(performanceTable, criteria, treatments)
      };
      return problem;
    }

    function prepareInputData(criteria, treatments) {
      var inputData = {};
      _.forEach(criteria, function(criterion) {
        inputData[criterion.hash] = {};
        _.forEach(treatments, function(treatment) {
          inputData[criterion.hash][treatment.hash] = {
            type: criterion.dataType === 'survival' ? 'dsurv' : 'exact',
            value: undefined,
            label: 'No data entered',
            source: 'distribution',
            isInvalid: true
          };
        });
      });
      return inputData;
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

    // Private functions
    function buildCriteria(criteria) {
      var newCriteria = _.map(criteria, function(criterion) {
        return {
          title: criterion.name,
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
        alternatives[treatment.name] = {
          title: treatment.name
        };
      });
      return alternatives;
    }

    function buildPerformanceTable(inputData, criteria, treatments) {
      var newPerformanceTable = [];
      _.forEach(criteria, function(criterion) {
        _.forEach(treatments, function(treatment) {
          var data = inputData[criterion.hash][treatment.hash];
          newPerformanceTable.push({
            alternative: treatment.name,
            criterion: criterion.name,
            performance: distributionKnowledge[data.type].buildPerformance(data, criterion)
          });
        });
      });
      return newPerformanceTable;
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
      prepareInputData: prepareInputData,
      inputToString: inputToString,
      isInvalidCell: isInvalidCell
    };
  };

  return dependencies.concat(ManualInputService);
});
