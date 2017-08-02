'use strict';
define(function(require) {
  var dependencies = [];
  var _ = require('lodash');
  var ManualInputService = function() {
    var distributionKnowledge = {
      exact: {
        toString: function(input) {
          return input.isInvalid ? 'Invalid input' : 'exact(' + input.value + ')';
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
          return input.isInvalid ? 'Invalid input' : 'N(' + input.mu + ', ' + input.sigma + ')';
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
          return input.isInvalid ? 'Invalid input' : 'Beta(' + input.alpha + ', ' + input.beta + ')';
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
          return input.isInvalid ? 'Invalid input' : 't(' + input.mu + ', ' + input.stdErr + ', ' + input.dof + ')';
        } ,       isInvalidInput: function(input) {
          return isNullNaNOrUndefined(input.mu) || isNullNaNOrUndefined(input.stdErr) || isNullNaNOrUndefined(input.dof);
        }, buildPerformance: function(data) {
          return {
            type: data.type,
            parameters: _.pick(data, ['mu', 'stdErr','dof'])
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
            type: 'exact',
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

    // Private functions
    function buildCriteria(criteria) {
      var newCriteria = _.map(criteria, function(criterion) {
        return {
          title: criterion.name,
          description: criterion.description,
          unitOfMeasurement: criterion.unitOfMeasurement,
          scale: [-Infinity, Infinity]
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
            performance: distributionKnowledge[data.type].buildPerformance(data)
          });
        });
      });
      return newPerformanceTable;
    }

    function isNullNaNOrUndefined(value) {
      return value === null || value === undefined || isNaN(value);
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