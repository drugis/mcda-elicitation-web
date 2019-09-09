'use strict';
define(['angular', 'angular-mocks', 'mcda/util'], function(angular) {
  describe('util', function() {
    beforeEach(angular.mock.module('elicit.util'));

    describe('intervalHull', function() {
      var ih;
      
      beforeEach(inject(function(intervalHull) {
        ih = intervalHull;
      }));

      it('should return min and max of the scale ranges', function() {
        var ranges = {
          1: {
            '2.5%': 1,
            '97.5%': 5
          },
          2: {
            '2.5%': 3,
            '97.5%': 10
          }
        };
        var result = ih(ranges);
        var expectedResult = [1, 10];
        expect(result).toEqual(expectedResult);
      });

      it('should return min and max of the effects', function() {
        var ranges = {};
        var effectValues = [5, 11];
        var result = ih(ranges, effectValues);
        var expectedResult = [5, 11];
        expect(result).toEqual(expectedResult);
      });

      it('should return min and max of the scale ranges and effects', function() {
        var ranges = {
          1: {
            '2.5%': 1,
            '97.5%': 5
          },
          2: {
            '2.5%': 3,
            '97.5%': 10
          }
        };
        var effectValues = [5, 11];
        var result = ih(ranges, effectValues);
        var expectedResult = [1, 11];
        expect(result).toEqual(expectedResult);
      });

      it('should work for ranges with no spread', function() {
        var ranges = {
          1: {
            '2.5%': 1,
            '97.5%': 1
          },
          2: {
            '2.5%': 0,
            '97.5%': 0
          }
        };
        var result = ih(ranges);
        var expectedResult = [0, 1];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('generateUuid', function() {
      var gu;

      beforeEach(inject(function(generateUuid) {
        gu = generateUuid;
      }));

      it('should generate a new uuid', function() {
        var result = gu();
        expect(result).toBeDefined();
      });
    });

    describe('swap', function() {
      var sw;

      beforeEach(inject(function(swap) {
        sw = swap;
      }));

      it('should swap 2 elements in an array', function() {
        var arr = [0, 1, 2];
        sw(arr, 0, 2);
        expect(arr).toEqual([2, 1, 0]);
      });
    });

    describe('significantDigits', function() {
      var sigDit;
      beforeEach(inject(function(significantDigits) {
        sigDit = significantDigits;
      }));

      it('should round the input to have 3 significant digits', function() {
        expect(sigDit(0)).toBe(0);
        expect(sigDit(100)).toBe(100);
        expect(sigDit(0.00001)).toBe(0.00001);
        expect(sigDit(0.100001)).toBe(0.1);
        expect(sigDit(51.870000000000005)).toBe(51.87);
        expect(sigDit(1234.1)).toBe(1234.1);
        expect(sigDit(12345)).toBe(12345);
        expect(sigDit(-12345)).toBe(-12345);
        expect(sigDit(-1.2345)).toBe(-1.234);
      });
      it('should work for other precisions', function() {
        expect(sigDit(10.2345, 1)).toBe(10.2);
        expect(sigDit(10.2345, 5)).toBe(10.2345);
        expect(sigDit(10.2345123, 5)).toBe(10.23451);
        expect(sigDit(10.23000000, 5)).toBe(10.23);
      });
    });

    describe('getDataSourcesById', function() {
      var getSources;

      beforeEach(inject(function(getDataSourcesById) {
        getSources = getDataSourcesById;
      }));

      it('should return all data sources on the criteria, keyed by their id', function() {
        var criteria = {
          c1: {
            dataSources: [{
              id: 'ds1'
            }, {
              id: 'ds2'
            }]
          },
          c2: {
            dataSources: [{
              id: 'ds3'
            }]
          }
        };
        var result = getSources(criteria);
        var expectedResult = {
          ds1: {
            id: 'ds1'
          },
          ds2: {
            id: 'ds2'
          },
          ds3: {
            id: 'ds3'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
