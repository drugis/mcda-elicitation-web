'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular) {
  var toStringService;
  describe('The toStringService', function() {

    beforeEach(angular.mock.module('elicit.manualInput'));

    beforeEach(inject(function(ToStringService) {
      toStringService = ToStringService;
    }));

    describe('gammaToString', function() {
      it('should return the correct label for the cell', function() {
        var cell = {
          firstParameter: 10,
          secondParameter: 250
        };
        var result = toStringService.gammaToString(cell);
        var expectedResult = 'Gamma(10, 250)';
        expect(result).toEqual(expectedResult);
      });
    });

    describe('normalToString', function() {
      it('should return the correct label for the cell', function() {
        var cell = {
          firstParameter: 10,
          secondParameter: 0.25
        };
        var result = toStringService.normalToString(cell);
        var expectedResult = 'Normal(10, 0.25)';
        expect(result).toEqual(expectedResult);
      });
    });

    describe('betaToString', function() {
      it('should return the correct label for the cell', function() {
        var cell = {
          firstParameter: 10,
          secondParameter: 25
        };
        var result = toStringService.betaToString(cell);
        var expectedResult = 'Beta(10, 25)';
        expect(result).toEqual(expectedResult);
      });
    });

    describe('valueToString', function() {
      it('should return the correct label for the cell', function() {
        var cell = {
          firstParameter: 10,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          }
        };
        var result = toStringService.valueToString(cell);
        var expectedResult = '10';
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct label for the percentage cell', function() {
        var cell = {
          firstParameter: 10,
          constraint: 'percentage'
        };
        var result = toStringService.valueToString(cell);
        var expectedResult = '10%';
        expect(result).toEqual(expectedResult);
      });
    });

    describe('valueCIToString', function() {
      it('should return the correct label for the cell', function() {
        var cell = {
          firstParameter: 10,
          secondParameter: 0.5,
          thirdParameter: 20,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          }
        };
        var result = toStringService.valueCIToString(cell);
        var expectedResult = '10 (0.5; 20)';
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct label for the percentage cell', function() {
        var cell = {
          firstParameter: 10,
          secondParameter: 0.5,
          thirdParameter: 20,
          constraint: 'percentage'
        };
        var result = toStringService.valueCIToString(cell);
        var expectedResult = '10% (0.5%; 20%)';
        expect(result).toEqual(expectedResult);
      });

      it('should return the correct label for the cell with non estimable values', function() {
        var cell = {
          firstParameter: 10,
          lowerBoundNE: true,
          upperBoundNE: true,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          }
        };
        var result = toStringService.valueCIToString(cell);
        var expectedResult = '10 (NE; NE)';
        expect(result).toEqual(expectedResult);
      });
    });

    describe('emptyToString', function() {
      it('should return the correct label for the cell', function() {
        var result = toStringService.emptyToString();
        var expectedResult = 'empty cell';
        expect(result).toEqual(expectedResult);
      });
    });

    describe('textToString', function() {
      it('should return the correct label for the cell', function() {
        var cell = {
          firstParameter: 'foo'
        };
        var result = toStringService.textToString(cell);
        var expectedResult = 'foo';
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
