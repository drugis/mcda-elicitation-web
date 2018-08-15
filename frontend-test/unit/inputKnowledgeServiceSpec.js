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
            var expectedResult = '30 / 40\nDistribution: Beta(31, 11)';
            var result = inputKnowledgeService.inputToString(cell);
            expect(result).toEqual(expectedResult);
          });
          it('should create correct performance', function() {
            inputKnowledgeService.buildPerformance(cell);
            expect(performanceServiceMock.buildBetaPerformance).toHaveBeenCalledWith(31, 11, {
              events: 30,
              sampleSize: 40
            });
          });
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'dbeta',
                input: {
                  events: 10,
                  sampleSize: 20
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(10);
            expect(result.secondParameter).toEqual(20);
          });
          it('should create a finished empty input cell', function() {
            var tableEntry = {
              performance: {
                type: 'empty'
              }
            };
            cell.empty = true;
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.empty).toBeTruthy();
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'dt',
                  input: {
                    mu: 10,
                    sigma: 20,
                    sampleSize: 30
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(10);
              expect(result.secondParameter).toEqual(20);
              expect(result.thirdParameter).toEqual(30);
            });
            it('should create a finished empty input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'empty'
                }
              };
              cell.empty = true;
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.empty).toBeTruthy();
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'dt',
                  input: {
                    mu: 10,
                    sigma: 15,
                    sampleSize: 20
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(10);
              expect(result.secondParameter).toEqual(15);
              expect(result.thirdParameter).toEqual(20);
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
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'dbeta',
                parameters: {
                  alpha: 10,
                  beta: 15
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(10);
            expect(result.secondParameter).toEqual(15);
          });
          it('should create a finished empty input cell', function() {
            var tableEntry = {
              performance: {
                type: 'empty'
              }
            };
            cell.empty = true;
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.empty).toBeTruthy();
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
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'dnorm',
                parameters: {
                  mu: 10,
                  sigma: 15
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(10);
            expect(result.secondParameter).toEqual(15);
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
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'dgamma',
                parameters: {
                  alpha: 10,
                  beta: 15
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(10);
            expect(result.secondParameter).toEqual(15);
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
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'exact',
                value: 10
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(10);
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
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'exact',
                value: 0.5
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(0.5);
          });
          it('should create a finished empty input cell', function() {
            var tableEntry = {
              performance: {
                type: 'empty'
              }
            };
            cell.empty = true;
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.empty).toBeTruthy();
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
              value: 0.5,
              sampleSize: 100
            });
          });
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'exact',
                value: 0.5,
                input: {
                  value: 0.5,
                  sampleSize: 100
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(0.5);
            expect(result.secondParameter).toEqual(100);
            expect(result.isNormal).toBeFalsy();
          });
          it('should create a finished input cell for a normal distribution', function() {
            var tableEntry = {
              performance: {
                type: 'dnorm',
                parameters: {
                  mu: 1,
                  sigma: 2
                },
                input: {
                  value: 0.5,
                  sampleSize: 100
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(0.5);
            expect(result.secondParameter).toEqual(100);
            expect(result.isNormal).toBeTruthy();
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
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'exact',
                value: 25,
                input: {
                  value: 25,
                  scale: 'percentage'
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(25);
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
              value: 50,
              sampleSize: 100,
              scale: 'percentage'
            });
          });
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'exact',
                value: 0.5,
                input: {
                  value: 50,
                  sampleSize: 100,
                  scale: 'percentage'
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(50);
            expect(result.secondParameter).toEqual(100);
            expect(result.isNormal).toBeFalsy();
          });
          it('should create a finished input cell for a normal distribution', function() {
            var tableEntry = {
              performance: {
                type: 'dnorm',
                parameters: {
                  mu: 1,
                  sigma: 2
                },
                input: {
                  value: 50,
                  sampleSize: 100,
                  scale: 'percentage'
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(50);
            expect(result.secondParameter).toEqual(100);
            expect(result.isNormal).toBeTruthy();
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
          it('should create a finished input cell', function() {
            var tableEntry = {
              performance: {
                type: 'exact',
                value: 0.5,
                input: {
                  events: 50,
                  sampleSize: 100
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(50);
            expect(result.secondParameter).toEqual(100);
            expect(result.isNormal).toBeFalsy();
          });
          it('should create a finished input cell for a normal distribution', function() {
            var tableEntry = {
              performance: {
                type: 'dnorm',
                parameters: {
                  mu: 1,
                  sigma: 2
                },
                input: {
                  events: 50,
                  sampleSize: 100
                }
              }
            };
            var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
            expect(result.firstParameter).toEqual(50);
            expect(result.secondParameter).toEqual(100);
            expect(result.isNormal).toBeTruthy();
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
            });
            it('should create a finished empty input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'empty'
                }
              };
              cell.empty = true;
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.empty).toBeTruthy();
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50,
                  input: {
                    value: 50,
                    stdErr: 5
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
              expect(result.secondParameter).toEqual(5);
              expect(result.isNormal).toBeFalsy();
            });
            it('should create a finished input cell for a normal distribution', function() {
              var tableEntry = {
                performance: {
                  type: 'dnorm',
                  input: {
                    value: 50,
                    stdErr: 5
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
              expect(result.secondParameter).toEqual(5);
              expect(result.isNormal).toBeTruthy();
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
            it('should render inputs with NE values', function() {
              var NEcell = angular.copy(cell);
              NEcell.lowerBoundNE = true;
              var expectedResult = '50 (NE; 100)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(NEcell);
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50,
                  input: {
                    value: 50,
                    lowerBound: 10,
                    upperBound: 650
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
              expect(result.secondParameter).toEqual(10);
              expect(result.thirdParameter).toEqual(650);
              expect(result.isNormal).toBeFalsy();
            });
            it('should create a finished input cell for a normal distribution', function() {
              var tableEntry = {
                performance: {
                  type: 'dnorm',
                  input: {
                    value: 50,
                    lowerBound: 10,
                    upperBound: 650
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
              expect(result.secondParameter).toEqual(10);
              expect(result.thirdParameter).toEqual(650);
              expect(result.isNormal).toBeTruthy();
            });
            it('should create a finished input with NE bound cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50,
                  input: {
                    value: 50,
                    lowerBound: 'NE',
                    upperBound: 650
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
              expect(result.lowerBoundNE).toBeTruthy();
              expect(result.thirdParameter).toEqual(650);
              expect(result.isNormal).toBeFalsy();
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50,
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50,
                  input: {
                    value: 50,
                    lowerBound: 5,
                    upperBound: 65
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
              expect(result.secondParameter).toEqual(5);
              expect(result.thirdParameter).toEqual(65);
              expect(result.isNormal).toBeFalsy();
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 0.35,
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(0.35);
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 0.5,
                  input: {
                    value: 0.5,
                    lowerBound: 0.5,
                    upperBound: 0.65
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(0.5);
              expect(result.secondParameter).toEqual(0.5);
              expect(result.thirdParameter).toEqual(0.65);
              expect(result.isNormal).toBeFalsy();
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50,
                  input: {
                    value: 50,
                    scale: 'percentage'
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
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
            it('should create a finished input cell', function() {
              var tableEntry = {
                performance: {
                  type: 'exact',
                  value: 50,
                  input: {
                    value: 50,
                    lowerBound: 5,
                    upperBound: 65,
                    scale: 'percentage'
                  }
                }
              };
              var result = inputKnowledgeService.finishInputCell(cell, tableEntry);
              expect(result.firstParameter).toEqual(50);
              expect(result.secondParameter).toEqual(5);
              expect(result.thirdParameter).toEqual(65);
              expect(result.isNormal).toBeFalsy();
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
