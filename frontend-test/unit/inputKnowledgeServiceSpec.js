'use strict';
define(['angular', 'lodash', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular, _) {
  var inputKnowledgeService;
  var performanceServiceMock = jasmine.createSpyObj('PerformanceService', [
    'buildValuePerformance',
    'buildNormalPerformance',
    'buildBetaPerformance',
    'buildGammaPerformance',
    'buildValueCIPerformance',
    'buildValueSEPerformance',
    'buildEventsSampleSizePerformance',
    'buildValueSampleSizePerformance',
    'buildTextPerformance',
    'buildEmptyPerformance'
  ]);
  var generateDistributionServiceMock = jasmine.createSpyObj('GenerateDistributionService', [
    'generateValueDistribution',
    'generateValueSEDistribution',
    'generateValueCIDistribution',
    'generateValueSampleSizeDistribution',
    'generateEventsSampleSizeDistribution'
  ]);
  var toStringServiceMock = jasmine.createSpyObj('ToStringService', [
    'gammaToString',
    'normalToString',
    'betaToString',
    'valueToString',
    'valueSEToString',
    'valueCIToString',
    'eventsSampleSizeToString',
    'valueSampleSizeToString'
  ]);

  describe('the input knowledge service', function() {
    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('PerformanceService', performanceServiceMock);
      $provide.value('GenerateDistributionService', generateDistributionServiceMock);
      $provide.value('ToStringService', toStringServiceMock);
    }));

    beforeEach(inject(function(InputKnowledgeService) {
      inputKnowledgeService = InputKnowledgeService;
    }));

    describe('getOptions', function() {
      describe('for distributions', function() {
        it('should return the manual distribution options', function() {
          var inputType = 'distribution';
          expect(_.keys(inputKnowledgeService.getOptions(inputType))).toEqual([
            'normal',
            'beta',
            'gamma',
            'value',
            'empty',
            'text'
          ]);
        });
      });

      describe('for effects', function() {
        it('should return the options for the effects', function() {
          var inputType = 'effect';
          expect(_.keys(inputKnowledgeService.getOptions(inputType))).toEqual([
            'value',
            'valueSE',
            'valueCI',
            'valueSampleSize',
            'eventsSampleSize',
            'empty',
            'text'
          ]);
        });
      });
    });
  });
});
