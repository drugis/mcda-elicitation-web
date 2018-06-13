'use strict';
define(['angular', 'angular-mocks', 'mcda/services/util'], function() {
  describe('util', function() {
    beforeEach(module('elicit.util'));
    describe('intervalHull', function() {
      var ih;
      beforeEach(inject(function(intervalHull) {
        ih = intervalHull;
      }));
      it('should return infinities if no scale range is set', function() {
        var result = ih();
        expect(result).toEqual([-Infinity, +Infinity]);
      });
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
        var arr = [0, 1, 2]
        sw(arr, 0, 2);
        expect(arr).toEqual([2, 1, 0]);
      });
    });
  });
});
