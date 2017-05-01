'use strict';
define(['lodash'], function(_) {
  var dependencies = [];
  var angular = require('angular');
  var ManualInputService = function() {
    // Exposed functions
    function createProblem(criteria, treatments, title, description, performanceTable) {
      var problem = {
        title: title,
        description: description,
        valueTree: {
          title: 'Benefit-risk balance',
          children: [{
            title: 'Favourable effects',
            criteria: _.reduce(criteria, function(accum, criterion) {
              if (criterion.isFavorable) {
                 accum.push(criterion.name);
                 return accum;
              } else{return accum;}
            }, [])
          }, {
            title: 'Unfavourable effects',
            criteria: _.reduce(criteria, function(accum, criterion) {
              if (!criterion.isFavorable) {
                accum.push(criterion.name);
                return accum;
              } else{return accum;}
            }, [])
          }]
        },
        criteria: getCriteriaRight(criteria, getMinMax(performanceTable)),
        alternatives: getAlternativesRight(treatments),
        performanceTable: getPerformanceTableRight(performanceTable, criteria, treatments)
      };

      return problem;
    }

    // Private functions
    function getCriteriaRight(criteria, minMax) {
      var newCriteria = {};
      _.forEach(criteria, function(criterion) {
        var newCriterion = {
          title: criterion.name,
          description: criterion.description,
          unitOfMeasurement: criterion.unitOfMeasurement,
          scale: minMax
        };
        newCriteria[newCriterion.title] = newCriterion;
      });
      return newCriteria;
    }

    function getAlternativesRight(treatments) {
      var alternatives = {};
      _.forEach(treatments, function(treatment) {
        alternatives[treatment.name] = {
          title: treatment.name
        };
      });
      return alternatives;
    }

    function getPerformanceTableRight(performanceTable, criteria, treatments) {
      var newPerformanceTable = [];
      _.forEach(criteria, function(criterion) {
        _.forEach(treatments, function(treatment) {
          newPerformanceTable.push({
            alternative: treatment.name,
            criterion: criterion.name,
            performance: {
              type: 'exact',
              value: performanceTable[criterion.name][treatment.name]
            }
          });
        });
      });
      return newPerformanceTable;
    }

    function getMinMax(performanceTable) {
      var minimum = Infinity;
      var maximum = -Infinity;
      _.forEach(performanceTable, function(row) {
        _.forEach(row, function(cell) {
          if (cell < minimum) {
            minimum = cell;
          }
          if (cell > maximum) {
            maximum = cell;
          }

        });
      });
      return [minimum, maximum];
    }
    return {
      createProblem: createProblem
    };
  };

  return angular.module('manualInput.manualInputService', dependencies).factory('ManualInputService', ManualInputService);
});
