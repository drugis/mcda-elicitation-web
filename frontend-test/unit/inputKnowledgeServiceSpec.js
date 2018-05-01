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
  describe('the input knowledge service', function() {
    beforeEach(module('elicit.manualInput'));
    beforeEach(inject(function(InputKnowledgeService) {
      inputKnowledgeService = InputKnowledgeService;
    }));

    describe('inputToString,', function() {
      var cell;
      describe('for distributions,', function() {
        beforeEach(function() {
          cell = {
            inputType: 'distribution'
          };
        });
        describe('for assisted inputs,', function() {
          beforeEach(function() {
            cell.inputMethod = 'assistedDistribution';
            cell.firstParameter = 30;
            cell.secondParameter = 40;
            cell.thirdParameter = 150;
            cell.inputParameters = angular.copy(NULL_PARAMETERS);
          });
          describe('for dichotomous inputs,', function() {
            beforeEach(function() {
              cell.dataType = 'dichotomous';
            });
            it('should render correct inputs', function() {
              var expectedResult = '30 / 40\nDistribution: Beta(31, 12)';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for continuous inputs,', function() {
            beforeEach(function() {
              cell.dataType = 'continuous';
            });
            describe('for inputs with standard error', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'assistedContinuousStdErr';
              });
              it('should render correct inputs', function() {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 40)';
                var result = inputKnowledgeService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('for inputs with standard deviation', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'assistedContinuousStdDev';
              });
              it('should render correct inputs', function() {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 3.266)';
                var result = inputKnowledgeService.inputToString(cell);
                expect(result).toEqual(expectedResult);
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
            });
            it('should render correct inputs', function() {
              var expectedResult = 'Beta(30, 40)';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for normal distributions', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'manualNormal';
            });
            it('should render correct inputs', function() {
              var expectedResult = 'Normal(30, 40)';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for gamma distributions', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'manualGamma';
            });
            it('should render correct inputs', function() {
              var expectedResult = 'Gamma(30, 40)';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for exact inputs,', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'manualExact';
            });
            it('should render correct inputs', function() {
              var expectedResult = 'exact(30)';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
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
            });
            it('should render correct inputs', function() {
              var expectedResult = '0.5\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for decimal inputs with sample size', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousDecimalSampleSize';
              cell.secondParameter = 100;
            });
            it('should render correct inputs with sample size', function() {
              var expectedResult = '0.5 (100)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function() {
              cell.isNormal = true;
              var expectedResult = '0.5 (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for percentage input', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousPercentage';
            });
            it('should render correct inputs', function() {
              delete cell.secondParameter;
              var expectedResult = '0.5%\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for percentage inputs with sample size', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousPercentageSampleSize';
              cell.firstParameter = 50;
              cell.secondParameter = 100;
            }); it('should render correct inputs with sample size', function() {
              var expectedResult = '50% (100)\nDistribution: none';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function() {
              cell.isNormal = true;
              var expectedResult = '50% (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
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
              var expectedResult = '50 / 100\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = inputKnowledgeService.inputToString(cell);
              expect(result).toEqual(expectedResult);
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
                cell.inputParameters.id = 'continuousMeanNoDispersion';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50\nDistribution: none';
                var result = inputKnowledgeService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with standard error', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'continuousMeanStdErr';
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
            });
            describe('with a confidence interval', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'continuousMeanConfidenceInterval';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50 (5; 100)\nDistribution: none';
                var result = inputKnowledgeService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
              it('should render correct inputs with normal distribution', function() {
                var normalCell = angular.copy(cell);
                normalCell.isNormal = true;
                var expectedResult = '50 (5; 100)\nNormal(50, ' + (100 - 5) / (2 * 1.96) + ')';
                var result = inputKnowledgeService.inputToString(normalCell);
                expect(result).toEqual(expectedResult);
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
            });
          });
          describe('for parameter of interest cumulative probability', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'cumulativeProbability';
              cell.scale = 'percentage';
            });
            describe('without dispersion', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'cumulativeProbabilityValue';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50%\nDistribution: none';
                var result = inputKnowledgeService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with a confidence interval', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'cumulativeProbabilityValueCI';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50% (5%; 100%)\nDistribution: none';
                var result = inputKnowledgeService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
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
        describe('for assisted distributions', function() {
          beforeEach(function() {
            cell.inputMethod = 'assistedDistribution';
          });
          describe('for dichotomous distributions', function() {
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
                'continuousMeanNoDispersion',
                'continuousMeanStdErr',
                'continuousMeanConfidenceInterval'
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
                'cumulativeProbabilityValue',
                'cumulativeProbabilityValueCI'
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
