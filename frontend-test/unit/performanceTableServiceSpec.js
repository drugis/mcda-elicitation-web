'use strict';
define(['lodash', 'angular'], function (_, angular) {
  describe('The PerformanceTableService, ', function () {
    var performanceTableService;

    beforeEach(angular.mock.module('elicit.workspace'));

    beforeEach(inject(function (PerformanceTableService) {
      performanceTableService = PerformanceTableService;
    }));

    const dataSourceId = 'dataSourceId';
    const customUnitSource = {
      id: dataSourceId,
      unitOfMeasurement: {
        type: 'custom'
      }
    };
    const percentageSource = {
      id: dataSourceId,
      unitOfMeasurement: {
        type: 'percentage'
      }
    };

    describe('getEffectValues', function () {
      it('should return an empty array if there are no effect values', function () {
        var performanceTable = [
          {
            dataSource: dataSourceId,
            performance: {}
          }
        ];
        var dataSource = customUnitSource;

        var result = performanceTableService.getEffectValues(
          performanceTable,
          dataSource
        );

        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all effect values', function () {
        var performanceTable = [
          {
            dataSource: dataSourceId,
            performance: {
              effect: {
                value: 1
              }
            }
          }
        ];
        var dataSource = customUnitSource;

        var result = performanceTableService.getEffectValues(
          performanceTable,
          dataSource
        );

        var expectedResult = [1];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all effect values percentified', function () {
        var performanceTable = [
          {
            dataSource: dataSourceId,
            performance: {
              effect: {
                value: 1
              }
            }
          }
        ];
        var dataSource = percentageSource;

        var result = performanceTableService.getEffectValues(
          performanceTable,
          dataSource
        );

        var expectedResult = [100];
        expect(result).toEqual(expectedResult);
      });

      it('should ignore cell that are empty', function () {
        var performanceTable = [
          {
            dataSource: dataSourceId,
            performance: {
              effect: {
                type: 'empty'
              }
            }
          }
        ];
        var dataSource = customUnitSource;

        var result = performanceTableService.getEffectValues(
          performanceTable,
          dataSource
        );

        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getRangeDistributionValues', function () {
      it('should return an empty array if there are no range distribution values', function () {
        var performanceTable = [
          {
            dataSource: dataSourceId,
            performance: {
              distribution: {
                type: 'not range'
              }
            }
          },
          {
            dataSource: dataSourceId,
            performance: {}
          }
        ];
        var dataSource = customUnitSource;

        var result = performanceTableService.getRangeDistributionValues(
          performanceTable,
          dataSource
        );

        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all range distribution values', function () {
        var performanceTable = [
          {
            dataSource: dataSourceId,
            performance: {
              distribution: {
                type: 'range',
                parameters: {
                  lowerBound: -1,
                  upperBound: 1
                }
              }
            }
          }
        ];
        var dataSource = customUnitSource;

        var result = performanceTableService.getRangeDistributionValues(
          performanceTable,
          dataSource
        );

        var expectedResult = [-1, 1];
        expect(result).toEqual(expectedResult);
      });

      it('should return an array containing all range distribution values percentified', function () {
        var performanceTable = [
          {
            dataSource: dataSourceId,
            performance: {
              distribution: {
                type: 'range',
                parameters: {
                  lowerBound: -1,
                  upperBound: 1
                }
              }
            }
          }
        ];
        var dataSource = percentageSource;

        var result = performanceTableService.getRangeDistributionValues(
          performanceTable,
          dataSource
        );

        var expectedResult = [-100, 100];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
