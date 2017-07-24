'use strict';
define(function(require) {
  var dependencies = [];
  var _ = require('lodash');
  var ManualInputService = function() {
    var distributionKnowledge = {
      exact: {
        isValidInput: function(input) {
          return isNullOrUndefined(input.value);
        },
        buildPerformance: function(data) {
          return _.pick(data, ['type', 'value']);
        }
      },
      dnorm: {
        isValidInput: function(input) {
          return isNullOrUndefined(input.mu) || isNullOrUndefined(input.sigma);
        },
        buildPerformance: function(data) {
          return {
            type: data.type,
            parameters: _.pick(data, ['mu', 'sigma'])
          };
        }
      },
      dbeta: {
        isValidInput: function(input) {
          return isNullOrUndefined(input.alpha) || isNullOrUndefined(input.beta);
        },
        buildPerformance: function(data) {
          return {
            type: data.type,
            parameters: _.pick(data, ['alpha', 'beta'])
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
        inputData[criterion.name] = {};
        _.forEach(treatments, function(treatment) {
          inputData[criterion.name][treatment.name] = {
            type: 'exact',
            value: 0
          };
        });
      });
      return inputData;
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
          var data = inputData[criterion.name][treatment.name];
          newPerformanceTable.push({
            alternative: treatment.name,
            criterion: criterion.name,
            performance: distributionKnowledge[data.type].buildPerformance(data)
          });
        });
      });
      return newPerformanceTable;
    }

    function isNullOrUndefined(value) {
      return value === null || value === undefined;
    }

    function isValidInputData(inputData) {
      return !_.find(inputData, function(row) {
        return _.find(row, function(cell) {
          return distributionKnowledge[cell.type].isValidInput(cell);
        });
      });
    }

    return {
      createProblem: createProblem,
      prepareInputData: prepareInputData,
      isValidInputData: isValidInputData
    };
  };

  return dependencies.concat(ManualInputService);
});