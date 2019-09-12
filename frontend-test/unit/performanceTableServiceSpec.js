'use strict';
define([
  'lodash',
  'angular'
], function(_, angular) {
  describe('The PerformanceTableService, ', function() {
    var performanceTableService;

    beforeEach(angular.mock.module('elicit.workspace'));

    beforeEach(inject(function(PerformanceTableService) {
      performanceTableService = PerformanceTableService;
    }));

    describe('getEffectValues', function() {
      it('should return an empty array if there are no effect values', function() {
        var dataSourceId = 'dataSourceId';
        var performanceTable = [{
          dataSource: dataSourceId,
          performance: {}
        }];
        var dataSource = {
          id: dataSourceId,
          unitOfMeasurement: {
            type: 'custom'
          }
        };

        var result = performanceTableService.getEffectValues(performanceTable, dataSource);

        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all effect values', function() {
        var dataSourceId = 'dataSourceId';
        var performanceTable = [{
          dataSource: dataSourceId,
          performance: {
            effect: {
              value: 1
            }
          }
        }];
        var dataSource = {
          id: dataSourceId,
          unitOfMeasurement: {
            type: 'custom'
          }
        };

        var result = performanceTableService.getEffectValues(performanceTable, dataSource);

        var expectedResult = [1];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all effect values percentified', function() {
        var dataSourceId = 'dataSourceId';
        var performanceTable = [{
          dataSource: dataSourceId,
          performance: {
            effect: {
              value: 1
            }
          }
        }];
        var dataSource = {
          id: dataSourceId,
          unitOfMeasurement: {
            type: 'percentage'
          }
        };

        var result = performanceTableService.getEffectValues(performanceTable, dataSource);

        var expectedResult = [100];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getRangeDistributionValues', function() {
      it('should return an empty array if there are no range distribution values', function() {
        var dataSourceId = 'dataSourceId';
        var performanceTable = [{
          dataSource: dataSourceId,
          performance: {
            distribution: {
              type: 'not range'
            }
          }
        }, {
          dataSource: dataSourceId,
          performance: {}
        }];
        var dataSource = {
          id: dataSourceId,
          unitOfMeasurement: {
            type: 'custom'
          }
        };

        var result = performanceTableService.getRangeDistributionValues(performanceTable, dataSource);

        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all range distribution values', function() {
        var dataSourceId = 'dataSourceId';
        var performanceTable = [{
          dataSource: dataSourceId,
          performance: {
            distribution: {
              type: 'range',
              parameters: {
                lowerBound: -1,
                upperBound: 1,
              }
            }
          }
        }];
        var dataSource = {
          id: dataSourceId,
          unitOfMeasurement: {
            type: 'custom'
          }
        };

        var result = performanceTableService.getRangeDistributionValues(performanceTable, dataSource);

        var expectedResult = [-1, 1];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all range distribution values percentified', function() {
        var dataSourceId = 'dataSourceId';
        var performanceTable = [{
          dataSource: dataSourceId,
          performance: {
            distribution: {
              type: 'range',
              parameters: {
                lowerBound: -1,
                upperBound: 1,
              }
            }
          }
        }];
        var dataSource = {
          id: dataSourceId,
          unitOfMeasurement: {
            type: 'percentage'
          }
        };

        var result = performanceTableService.getRangeDistributionValues(performanceTable, dataSource);

        var expectedResult = [-100, 100];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
