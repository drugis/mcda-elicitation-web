'use strict';
define(['angular', 'lodash', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular, _) {
  var NULL_PARAMETERS = {
    firstParameter: {
      constraints: []
    },
    secondParameter: {
      constraints: []
    },
    thirdParameter: {
      constraints: []
    }
  };
  var inputKnowledgeService;
  var performanceServiceMock = jasmine.createSpyObj('PerformanceService', [
    'buildStudentTPerformance',
    'buildExactPerformance',
    'buildNormalPerformance',
    'buildBetaPerformance',
    'buildGammaPerformance',
    'buildExactConfidencePerformance']);
  describe('the input knowledge service', function() {
    beforeEach(module('elicit.manualInput', function($provide) {
      $provide.value('PerformanceService', performanceServiceMock);
    }));
    beforeEach(inject(function(InputKnowledgeService) {
      inputKnowledgeService = InputKnowledgeService;
    }));

    var cell;
    describe('for distributions,', function() {
      beforeEach(function() {
        cell = {
          inputType: 'distribution'
        };
      });
      describe('with assisted inputs,', function() {
        beforeEach(function() {
          cell.inputMethod = 'assistedDistribution';
          cell.firstParameter = 30;
          cell.secondParameter = 40;
          cell.thirdParameter = 150;
          cell.inputParameters = angular.copy(NULL_PARAMETERS);
        });
        describe('that are dichotomous,', function() {
          beforeEach(function() {
            cell.dataType = 'dichotomous';
            cell.inputParameters.id = 'assistedDichotomous';
            performanceServiceMock.buildBetaPerformance.calls.reset();
          });
          it('should render correct inputs', function() {
            var expectedResult = '30 / 40\nDistribution: Beta(31, 12)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildBetaPerformance).toHaveBeenCalledWith(31, 12, {
              events: 30,
              sampleSize: 40
            });
          });
        });
        describe('for continuous inputs,', function() {
          beforeEach(function() {
            cell.dataType = 'continuous';
          });
          describe('for inputs with standard error', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'assistedContinuousStdErr';
              performanceServiceMock.buildStudentTPerformance.calls.reset();
            });
            it('should render correct inputs', function() {
              var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 40)';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildStudentTPerformance).toHaveBeenCalledWith(30, 40, 149, {
                mu: 30,
                sigma: 40,
                sampleSize: 150
              });
            });
          });
          describe('for inputs with standard deviation', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'assistedContinuousStdDev';
              performanceServiceMock.buildStudentTPerformance.calls.reset();
            });
            it('should render correct inputs', function() {
              var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 3.266)';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildStudentTPerformance).toHaveBeenCalledWith(30, 3.265986323710904, 149, {
                mu: 30,
                sigma: 40,
                sampleSize: 150
              });
            });
          });
        });
      });
      describe('for manual inputs,', function() {
        beforeEach(function() {
          cell.inputMethod = 'manualDistribution';
          cell.firstParameter = 30;
          cell.secondParameter = 40;
          cell.inputParameters = angular.copy(NULL_PARAMETERS);
        });
        describe('for beta distributions', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'manualBeta';
            performanceServiceMock.buildBetaPerformance.calls.reset();
          });
          it('should render correct inputs', function() {
            var expectedResult = 'Beta(30, 40)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildBetaPerformance).toHaveBeenCalledWith(30, 40);
          });
        });
        describe('for normal distributions', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'manualNormal';
            performanceServiceMock.buildNormalPerformance.calls.reset();
          });
          it('should render correct inputs', function() {
            var expectedResult = 'Normal(30, 40)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(30, 40);
          });
        });
        describe('for gamma distributions', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'manualGamma';
            performanceServiceMock.buildGammaPerformance.calls.reset();
          });
          it('should render correct inputs', function() {
            var expectedResult = 'Gamma(30, 40)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildGammaPerformance).toHaveBeenCalledWith(30, 40);
          });
        });
        describe('for exact inputs,', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'manualExact';
            performanceServiceMock.buildExactPerformance.calls.reset();
          });
          it('should render correct inputs', function() {
            var expectedResult = 'exact(30)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(30);
          });
        });
      });
    });
    describe('for effects,', function() {
      beforeEach(function() {
        cell = {
          inputType: 'effect',
          inputParameters: angular.copy(NULL_PARAMETERS)
        };
      });
      describe('for dichotomous,', function() {
        beforeEach(function() {
          cell.dataType = 'dichotomous';
          cell.firstParameter = 0.5;
        });
        describe('for decimal input', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'dichotomousDecimal';
            performanceServiceMock.buildExactPerformance.calls.reset();
          });
          it('should render correct inputs', function() {
            var expectedResult = '0.5\nDistribution: none';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(0.5);
          });
        });
        describe('for decimal inputs with sample size', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'dichotomousDecimalSampleSize';
            cell.secondParameter = 100;
            performanceServiceMock.buildExactPerformance.calls.reset();
            performanceServiceMock.buildNormalPerformance.calls.reset();
          });
          it('should render correct inputs with sample size', function() {
            var expectedResult = '0.5 (100)\nDistribution: none';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should render correct normalised inputs', function() {
            cell.isNormal = true;
            var expectedResult = '0.5 (100)\nNormal(0.5, 0.05)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(0.5, {
              value: 0.5,
              sampleSize: 100
            });
          });
          it('should create correct normalized performance', function() {
            cell.isNormal = true;
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(0.5, 0.05, {
              mu: 0.5,
              sampleSize: 100
            });
          });
        });
        describe('for percentage input', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'dichotomousPercentage';
            performanceServiceMock.buildExactPerformance.calls.reset();
          });
          it('should render correct inputs', function() {
            delete cell.secondParameter;
            var expectedResult = '0.5%\nDistribution: none';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(0.005, {
              value: 0.5,
              scale: 'percentage'
            });
          });
        });
        describe('for percentage inputs with sample size', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'dichotomousPercentageSampleSize';
            cell.firstParameter = 50;
            cell.secondParameter = 100;
            performanceServiceMock.buildExactPerformance.calls.reset();
            performanceServiceMock.buildNormalPerformance.calls.reset();
          });
          it('should render correct inputs with sample size', function() {
            var expectedResult = '50% (100)\nDistribution: none';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should render correct normalised inputs', function() {
            cell.isNormal = true;
            var expectedResult = '50% (100)\nNormal(0.5, 0.05)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(0.5, {
              value: 50,
              sampleSize: 100,
              scale: 'percentage'
            });
          });
          it('should create correct normalized performance', function() {
            cell.isNormal = true;
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(0.5, 0.05, {
              mu: 50,
              sampleSize: 100,
              scale: 'percentage'
            });
          });
        });
        describe('for fraction input', function() {
          beforeEach(function() {
            cell.inputParameters.id = 'dichotomousFraction';
            cell.firstParameter = 50;
            cell.secondParameter = 100;
          });
          it('should render correct inputs', function() {
            var expectedResult = '50 / 100\nDistribution: none';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should render correct normalised inputs', function() {
            cell.isNormal = true;
            var expectedResult = '50 / 100\nNormal(0.5, 0.05)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(0.5, {
              events: 50,
              sampleSize: 100
            });
          });
          it('should create correct normalized performance', function() {
            cell.isNormal = true;
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(0.5, 0.05, {
              events: 50,
              sampleSize: 100
            });
          });
        });
      });
      describe('for continuous,', function() {
        beforeEach(function() {
          cell.dataType = 'continuous';
          cell.firstParameter = 50;
          cell.secondParameter = 5;
          cell.thirdParameter = 100;
        });
        describe('for parameter of interest mean,', function() {
          beforeEach(function() {
            cell.parameterOfInterest = 'mean';
          });
          describe('without dispersion', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'exactValue';
              performanceServiceMock.buildExactPerformance.calls.reset();
            });
            it('should render correct inputs', function() {
              var expectedResult = '50\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50);
            });
          });
          describe('with standard error', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'exactValueSE';
              performanceServiceMock.buildExactPerformance.calls.reset();
              performanceServiceMock.buildNormalPerformance.calls.reset();
            });
            it('should render correct inputs', function() {
              var expectedResult = '50 (5)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct inputs with normal distribution', function() {
              var normalCell = angular.copy(cell);
              normalCell.isNormal = true;
              var expectedResult = '50 (5)\nNormal(50, 5)';
              var result = inputKnowledgeService.inputToString(normalCell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50, {
                value: 50,
                stdErr: 5
              });
            });
            it('should create correct normalized performance', function() {
              cell.isNormal = true;
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(50, 5, {
                value: 50,
                stdErr: 5
              });
            });
          });
          describe('with a confidence interval', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'exactValueCI';
              performanceServiceMock.buildExactPerformance.calls.reset();
              performanceServiceMock.buildNormalPerformance.calls.reset();
            });
            it('should render correct inputs', function() {
              var expectedResult = '50 (5; 100)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct inputs with normal distribution', function() {
              var normalCell = angular.copy(cell);
              normalCell.isNormal = true;
              var expectedResult = '50 (5; 100)\nNormal(50, 24.235)';
              var result = inputKnowledgeService.inputToString(normalCell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactConfidencePerformance).toHaveBeenCalled();
            });
            it('should create correct normalized performance', function() {
              var normalCell = angular.copy(cell);
              normalCell.isNormal = true;
              inputKnowledgeService.buildPerformance(normalCell);
              expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(50, 24.235, {
                value: 50,
                lowerBound: 5,
                upperBound: 100
              });
            });
          });
        });
        describe('for parameter of interest median', function() {
          beforeEach(function() {
            cell.parameterOfInterest = 'median';
          });
          describe('without dispersion', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'exactValue';
            });
            it('should render correct inputs', function() {
              var expectedResult = '50\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50);
            });
          });
          describe('with a confidence interval', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'exactValueCI';
            });
            it('should render correct inputs', function() {
              var expectedResult = '50 (5; 100)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactConfidencePerformance).toHaveBeenCalled();
            });
          });
        });
        describe('for parameter of interest cumulative probability', function() {
          beforeEach(function() {
            cell.parameterOfInterest = 'cumulativeProbability';
            cell.scale = 'percentage';
          });
          describe('without dispersion', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'decimal';
            });
            it('should render correct inputs', function() {
              var expectedResult = '50\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50);
            });
          });
          describe('with a confidence interval', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'decimalCI';
            });
            it('should render correct inputs', function() {
              var expectedResult = '50 (5; 100)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactConfidencePerformance).toHaveBeenCalled();
            });
          });
          describe('without dispersion, percentage', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'percentage';
            });
            it('should render correct inputs', function() {
              var expectedResult = '50%\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50);
            });
          });
          describe('with a percentage confidence interval', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'percentageCI';
            });
            it('should render correct inputs', function() {
              var expectedResult = '50% (5%; 100%)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should create correct performance', function() {
              inputKnowledgeService.buildPerformance(cell);
              expect(performanceServiceMock.buildExactConfidencePerformance).toHaveBeenCalled();
            });
          });
        });
      });
    });
    describe('getOptions', function() {
      var cell = {};
      describe('for distributions', function() {
        beforeEach(function() {
          cell.inputType = 'distribution';
        });
        describe('that are assisted', function() {
          beforeEach(function() {
            cell.inputMethod = 'assistedDistribution';
          });
          describe('and dichotomous', function() {
            beforeEach(function() {
              cell.dataType = 'dichotomous';
            });
            it('should return the correct options', function() {
              expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual(['assistedDichotomous']);
            });
          });
          describe('for continuous distributions', function() {
            beforeEach(function() {
              cell.dataType = 'continuous';
            });
            it('should return the correct options', function() {
              expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual(['assistedContinuousStdErr', 'assistedContinuousStdDev']);
            });
          });
        });
        describe('for manual distributions', function() {
          beforeEach(function() {
            cell.inputMethod = 'manualDistribution';
          });
          it('should return the manual distribution options', function() {
            expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual([
              'manualBeta',
              'manualNormal',
              'manualGamma',
              'manualExact'
            ]);
          });
        });
      });
      describe('for effects', function() {
        beforeEach(function() {
          cell.inputType = 'effect';
        });
        describe('that are dichotomous', function() {
          beforeEach(function() {
            cell.dataType = 'dichotomous';
          });
          it('should return the correct options', function() {
            expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual([
              'dichotomousDecimal',
              'dichotomousDecimalSampleSize',
              'dichotomousPercentage',
              'dichotomousPercentageSampleSize',
              'dichotomousFraction'
            ]);
          });
        });
        describe('that are continuous', function() {
          beforeEach(function() {
            cell.dataType = 'continuous';
          });
          describe('and have parameter of interest mean', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'mean';
            });
            it('should return the correct options', function() {
              expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual([
                'exactValue',
                'exactValueSE',
                'exactValueCI'
              ]);
            });
          });
          describe('and have parameter of interest median', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'median';
            });
            it('should return the correct options', function() {
              expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual([
                'exactValue',
                'exactValueCI'
              ]);
            });
          });
          describe('and have parameter of interest cumulativeProbability', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'cumulativeProbability';
            });
            it('should return the correct options', function() {
              expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual([
                'decimal',
                'decimalCI',
                'percentage',
                'percentageCI'
              ]);
            });
          });
        });
        describe('in other cases', function() {
          beforeEach(function() {
            cell.dataType = 'other';
          });
          it('should return the correct options', function() {
            expect(_.keys(inputKnowledgeService.getOptions(cell))).toEqual([
              'exactValue',
              'exactValueSE',
              'exactValueCI'
            ]);
          });
        });
      });
    });
  });
});
