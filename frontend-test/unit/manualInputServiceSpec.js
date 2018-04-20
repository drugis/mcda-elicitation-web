'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function () {
  fdescribe('The manualInputService', function () {
    var manualInputService;
    beforeEach(module('elicit.manualInput'));
    beforeEach(inject(function (ManualInputService) {
      manualInputService = ManualInputService;
    }));

    fdescribe('getInputError', function () {
      var cell;
      function checkMissingInvalid(cell, error, parameter) {
        delete cell[parameter];
        var missingResult = manualInputService.getInputError(cell);
        cell[parameter] = null;
        var nullResult = manualInputService.getInputError(cell);
        cell[parameter] = NaN;
        var nanResult = manualInputService.getInputError(cell);
        expect(missingResult).toEqual(error);
        expect(nullResult).toEqual(error);
        expect(nanResult).toEqual(error);
      }
      function checkMissingInvalidNegative(cell, error, parameter) {
        checkMissingInvalid(cell, error, parameter);
        cell[parameter] = -1;
        var negativeResult = manualInputService.getInputError(cell);
        expect(negativeResult).toEqual(error);
      }
      function checkConfidenceInterval(cell, tooHighLower, tooHighValue) {
        var error = 'Missing or invalid convidence interval';
        var secondParameter = cell.secondParameter;
        var thirdParameter = cell.thirdParameter;
        checkMissingInvalid(cell, error, 'secondParameter');
        cell.secondParameter = secondParameter;
        checkMissingInvalid(cell, error, 'thirdParameter');
        cell.thirdParameter = thirdParameter;
        error = 'Lower bound too high, or upper bound too low';
        cell.secondParameter = tooHighLower;
        var result = manualInputService.getInputError(cell);
        expect(result).toEqual(error);
        error = 'Lower bound too high, or upper bound too low';
        cell.firstParameter = tooHighValue;
        result = manualInputService.getInputError(cell);
        expect(result).toEqual(error);
      }

      describe(', for Assisted distributions, ', function () {
        beforeEach(function () {
          cell = {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            firstParameter: 50,
            inputParameters: {}
          };
        });
        describe('for dichotomous distributions', function () {
          beforeEach(function () {
            cell.dataType = 'dichotomous';
            cell.secondParameter = 150;
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error for missing, invalid, or negative event counts', function () {
            var error = 'Missing, invalid, or negative events';
            checkMissingInvalidNegative(cell, error, 'firstParameter');
          });
          it('should return an error for missing, invalid, or below 1 sample sizes', function () {
            var error = 'Missing, invalid, or lower than 1 sample size';
            checkMissingInvalid(cell, error, 'secondParameter');
            cell.secondParameter = 0;
            var belowOneResult = manualInputService.getInputError(cell);
            expect(belowOneResult).toEqual(error);
          });
          it('should return an error for non integer parameters', function () {
            var error = 'Events and sample size must be integer';
            cell.firstParameter = 5.5;
            var decimalEventsResult = manualInputService.getInputError(cell);
            cell.firstParameter = 50;
            cell.secondParameter = 100.5;
            var decimalSampleSizeResult = manualInputService.getInputError(cell);
            expect(decimalEventsResult).toEqual(error);
            expect(decimalSampleSizeResult).toEqual(error);
          });
          it('should return an error events > sample size ', function () {
            var error = 'Events must be lower or equal to sample size';
            cell.secondParameter = 49;
            var result = manualInputService.getInputError(cell);
            expect(result).toEqual(error);
          });
        });
        describe('for continuous distributions,', function () {
          beforeEach(function () {
            cell.dataType = 'continuous';
            cell.secondParameter = 1.5;
            cell.thirdParameter = 150;
          });
          describe('for standard error inputs', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'assistedContinuousStdErr';
            });
            it('should return no error for correct inputs', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error for an missing or invalid mean', function () {
              var error = 'Missing or invalid mean';
              checkMissingInvalid(cell, error, 'firstParameter');
            });
            it('should return an error for an missing, invalid, or negative standard error', function () {
              var error = 'Missing, invalid, or negative standard error/deviation';
              checkMissingInvalidNegative(cell, error, 'secondParameter');
            });
            it('should return an error for missing, invalid, negative or non integer sample size', function () {
              var error = 'Missing, invalid, negative, or non-integer sample size';
              checkMissingInvalidNegative(cell, error, 'thirdParameter');
              cell.thirdParameter = 150.5;
              var decimalSampleSizeResult = manualInputService.getInputError(cell);
              expect(decimalSampleSizeResult).toEqual(error);
            });
          });
          describe('for standard error inputs', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'assistedContinuousStdErr';
            });
            it('should return no error for correct inputs', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error for an missing or invalid mean', function () {
              var error = 'Missing or invalid mean';
              checkMissingInvalid(cell, error, 'firstParameter');
            });
            it('should return an error for an missing, invalid, or negative standard error', function () {
              var error = 'Missing, invalid, or negative standard error/deviation';
              checkMissingInvalidNegative(cell, error, 'secondParameter');
            });
            it('should return an error for missing, invalid, negative or non integer sample size', function () {
              var error = 'Missing, invalid, negative, or non-integer sample size';
              checkMissingInvalidNegative(cell, error, 'thirdParameter');
              cell.thirdParameter = 150.5;
              var decimalSampleSizeResult = manualInputService.getInputError(cell);
              expect(decimalSampleSizeResult).toEqual(error);
            });
          });
        });
        describe('for other distributions', function () {
          beforeEach(function () {
            cell.dataType = 'other';
          });
          it('should return no error for correct other distributions', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error for missing or invalid values', function () {
            var error = 'Missing or invalid value';
            checkMissingInvalid(cell, error, 'firstParameter');
          });
        });
      });
      describe(', for Manual', function () {
        beforeEach(function () {
          cell = {
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
            firstParameter: 50,
            inputParameters: {}
          };
        });
        describe(', Beta distributions', function () {
          beforeEach(function () {
            cell.inputParameters.id = 'manualBeta';
            cell.secondParameter = 100;
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if alpha is missing, invalid or <= 0', function () {
            var error = 'Invalid alpha';
            checkMissingInvalidNegative(cell, error, 'firstParameter');
          });
          it('should return an error if beta is missing, invalid or <= 0', function () {
            var error = 'Invalid beta';
            checkMissingInvalidNegative(cell, error, 'secondParameter');
          });
        });
      });
      describe(', for Dichotomous effects', function () {
        beforeEach(function () {
          cell = {
            inputType: 'effect',
            dataType: 'dichotomous',
            inputParameters: {},
            firstParameter: 50,
            secondParameter: 100
          };
        });
        describe(', for decimal inputs', function () {
          beforeEach(function () {
            cell.inputParameters.id = 'dichotomousDecimal';
            cell.firstParameter = 0.50;
          });
          it('should return no error for correct inputs', function () {
            delete cell.secondParameter;
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return no error for correct inputs with sample size', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if the value is missing, invalid or not 0<=value<=1', function () {
            var error = 'Value should be between or equal to 0 and 1';
            checkMissingInvalidNegative(cell, error, 'firstParameter');
            cell.firstParameter = 2;
            var tooLargeResult = manualInputService.getInputError(cell);
            expect(tooLargeResult).toEqual(error);
          });
          it('should return an error if the sample size is not integer', function () {
            var error = 'Sample size should be integer';
            cell.secondParameter = 100.5;
            var result = manualInputService.getInputError(cell);
            expect(result).toEqual(error);
          });
        });
        describe(', for percentage inputs', function () {
          beforeEach(function () {
            cell.inputParameters.id = 'dichotomousPercentage';
          });
          it('should return no error for correct inputs', function () {
            delete cell.secondParameter;
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return no error for correct inputs with sample size', function () {
            cell.secondParameter = 100;
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if the value is missing, invalid or not 0<=value<=100', function () {
            var error = 'Value should be between or equal to 0 and 100';
            checkMissingInvalidNegative(cell, error, 'firstParameter');
            cell.firstParameter = 102;
            var tooLargeResult = manualInputService.getInputError(cell);
            expect(tooLargeResult).toEqual(error);
          });
          it('should return an error if the sample size is not integer', function () {
            var error = 'Sample size should be integer';
            cell.secondParameter = 100.5;
            var result = manualInputService.getInputError(cell);
            expect(result).toEqual(error);
          });
        });
        describe(', for fraction inputs', function () {
          beforeEach(function () {
            cell.inputParameters.id = 'dichotomousFraction';
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if a value is missing, invalid or negative', function () {
            var error = 'Both values must be defined and non-negative';
            checkMissingInvalidNegative(cell, error, 'firstParameter');
            checkMissingInvalidNegative(cell, error, 'secondParameter');
          });
          it('should return an error is the number of events is greateer than the sample size', function () {
            var error = 'Number of events may not exceed sample size';
            cell.firstParameter = 101;
            var result = manualInputService.getInputError(cell);
            expect(result).toEqual(error);
          });
        });
      });
      describe(', for Continuous effects', function () {
        beforeEach(function () {
          cell = {
            inputType: 'effect',
            dataType: 'continuous',
            inputParameters: {},
            firstParameter: 50,
            secondParameter: 2.5,
            thirdParameter: 52.5
          };
        });
        describe(', for parameter of interest mean', function () {
          beforeEach(function () {
            cell.parameterOfInterest = 'mean';
            cell.inputParameters.id = 'continuousMeanNoDispersion';
          });
          describe('for input mean', function () {
            it('should return an error for incorrect input', function () {
              var error = 'Missing or invalid mean';
              checkMissingInvalid(cell, error, 'firstParameter');
            });
          });
          it('should return no error for correct mean', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          describe(', for input with SE', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'continuousMeanStdErr';
            });
            it('should return no error for correct mean + SE', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error if the SE is invalid, missing or negative', function () {
              var error = 'Standard error missing, invalid, or negative';
              checkMissingInvalidNegative(cell, error, 'secondParameter');
            });
          });
          describe(', for input with CI', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'continuousMeanConfidenceInterval';
            });
            it('should return no error for correct mean + CI', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should throw an error if the confidence interval is incorrect', function () {
              checkConfidenceInterval(cell, 51, 53);
            });
          });
        });
        describe(', for parameter of interest median,', function () {
          beforeEach(function () {
            cell.parameterOfInterest = 'median';
          });
          describe('for input median', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'continuousMedianNoDispersion';
            });
            it('should return no error for correct input', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error for incorrect input', function () {
              var error = 'Missing or invalid median';
              delete cell.firstParameter;
              var result = manualInputService.getInputError(cell);
              expect(result).toEqual(error);
            });
          });
          describe(', for input with CI', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'continuousMedianConfidenceInterval';
            });
            it('should return no error for correct median + CI', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should throw an error if the confidence interval is incorrect', function () {
              checkConfidenceInterval(cell, 51, 53);
            });
          });
        });
        describe(', for parameter of interest cumulative probability', function () {
          beforeEach(function () {
            cell.parameterOfInterest = 'cumulativeProbability';
          });
          describe(', with display decimal', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'cumulatitiveProbabilityValue';
              cell.scale = 'decimal';
              cell.firstParameter = 0.5;
              cell.secondParameter = 0.025;
              cell.thirdParameter = 0.525;
            });
            it('should return no error for correct value', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error for missing, invalid and negative values', function () {
              var error = 'Missing, invalid, or negative value';
              checkMissingInvalidNegative(cell, error, 'firstParameter');
            });
            it('should return an error if the value is more than 1', function () {
              var error = 'Value must be 1 or less';
              cell.firstParameter = 2;
              var result = manualInputService.getInputError(cell);
              expect(result).toEqual(error);
            });
            describe('with confidence interval', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'cumulatitiveProbabilityValueCI';
              });
              it('should return no error for correct value + CI', function () {
                var result = manualInputService.getInputError(cell);
                expect(result).toBeFalsy();
              });
              it('should throw an error if the confidence interval is incorrect', function () {
                checkConfidenceInterval(cell, 0.51, 0.53);
              });
            });
          });
          describe(', with display percentage', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'cumulatitiveProbabilityValue';
              cell.scale = 'percentage';
            });
            it('should return no error for correct value', function () {
              var result = manualInputService.getInputError(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error if the value is more than 100', function () {
              var error = 'Percentage must be 100 or less';
              cell.firstParameter = 102;
              var result = manualInputService.getInputError(cell);
              expect(result).toEqual(error);
            });
            describe('with confidence interval', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'cumulatitiveProbabilityValueCI';
              });
              it('should return no error for correct value + CI', function () {
                var result = manualInputService.getInputError(cell);
                expect(result).toBeFalsy();
              });
              it('should throw an error if the confidence interval is incorrect', function () {
                checkConfidenceInterval(cell, 51, 53);
              });
            });
          });
        });
      });
      describe(', for Other effects', function () {
        beforeEach(function () {
          cell = {
            inputType: 'effect',
            dataType: 'other',
            inputParameters: {},
            firstParameter: 50,
            secondParameter: 2.5,
            thirdParameter: 52.5
          };
        });
        it('should return no error for correct Value', function () {
          cell.inputParameters.id = 'value';
          var result = manualInputService.getInputError(cell);
          expect(result).toBeFalsy();
        });
        describe(', for value + SE', function () {
          beforeEach(function () {
            cell.inputParameters.id = 'valueSE';
          });
          it('should return no error for correct Value SE', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error for incorrect SE', function () {
            var error = 'Standard error invalid, missing, or negative';
            checkMissingInvalidNegative(cell, error, 'secondParameter');
          });
        });
        describe(', for value + CI', function () {
          beforeEach(function () {
            cell.inputParameters.id = 'valueCI';
          });
          it('should return no error for correct Value', function () {
            var result = manualInputService.getInputError(cell);
            expect(result).toBeFalsy();
          });
          it('should throw an error if the confidence interval is incorrect', function () {
            checkConfidenceInterval(cell, 51, 53);
          });
        });
      });
    });

    fdescribe('inputToString,', function () {
      var cell;
      function checkInvalidInput() {
        var expectedResult = 'Missing or invalid input';
        var result = manualInputService.inputToString(cell);
        expect(result).toEqual(expectedResult);
      }
      describe('for distributions,', function () {
        beforeEach(function () {
          cell = {
            inputType: 'distribution'
          };
        });
        describe('for assisted inputs,', function () {
          beforeEach(function () {
            cell.inputMethod = 'assistedDistribution';
            cell.firstParameter = 30;
            cell.secondParameter = 40;
            cell.thirdParameter = 150;
            cell.inputParameters = {};
          });
          describe('for dichotomous inputs,', function () {
            beforeEach(function () {
              cell.dataType = 'dichotomous';
            });
            it('should render correct inputs', function () {
              var expectedResult = '30 / 40\nDistribution: Beta(31, 12)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              checkInvalidInput();
            });
          });
          describe('for continuous inputs,', function () {
            beforeEach(function () {
              cell.dataType = 'continuous';
            });
            describe('for inputs with standard error', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'assistedContinuousStdErr';
              });
              it('should render correct inputs', function () {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 40)';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
              it('should render incorrect inputs', function () {
                delete cell.thirdParameter;
                checkInvalidInput();
              });
            });
            describe('for inputs with standard deviation', function () {
              beforeEach(function () {
                cell.inputParameters.id = 'assistedContinuousStdDev';
              });
              it('should render correct inputs', function () {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 3.266)';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
              it('should render incorrect inputs', function () {
                delete cell.thirdParameter;
                checkInvalidInput();
              });
            });
          });
          describe('for other inputs,', function () {
            beforeEach(function () {
              cell.dataType = 'other';
              cell.inputParameters.id = 'assistedOther';
            });
            it('should render correct inputs', function () {
              var expectedResult = '30\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              checkInvalidInput();
            });
          });
        });
        describe('for manual inputs,', function () {
          beforeEach(function () {
            cell.inputMethod = 'manualDistribution';
            cell.firstParameter = 30;
            cell.secondParameter = 40;
            cell.inputParameters = {};
          });
          describe('for beta distributions', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'manualBeta';
            });
            it('should render correct inputs', function () {
              var expectedResult = 'Beta(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              checkInvalidInput();
            });
          });
          describe('for normal distributions', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'manualNormal';
            });
            it('should render correct inputs', function () {
              var expectedResult = 'Normal(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              checkInvalidInput();
            });
          });
          describe('for gamma distributions', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'manualGamma';
            });
            it('should render correct inputs', function () {
              var expectedResult = 'Gamma(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              checkInvalidInput();
            });
          });
        });
      });
      describe('for effects,', function () {
        beforeEach(function () {
          cell = {
            inputType: 'effect',
            inputParameters: {}
          };
        });
        describe('for dichotomous', function () {
          beforeEach(function () {
            cell.dataType = 'dichotomous';
            cell.secondParameter = 100;
          });
          describe('for decimal input', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousDecimal';
              cell.firstParameter = 0.5;
            });
            it('should render correct inputs', function () {
              delete cell.secondParameter;
              var expectedResult = '0.5\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct inputs with sample size', function () {
              var expectedResult = '0.5 (100)\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function () {
              cell.isNormal = true;
              var expectedResult = '0.5 (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              var expectedResult = 'Missing or invalid input';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for percentage input', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousPercentage';
              cell.firstParameter = 50;
            });
            it('should render correct inputs', function () {
              delete cell.secondParameter;
              var expectedResult = '50%\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct inputs with sample size', function () {
              var expectedResult = '50% (100)\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function () {
              cell.isNormal = true;
              var expectedResult = '50% (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              var expectedResult = 'Missing or invalid input';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for fraction input', function () {
            beforeEach(function () {
              cell.inputParameters.id = 'dichotomousFraction';
              cell.firstParameter = 50;
              cell.secondParameter = 100;
            });
            it('should render correct inputs', function () {
              var expectedResult = '50 / 100\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function () {
              cell.isNormal = true;
              var expectedResult = '50 / 100\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render incorrect inputs', function () {
              delete cell.firstParameter;
              var expectedResult = 'Missing or invalid input';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
        });
      });
    });

    describe('createProblem', function () {
      var title = 'title';
      var description = 'A random description of a random problem';
      var treatments = {
        treatment1: {
          title: 'treatment1',
          hash: 'treatment1'
        },
        treatment2: {
          title: 'treatment2',
          hash: 'treatment2'
        }
      };
      it('should create a problem, ready to go to the workspace', function () {
        var criteria = [{
          title: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true,
          hash: 'favorable criterion',
          dataSource: 'exact'
        }, {
          title: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          hash: 'unfavorable criterion',
          dataSource: 'exact'
        }];
        var performanceTable = {
          'favorable criterion': {
            treatment1: {
              type: 'exact',
              value: 10,
              hash: 'treatment1',
              source: 'exact',
              exactType: 'exact'
            },
            treatment2: {
              type: 'exact',
              value: 5,
              hash: 'treatment2',
              source: 'exact',
              exactType: 'exact'
            }
          },
          'unfavorable criterion': {
            treatment1: {
              type: 'exact',
              value: 20,
              hash: 'treatment1',
              source: 'exact',
              exactType: 'exact'
            },
            treatment2: {
              type: 'exact',
              value: 30,
              hash: 'treatment2',
              source: 'exact',
              exactType: 'exact'
            }
          }
        };
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable, true);
        var expectedResult = {
          title: title,
          description: description,
          valueTree: {
            title: 'Benefit-risk balance',
            children: [{
              title: 'Favourable effects',
              criteria: ['favorable criterion']
            }, {
              title: 'Unfavourable effects',
              criteria: ['unfavorable criterion']
            }]
          },
          criteria: {
            'favorable criterion': {
              title: 'favorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [-Infinity, Infinity],
              source: undefined,
              sourceLink: undefined,
              strengthOfEvidence: undefined
            },
            'unfavorable criterion': {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [-Infinity, Infinity],
              source: undefined,
              sourceLink: undefined,
              strengthOfEvidence: undefined
            }
          },
          alternatives: {
            treatment1: {
              title: 'treatment1'
            },
            treatment2: {
              title: 'treatment2'
            }
          },
          performanceTable: [{
            alternative: 'treatment1',
            criterion: 'favorable criterion',
            performance: {
              type: 'exact',
              value: 10
            }
          }, {
            alternative: 'treatment2',
            criterion: 'favorable criterion',
            performance: {
              type: 'exact',
              value: 5
            }
          }, {
            alternative: 'treatment1',
            criterion: 'unfavorable criterion',
            performance: {
              type: 'exact',
              value: 20
            }
          }, {
            alternative: 'treatment2',
            criterion: 'unfavorable criterion',
            performance: {
              type: 'exact',
              value: 30
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
      it('should create a problem with survival data', function () {
        var criteria = [{
          title: 'survival mean',
          dataType: 'survival',
          summaryMeasure: 'mean',
          timeScale: 'hour',
          description: 'some crit description',
          unitOfMeasurement: 'hour',
          isFavorable: true,
          hash: 'survival mean',
          dataSource: 'study'
        }, {
          title: 'survival at time',
          dataType: 'survival',
          summaryMeasure: 'survivalAtTime',
          timeScale: 'minute',
          timePointOfInterest: 3,
          description: 'some crit description',
          unitOfMeasurement: 'Proportion',
          isFavorable: false,
          hash: 'survival at time',
          dataSource: 'study'
        }];

        var performanceTable = {
          'survival mean': {
            treatment1: {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment1'
            },
            treatment2: {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment2'
            }
          },
          'survival at time': {
            'treatment1': {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment1'
            },
            treatment2: {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment2'
            }
          }
        };
        //
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable, true);
        //
        var expectedResult = {
          title: title,
          description: description,
          valueTree: {
            title: 'Benefit-risk balance',
            children: [{
              title: 'Favourable effects',
              criteria: ['survival mean']
            }, {
              title: 'Unfavourable effects',
              criteria: ['survival at time']
            }]
          },
          criteria: {
            'survival mean': {
              title: 'survival mean',
              description: 'some crit description',
              unitOfMeasurement: 'hour',
              scale: [0, Infinity],
              source: undefined,
              sourceLink: undefined,
              strengthOfEvidence: undefined
            },
            'survival at time': {
              title: 'survival at time',
              description: 'some crit description',
              unitOfMeasurement: 'Proportion',
              scale: [0, 1],
              source: undefined,
              sourceLink: undefined,
              strengthOfEvidence: undefined
            }
          },
          alternatives: {
            treatment1: {
              title: 'treatment1'
            },
            treatment2: {
              title: 'treatment2'
            }
          },
          performanceTable: [{
            alternative: 'treatment1',
            criterion: 'survival mean',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'mean'
              }
            }
          }, {
            alternative: 'treatment2',
            criterion: 'survival mean',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'mean'
              }
            }
          }, {
            alternative: 'treatment1',
            criterion: 'survival at time',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'survivalAtTime',
                time: 3
              }
            }
          }, {
            alternative: 'treatment2',
            criterion: 'survival at time',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'survivalAtTime',
                time: 3
              }
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('prepareInputData', function () {
      it('should prepare a zero initialized table', function () {
        var treatments = {
          treatment1: {
            title: 'treatment1',
            hash: 'treatment1'
          },
          treatment2: {
            title: 'treatment2',
            hash: 'treatment2'
          }
        };
        var criteria = [{
          title: 'criterion 1 title',
          hash: 'criterion 1 title',
          dataSource: 'exact'
        }, {
          title: 'criterion 2 title',
          hash: 'criterion 2 title',
          dataSource: 'exact'
        }];
        var result = manualInputService.prepareInputData(criteria, treatments);
        var newCell = {
          type: 'exact',
          value: undefined,
          source: 'exact',
          isInvalid: true
        };
        var expectedResult = {
          'criterion 1 title': {
            treatment1: newCell,
            treatment2: newCell
          },
          'criterion 2 title': {
            treatment1: newCell,
            treatment2: newCell
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should preserve data if there is old data supplied and the criterion type has not changed', function () {
        var treatments = {
          treatment1: {
            title: 'treatment1',
            hash: 'treatment1'
          },
          treatment2: {
            title: 'treatment2',
            hash: 'treatment2'
          }
        };
        var criteria = [{
          title: 'survival to exact',
          hash: 'survival to exact',
          dataType: 'exact',
          dataSource: 'exact'
        }, {
          title: 'survival stays the same',
          hash: 'survival stays the same',
          dataType: 'survival',
          dataSource: 'study'
        }, {
          title: 'exact to survival',
          hash: 'exact to survival',
          dataType: 'survival',
          dataSource: 'study'
        }];
        var oldCell = {
          type: 'dsurv',
          value: 5,
          source: 'distribution',
          isInvalid: false
        };
        var oldInputData = {
          'survival to exact': {
            treatment1: {
              type: 'dsurv'
            },
            treatment2: {
              type: 'dsurv'
            }
          },
          'survival stays the same': {
            treatment1: oldCell,
            treatment2: oldCell
          },
          'removed': {
            treatment1: oldCell,
            treatment2: oldCell
          },
          'exact to survival': {
            treatment1: {
              type: 'exact'
            },
            treatment2: {
              type: 'exact'
            }
          }
        };
        var result = manualInputService.prepareInputData(criteria, treatments, oldInputData);
        var newCellExact = {
          type: 'exact',
          value: undefined,
          source: 'exact',
          isInvalid: true
        };
        var newCellSurvival = {
          type: 'dsurv',
          value: undefined,
          source: 'study',
          isInvalid: true
        };
        var expectedResult = {
          'survival to exact': {
            treatment1: newCellExact,
            treatment2: newCellExact
          },
          'survival stays the same': {
            treatment1: oldCell,
            treatment2: oldCell
          },
          'exact to survival': {
            treatment1: newCellSurvival,
            treatment2: newCellSurvival
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createInputFromOldWorkspace', function () {
      it('should calculate the effects table input parameters from the performanceTable of the old workspace', function () {
        var criteria = [{
          title: 'criterion 1',
          hash: 'c1',
          dataSource: 'exact'
        }, {
          title: 'criterion 2',
          hash: 'c2',
          dataSource: 'study',
          dataType: 'dichotomous'
        }, {
          title: 'criterion 3',
          hash: 'c3',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 4',
          hash: 'c4',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 5',
          hash: 'c5',
          dataSource: 'study',
          dataType: 'survival'
        }];
        var alternatives = [{
          title: 'alternative 1',
          hash: 'a1'
        }];
        var oldWorkspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1'
              },
              crit2: {
                title: 'criterion 2'
              },
              crit3: {
                title: 'criterion 3'
              },
              crit4: {
                title: 'criterion 4'
              },
              crit5: {
                title: 'criterion 5'
              }
            },
            alternatives: {
              alt1: {
                title: 'alternative 1'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              performance: {
                type: 'exact',
                value: 1337
              }
            }, {
              criterion: 'crit2',
              alternative: 'alt1',
              performance: {
                type: 'dbeta',
                parameters: {
                  alpha: 12,
                  beta: 23
                }
              }
            }, {
              criterion: 'crit3',
              alternative: 'alt1',
              performance: {
                type: 'dt',
                parameters: {
                  dof: 123,
                  stdErr: 2.3,
                  mu: 30
                }
              }
            }, {
              criterion: 'crit4',
              alternative: 'alt1',
              performance: {
                type: 'dnorm',
                parameters: {
                  sigma: 1.2,
                  mu: 23
                }
              }
            }, {
              criterion: 'crit5',
              alternative: 'alt1',
              performance: {
                type: 'dsurv',
                parameters: {
                  alpha: 12.001,
                  beta: 23.001,
                  summaryMeasure: 'mean'
                }
              }
            },]
          }
        };
        var inputData = {
          c1: {
            a1: {
              type: 'exact',
              value: undefined
            }
          },
          c2: {
            a1: {
              type: 'dbeta',
              count: undefined,
              sampleSize: undefined
            }
          },
          c3: {
            a1: {
              type: 'dt',
              mu: undefined,
              stdErr: undefined,
              sampleSize: undefined
            }
          },
          c4: {
            a1: {
              type: 'dnorm',
              stdErr: undefined,
              mu: undefined
            }
          },
          c5: {
            a1: {
              type: 'dsurv',
              events: undefined,
              exposure: undefined,
              summaryMeasure: undefined
            }
          }
        };
        var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace, inputData);
        var expectedResult = {
          c1: {
            a1: {
              type: 'exact',
              value: 1337,
              isInvalid: false,
              label: '1337\nDistribution: none',
              exactType: 'exact'
            }
          },
          c2: {
            a1: {
              type: 'dbeta',
              count: 11,
              sampleSize: 33,
              isInvalid: false,
              label: '11 / 33\nDistribution: beta'
            }
          },
          c3: {
            a1: {
              type: 'dt',
              mu: 30,
              stdErr: 2.3,
              sampleSize: 124,
              isInvalid: false,
              continuousType: 'SEt',
              label: '30 (2.3), 124\nDistribution: Student\'s t'
            }
          },
          c4: {
            a1: {
              type: 'dnorm',
              mu: 23,
              stdErr: 1.2,
              isInvalid: false,
              continuousType: 'SEnorm',
              label: '23 (1.2)\nDistribution: normal'
            }
          },
          c5: {
            a1: {
              type: 'dsurv',
              events: 12,
              exposure: 23,
              summaryMeasure: 'mean',
              isInvalid: false,
              label: '12 / 23\nDistribution: gamma',
              timeScale: undefined
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('copyWorkspaceCriteria', function () {
      it('should copy the criteria from the oldworkspace to the format used by the rest of the manual input, preserving units and value tree', function () {
        var workspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'bla',
                source: 'single study',
                sourceLink: 'http://www.drugis.org',
                unitOfMeasurement: 'Proportion'
              },
              crit2: {
                title: 'criterion 2',
                source: 'single study',
                sourceLink: 'http://www.drugis.org',
                unitOfMeasurement: 'Response size'
              },
              crit3: {
                title: 'criterion 3',
                source: 'single study',
              },
              crit4: {
                title: 'criterion 4',
                source: 'single study',
              },
              crit5: {
                title: 'criterion 5',
                source: 'single study',
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              performance: {
                type: 'dsurv',
                parameters: {
                  summaryMeasure: 'mean',
                  time: 200,
                }
              }
            }, {
              criterion: 'crit2',
              performance: {
                type: 'dbeta'
              }
            }, {
              criterion: 'crit3',
              performance: {
                type: 'dt'
              }
            }, {
              criterion: 'crit4',
              performance: {
                type: 'dnorm'
              }
            }, {
              criterion: 'crit5',
              performance: {
                type: 'exact'
              }
            }],
            valueTree: {
              title: 'Benefit-risk balance',
              children: [{
                title: 'Favourable effects',
                criteria: ['crit1', 'crit2']
              }, {
                title: 'Unfavourable effects',
                criteria: ['crit3', 'crit4', 'crit5']
              }]
            }
          }
        };
        var result = manualInputService.copyWorkspaceCriteria(workspace);
        var expectedResult = [{
          title: 'criterion 1',
          description: 'bla',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          dataSource: 'study',
          dataType: 'survival',
          isFavorable: true,
          summaryMeasure: 'mean',
          timePointOfInterest: 200,
          timeScale: 'time scale not set',
          unitOfMeasurement: 'Proportion'
        }, {
          title: 'criterion 2',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          isFavorable: true,
          dataSource: 'study',
          dataType: 'dichotomous',
          unitOfMeasurement: 'Response size'
        }, {
          title: 'criterion 3',
          source: 'single study',
          isFavorable: false,
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 4',
          source: 'single study',
          isFavorable: false,
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 5',
          isFavorable: false,
          source: 'single study',
          dataSource: 'exact'
        }];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
