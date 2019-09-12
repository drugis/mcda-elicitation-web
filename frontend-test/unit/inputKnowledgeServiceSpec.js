'use strict';
define(['angular', 'lodash', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular, _) {
  var inputKnowledgeService;
  var performanceServiceMock = jasmine.createSpyObj('PerformanceService', [
    'buildValuePerformance',
    'buildNormalPerformance',
    'buildBetaPerformance',
    'buildGammaPerformance',
    'buildValueCIPerformance',
    'buildTextPerformance',
    'buildEmptyPerformance',
    'buildRangeDistribtutionPerformance',
    'buildRangeEffectPerformance'
  ]);
  var generateDistributionServiceMock = jasmine.createSpyObj('GenerateDistributionService', [
    'generateValueDistribution',
    'generateValueCIDistribution',
    'generateEmptyDistribution',
    'generateRangeDistribution'
  ]);
  var toStringServiceMock = jasmine.createSpyObj('ToStringService', [
    'gammaToString',
    'normalToString',
    'betaToString',
    'valueToString',
    'valueCIToString',
    'emptyToString',
    'textToString',
    'rangeToString'
  ]);
  var finishInputCellServiceMock = jasmine.createSpyObj('FinishInputCellService', [
    'finishNormalInputCell',
    'finishBetaCell',
    'finishGammaCell',
    'finishValueCell',
    'finishValueCI',
    'finishEmptyCell',
    'finishTextCell',
    'finishRangeDistributionCell',
    'finishRangeEffectCell'
  ]);

  describe('the input knowledge service', function() {
    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('PerformanceService', performanceServiceMock);
      $provide.value('GenerateDistributionService', generateDistributionServiceMock);
      $provide.value('ToStringService', toStringServiceMock);
      $provide.value('FinishInputCellService', finishInputCellServiceMock);
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
            'range',
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
            'valueCI',
            'range',
            'empty',
            'text'
          ]);
        });
      });
    });
  });
});
