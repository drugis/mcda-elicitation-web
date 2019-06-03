'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular) {
  describe('the performance service', function() {
    var performanceService;

    beforeEach(angular.mock.module('elicit.manualInput'));

    beforeEach(inject(function(PerformanceService) {
      performanceService = PerformanceService;
    }));

    describe('buildExactPerformance', function() {
      it('should build an exact performance', function() {
        expect(performanceService.buildExactPerformance(1, { foo: 'bar' })).toEqual({
          type: 'exact',
          value: 1,
          input: {
            foo: 'bar'
          }
        });
      });
    });

    describe('buildExactConfidencePerformance', function() {
      it('should build an exact performance', function() {
        expect(performanceService.buildExactConfidencePerformance({
          firstParameter: 1,
          secondParameter: 2,
          thirdParameter: 3
        })).toEqual({
          type: 'exact',
          value: 1,
          input: {
            value: 1,
            lowerBound: 2,
            upperBound: 3
          }
        });
      });

      it('should build an exact performance with NE value', function() {
        expect(performanceService.buildExactConfidencePerformance({
          firstParameter: 1,
          thirdParameter: 3,
          lowerBoundNE: true
        })).toEqual({
          type: 'exact',
          value: 1,
          input: {
            value: 1,
            lowerBound: 'NE',
            upperBound: 3
          }
        });
      });
    });

    describe('buildNormalPerformance', function() {
      it('should build an exact performance', function() {
        expect(performanceService.buildNormalPerformance(1, 2, { foo: 'bar' })).toEqual({
          type: 'dnorm',
          parameters: {
            mu: 1,
            sigma: 2
          },
          input: {
            foo: 'bar'
          }
        });
      });
    });

    describe('buildBetaPerformance', function() {
      it('should build an exact performance', function() {
        expect(performanceService.buildBetaPerformance(1, 2, { foo: 'bar' })).toEqual({
          type: 'dbeta',
          parameters: {
            alpha: 1,
            beta: 2
          },
          input: {
            foo: 'bar'
          }
        });
      });
    });
    
    describe('buildGammaPerformance', function() {
      it('should build an exact performance', function() {
        expect(performanceService.buildGammaPerformance(1, 2, { foo: 'bar' })).toEqual({
          type: 'dgamma',
          parameters: {
            alpha: 1,
            beta: 2
          },
          input: {
            foo: 'bar'
          }
        });
      });
    });

    describe('buildEmptyPerformance', function() {
      it('should build an empty performance', function() {
        expect(performanceService.buildEmptyPerformance()).toEqual({ type: 'empty' });
      });
    });

    describe('buildExactSEPerformance', function(){
      it('should build an exact performance with standard error', function(){
        var value = 10;
        var standardError = 0.5;
        var result = performanceService.buildExactSEPerformance(value, standardError);
        var expectedResult = {
          type: 'exact',
          value: value,
          input: {
            value: value,
            stdErr: standardError
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildExactPercentSEPerformance', function(){
      it('should build an exact percentage performance with standard error', function(){
        var value = 10;
        var standardError = 0.5;
        var result = performanceService.buildExactPercentSEPerformance(value, standardError);
        var expectedResult = {
          type: 'exact',
          value: value / 100,
          input: {
            value: value,
            stdErr: standardError,
            scale: 'percentage'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
