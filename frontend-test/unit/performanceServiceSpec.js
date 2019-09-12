'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular) {
  describe('the performance service', function() {
    var performanceService;

    beforeEach(angular.mock.module('elicit.manualInput'));

    beforeEach(inject(function(PerformanceService) {
      performanceService = PerformanceService;
    }));

    describe('buildTextPerformance', function() {
      it('should build a text performance', function() {
        var cell = {
          firstParameter: 'text'
        };
        expect(performanceService.buildTextPerformance(cell)).toEqual({
          type: 'empty',
          value: 'text'
        });
      });
    });

    describe('buildValuePerformance', function() {
      it('should build a value performance', function() {
        var cell = {
          isInvalid: false,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          },
          firstParameter: 1
        };
        var result = performanceService.buildValuePerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 1,
          input: undefined
        };
        expect(result).toEqual(expectedResult);
      });

      it('should return undefined for an invalid cell', function() {
        var cell = {
          isInvalid: true
        };
        var result = performanceService.buildValuePerformance(cell);
        var expectedResult;
        expect(result).toEqual(expectedResult);
      });

      it('should build a percentage value performance', function() {
        var cell = {
          isInvalid: false,
          constraint:'percentage',
          firstParameter: 1
        };
        var result = performanceService.buildValuePerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 0.01,
          input: {
            value: 1,
            scale: 'percentage'
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a decimal value performance', function() {
        var cell = {
          isInvalid: false,
          constraint:'decimal',
          firstParameter: 0.01
        };
        var result = performanceService.buildValuePerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 0.01,
          input: {
            value: 0.01,
            scale: 'decimal'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildValueCIPerformance', function() {
      it('should build a value confidence interval performance', function() {
        var cell = {
          isInvalid: false,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          },
          firstParameter: 1,
          secondParameter: 0.5,
          thirdParameter: 3
        };
        var result = performanceService.buildValueCIPerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 1,
          input: {
            value: 1,
            lowerBound: 0.5,
            upperBound: 3
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should return undefined for an invalid cell', function() {
        var cell = {
          isInvalid: true
        };
        var result = performanceService.buildValueCIPerformance(cell);
        var expectedResult;
        expect(result).toEqual(expectedResult);
      });

      it('should build a percentage value confidence interval performance', function() {
        var cell = {
          isInvalid: false,
          constraint:'percentage',
          firstParameter: 10,
          secondParameter: 5,
          thirdParameter: 30
        };
        var result = performanceService.buildValueCIPerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 0.1,
          input: {
            value: 10,
            lowerBound: 5,
            upperBound: 30,
            scale: 'percentage'
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a decimal value confidence interval performance', function() {
        var cell = {
          isInvalid: false,
          constraint:'decimal',
          firstParameter: 0.01,
          secondParameter: 0.001,
          thirdParameter: 0.5
        };
        var result = performanceService.buildValueCIPerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 0.01,
          input: {
            value: 0.01,
            lowerBound: 0.001,
            upperBound: 0.5,
            scale: 'decimal'
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a value confidence interval performance with NE values', function() {
        var cell = {
          isInvalid: false,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          },
          firstParameter: 1,
          lowerBoundNE: true,
          upperBoundNE: true
        };
        var result = performanceService.buildValueCIPerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 1,
          input: {
            value: 1,
            lowerBound: 'NE',
            upperBound: 'NE'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildNormalPerformance', function() {
      it('should build a normal performance', function() {
        var cell = {
          isInvalid: false,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          },
          firstParameter: 10,
          secondParameter: 0.5
        };
        var result = performanceService.buildNormalPerformance(cell);
        var expectedResult = {
          type: 'dnorm',
          parameters: {
            mu: 10,
            sigma: 0.5
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should return undefined for an invalid cell', function() {
        var cell = {
          isInvalid: true
        };
        var result = performanceService.buildNormalPerformance(cell);
        var expectedResult;
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildBetaPerformance', function() {
      it('should build a beta performance', function() {
        var cell = {
          isInvalid: false,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          },
          firstParameter: 10,
          secondParameter: 50
        };
        var result = performanceService.buildBetaPerformance(cell);
        var expectedResult = {
          type: 'dbeta',
          parameters: {
            alpha: 10,
            beta: 50
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should return undefined for an invalid cell', function() {
        var cell = {
          isInvalid: true
        };
        var result = performanceService.buildBetaPerformance(cell);
        var expectedResult;
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildGammaPerformance', function() {
      it('should build a gamma performance', function() {
        var cell = {
          isInvalid: false,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          },
          firstParameter: 10,
          secondParameter: 50
        };
        var result = performanceService.buildGammaPerformance(cell);
        var expectedResult = {
          type: 'dgamma',
          parameters: {
            alpha: 10,
            beta: 50
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should return undefined for an invalid cell', function() {
        var cell = {
          isInvalid: true
        };
        var result = performanceService.buildGammaPerformance(cell);
        var expectedResult;
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildRangeEffectPerformance', function() {
      it('should build a decimal range performance for an effect', function() {
        var cell = {
          constraint: 'decimal',
          firstParameter: 0.1,
          secondParameter: 0.2
        };
        var result = performanceService.buildRangeEffectPerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: (0.1+0.2)/2,
          input: {
            lowerBound: 0.1,
            upperBound: 0.2
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a percentage range performance for an effect', function() {
        var cell = {
          constraint: 'percentage',
          firstParameter: 10,
          secondParameter: 20
        };
        var result = performanceService.buildRangeEffectPerformance(cell);
        var expectedResult = {
          type: 'exact',
          value: 0.15,
          input: {
            scale: 'percentage',
            lowerBound: 10,
            upperBound: 20
          }
        };
        expect(result).toEqual(expectedResult);
      });


      it('should return undefined for an invalid cell', function() {
        var cell = {
          isInvalid: true
        };
        var result = performanceService.buildRangeEffectPerformance(cell);
        var expectedResult;
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildRangeEffectPerformance', function() {
      it('should build a decimal range performance for a distribution', function() {
        var cell = {
          constraint: 'decimal',
          firstParameter: 0.1,
          secondParameter: 0.2
        };
        var result = performanceService.buildRangeDistribtutionPerformance(cell);
        var expectedResult = {
          type: 'range',
          parameters: {
            lowerBound: 0.1,
            upperBound: 0.2
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a percentage range performance for a distribution', function() {
        var cell = {
          constraint: 'percentage',
          firstParameter: 10,
          secondParameter: 20
        };
        var result = performanceService.buildRangeDistribtutionPerformance(cell);
        var expectedResult = {
          type: 'range',
          parameters: {
            lowerBound: 0.1,
            upperBound: 0.2
          }
        };
        expect(result).toEqual(expectedResult);
      });


      it('should return undefined for an invalid cell', function() {
        var cell = {
          isInvalid: true
        };
        var result = performanceService.buildRangeDistribtutionPerformance(cell);
        var expectedResult;
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildEmptyPerformance', function() {
      it('should build an empty performance', function() {
        expect(performanceService.buildEmptyPerformance()).toEqual({ type: 'empty' });
      });
    });

  });
});
