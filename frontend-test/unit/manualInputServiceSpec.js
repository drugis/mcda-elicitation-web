'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function () {
  fdescribe('The manualInputService', function () {
    var manualInputService;
    beforeEach(module('elicit.manualInput'));
    beforeEach(inject(function (ManualInputService) {
      manualInputService = ManualInputService;
    }));

    fdescribe('checkInputValues', function () {
      var cell;
      function checkMissingInvalid(cell, error, parameter) {
        delete cell[parameter];
        var missingResult = manualInputService.checkInputValues(cell);
        cell[parameter] = null;
        var nullResult = manualInputService.checkInputValues(cell);
        cell[parameter] = NaN;
        var nanResult = manualInputService.checkInputValues(cell);
        expect(missingResult).toEqual(error);
        expect(nullResult).toEqual(error);
        expect(nanResult).toEqual(error);
      }
      function checkMissingInvalidNegative(cell, error, parameter) {
        checkMissingInvalid(cell, error, parameter);
        cell[parameter] = -1;
        var negativeResult = manualInputService.checkInputValues(cell);
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
        var result = manualInputService.checkInputValues(cell);
        expect(result).toEqual(error);
        error = 'Lower bound too high, or upper bound too low';
        cell.firstParameter = tooHighValue;
        result = manualInputService.checkInputValues(cell);
        expect(result).toEqual(error);
      }

      describe(', for Assisted distributions, ', function () {
        beforeEach(function () {
          cell = {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            firstParameter: 50
          };
        });
        describe('for dichotomous distributions', function () {
          beforeEach(function () {
            cell.dataType = 'dichotomous';
            cell.secondParameter = 150;
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.checkInputValues(cell);
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
            var belowOneResult = manualInputService.checkInputValues(cell);
            expect(belowOneResult).toEqual(error);
          });
          it('should return an error for non integer parameters', function () {
            var error = 'Events and sample size must be integer';
            cell.firstParameter = 5.5;
            var decimalEventsResult = manualInputService.checkInputValues(cell);
            cell.firstParameter = 50;
            cell.secondParameter = 100.5;
            var decimalSampleSizeResult = manualInputService.checkInputValues(cell);
            expect(decimalEventsResult).toEqual(error);
            expect(decimalSampleSizeResult).toEqual(error);
          });
          it('should return an error events > sample size ', function () {
            var error = 'Events must be lower or equal to sample size';
            cell.secondParameter = 49;
            var result = manualInputService.checkInputValues(cell);
            expect(result).toEqual(error);
          });
        });
        describe('for continuous distributions', function () {
          beforeEach(function () {
            cell.dataType = 'continuous';
            cell.secondParameter = 1.5;
            cell.thirdParameter = 150;
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.checkInputValues(cell);
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
            var decimalSampleSizeResult = manualInputService.checkInputValues(cell);
            expect(decimalSampleSizeResult).toEqual(error);
          });
        });
        describe('for other distributions', function () {
          beforeEach(function () {
            cell.dataType = 'other';
          });
          it('should return no error for correct other distributions', function () {
            var result = manualInputService.checkInputValues(cell);
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
            cell.inputParameters.label = 'Beta';
            cell.secondParameter = 100;
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if alpha is invalid or <= 0 ', function () {
            var error = 'Invalid alpha';
            checkMissingInvalid(cell, error, 'firstParameter');
            cell.firstParameter = 0;
            var tooLowAlphaResult = manualInputService.checkInputValues(cell);
            expect(tooLowAlphaResult).toEqual(error);
          });
          it('should return an error if beta is invalid or <= 0 ', function () {
            var error = 'Invalid beta';
            checkMissingInvalid(cell, error, 'secondParameter');
            cell.secondParameter = 0;
            var tooLowBetaResult = manualInputService.checkInputValues(cell);
            expect(tooLowBetaResult).toEqual(error);
          });
          it('should return an error if alpha or beta is non integer', function () {
            var error = 'Values should be integer';
            cell.firstParameter = 50.5;
            var alphaNonIntegerResult = manualInputService.checkInputValues(cell);
            expect(alphaNonIntegerResult).toEqual(error);
            cell.firstParameter = 50;
            cell.secondParameter = 100.2;
            var betaNonIntegerResult = manualInputService.checkInputValues(cell);
            expect(betaNonIntegerResult).toEqual(error);
          });
        });
        describe(', Normal distributions', function () {
          beforeEach(function () {
            cell.inputParameters.label = 'Normal';
            cell.secondParameter = 2.5;
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if the mean is missing or invalid', function () {
            var error = 'Invalid mean';
            checkMissingInvalid(cell, error, 'firstParameter');
          });
          it('should return an error if the standard error is missing, invalid, or negative', function () {
            var error = 'Invalid standard error';
            checkMissingInvalidNegative(cell, error, 'secondParameter');
          });
        });
        describe(', Gamma distributions', function () {
          beforeEach(function () {
            cell.inputParameters.label = 'Gamma';
            cell.secondParameter = 10000;
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.checkInputValues(cell);
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
            cell.inputParameters.label = 'Decimal';
            cell.firstParameter = 0.50;
          });
          it('should return no error for correct inputs', function () {
            delete cell.secondParameter;
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should return no error for correct inputs with sample size', function () {
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if the value is missing, invalid or not 0<=value<=1', function () {
            var error = 'Value should be between or equal to 0 and 1';
            checkMissingInvalidNegative(cell, error, 'firstParameter');
            cell.firstParameter = 2;
            var tooLargeResult = manualInputService.checkInputValues(cell);
            expect(tooLargeResult).toEqual(error);
          });
          it('should return an error if the sample size is not integer', function () {
            var error = 'Sample size should be integer';
            cell.secondParameter = 100.5;
            var result = manualInputService.checkInputValues(cell);
            expect(result).toEqual(error);
          });
        });
        describe(', for percentage inputs', function () {
          beforeEach(function () {
            cell.inputParameters.label = 'Percentage';
          });
          it('should return no error for correct inputs', function () {
            delete cell.secondParameter;
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should return no error for correct inputs with sample size', function () {
            cell.secondParameter = 100;
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error if the value is missing, invalid or not 0<=value<=100', function () {
            var error = 'Value should be between or equal to 0 and 100';
            checkMissingInvalidNegative(cell, error, 'firstParameter');
            cell.firstParameter = 102;
            var tooLargeResult = manualInputService.checkInputValues(cell);
            expect(tooLargeResult).toEqual(error);
          });
          it('should return an error if the sample size is not integer', function () {
            var error = 'Sample size should be integer';
            cell.secondParameter = 100.5;
            var result = manualInputService.checkInputValues(cell);
            expect(result).toEqual(error);
          });
        });
        describe(', for fraction inputs', function () {
          beforeEach(function () {
            cell.inputParameters.label = 'Fraction';
          });
          it('should return no error for correct inputs', function () {
            var result = manualInputService.checkInputValues(cell);
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
            var result = manualInputService.checkInputValues(cell);
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
          });
          it('should return an error if the mean is missing or invalid, disregarding  inputParameters.label', function () {
            var error = 'Missing or invalid mean';
            checkMissingInvalid(cell, error, 'firstParameter');
          });
          it('should return no error for correct mean', function () {
            cell.inputParameters.label = 'Mean';
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          describe(', for input with SE', function () {
            beforeEach(function () {
              cell.inputParameters.label = 'Mean, SE';
            });
            it('should return no error for correct mean + SE', function () {
              var result = manualInputService.checkInputValues(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error if the SE is invalid, missing or negative', function () {
              var error = 'Standard error missing, invalid, or negative';
              checkMissingInvalidNegative(cell, error, 'secondParameter');
            });
          });
          describe(', for input with CI', function () {
            beforeEach(function () {
              cell.inputParameters.label = 'Mean, 95% C.I.';
            });
            it('should return no error for correct mean + CI', function () {
              var result = manualInputService.checkInputValues(cell);
              expect(result).toBeFalsy();
            });
            it('should throw an error if the confidence interval is incorrect', function () {
              checkConfidenceInterval(cell, 51, 53);
            });
          });
        });
        describe(', for parameter of interest median', function () {
          beforeEach(function () {
            cell.parameterOfInterest = 'median';
          });
          it('should return no error for correct median', function () {
            cell.inputParameters.label = 'Median';
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          describe(', for input with CI', function () {
            beforeEach(function () {
              cell.inputParameters.label = 'Median, 95% C.I.';
            });
            it('should return no error for correct median + CI', function () {
              var result = manualInputService.checkInputValues(cell);
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
              cell.inputParameters.label = 'Value';
              cell.display = 'decimal';
              cell.firstParameter = 0.5;
              cell.secondParameter = 0.025;
              cell.thirdParameter = 0.525;
            });
            it('should return no error for correct value', function () {
              var result = manualInputService.checkInputValues(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error for missing, invalid and negative values', function () {
              var error = 'Missing, invalid, or negative value';
              checkMissingInvalidNegative(cell, error, 'firstParameter');
            });
            it('should return an error if the value is more than 1', function () {
              var error = 'Value must be 1 or less';
              cell.firstParameter = 2;
              var result = manualInputService.checkInputValues(cell);
              expect(result).toEqual(error);
            });
            describe('with confidence interval', function () {
              beforeEach(function () {
                cell.inputParameters.label = 'Value, 95% C.I.';
              });
              it('should return no error for correct value + CI', function () {
                var result = manualInputService.checkInputValues(cell);
                expect(result).toBeFalsy();
              });
              it('should throw an error if the confidence interval is incorrect', function () {
                checkConfidenceInterval(cell, 0.51, 0.53);
              });
            });
          });
          describe(', with display percentage', function () {
            beforeEach(function () {
              cell.inputParameters.label = 'Value';
              cell.display = 'percentage';
            });
            it('should return no error for correct value', function () {
              var result = manualInputService.checkInputValues(cell);
              expect(result).toBeFalsy();
            });
            it('should return an error if the value is more than 100', function () {
              var error = 'Percentage must be 100 or less';
              cell.firstParameter = 102;
              var result = manualInputService.checkInputValues(cell);
              expect(result).toEqual(error);
            });
            describe('with confidence interval', function () {
              beforeEach(function () {
                cell.inputParameters.label = 'Value, 95% C.I.';
              });
              it('should return no error for correct value + CI', function () {
                var result = manualInputService.checkInputValues(cell);
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
          cell.inputParameters.label = 'Value';
          var result = manualInputService.checkInputValues(cell);
          expect(result).toBeFalsy();
        });
        describe(', for value + SE', function () {
          beforeEach(function () {
            cell.inputParameters.label = 'Value, SE';
          });
          it('should return no error for correct Value SE', function () {
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should return an error for incorrect SE', function(){
            var error = 'Standard error invalid, missing, or negative';
            checkMissingInvalidNegative(cell, error, 'secondParameter');
          });
        });
        describe(', for value + CI', function () {
          beforeEach(function () {
            cell.inputParameters.label = 'Value, 95% C.I.';
          });
          it('should return no error for correct Value', function () {
            var result = manualInputService.checkInputValues(cell);
            expect(result).toBeFalsy();
          });
          it('should throw an error if the confidence interval is incorrect', function () {
            checkConfidenceInterval(cell, 51, 53);
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

  describe('inputToString', function () {
    describe('for exact effects', function () {
      it('should give missing or invalid data for an incomplete effect', function () {
        var exact = {
          type: 'exact',
          exactType: 'exact'
        };
        var exactSE = {
          type: 'exact',
          exactType: 'exactSE',
          value: 5
        };
        var exactConf = {
          type: 'exact',
          exactType: 'exactConf',
          value: 5,
          lowerBound: 3
        };
        var exactConfWrongBounds = {
          type: 'exact',
          exactType: 'exactConf',
          value: 5,
          lowerBound: 3,
          upperBound: 4
        };
        expect(manualInputService.inputToString(exact)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(exactSE)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(exactConf)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(exactConfWrongBounds)).toEqual('Lower bound too high, or upper bound too low');
      });
      it('should render a complete effect', function () {
        var exact = {
          type: 'exact',
          value: 3.14,
          exactType: 'exact'
        };
        expect(manualInputService.inputToString(exact)).toEqual('3.14\nDistribution: none');
      });
      it('should reder an exact input with standard error', function () {
        var exact = {
          type: 'exact',
          value: 3.14,
          stdErr: 4.13,
          exactType: 'exactSE'
        };
        expect(manualInputService.inputToString(exact)).toEqual('3.14 (4.13)\nDistribution: none');
      });
      it('should reder an exact input with a confidence interval', function () {
        var exact = {
          type: 'exact',
          value: 3.14,
          lowerBound: 2.13,
          upperBound: 5,
          exactType: 'exactConf'
        };
        expect(manualInputService.inputToString(exact)).toEqual('3.14 (2.13,5)\nDistribution: none');
      });
    });
    describe('for beta effects', function () {
      it('should give missing or invalid  data for an incomplete effect', function () {
        var missingAlpha = {
          type: 'dbeta',
          beta: 20
        };
        var missingBeta = {
          type: 'dbeta',
          beta: 20
        };
        var missingBoth = {
          type: 'dbeta'
        };
        expect(manualInputService.inputToString(missingAlpha)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingBeta)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingBoth)).toEqual('Missing or invalid input');
      });
      it('should render a complete effect', function () {
        var beta = {
          type: 'dbeta',
          alpha: 10,
          beta: 20
        };
        expect(manualInputService.inputToString(beta)).toEqual('9 / 28\nDistribution: beta');
      });
    });
    describe('for normal effects', function () {
      it('should give missing or invalid  data or invalid for an incomplete effect', function () {
        var missingMu = {
          type: 'dnorm',
          sigma: 4
        };
        var missingSigma = {
          type: 'dnorm',
          mu: 20
        };
        var missingBoth = {
          type: 'dnorm'
        };
        expect(manualInputService.inputToString(missingMu)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingSigma)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingBoth)).toEqual('Missing or invalid input');
      });
      it('should render a complete effect', function () {
        var normal = {
          type: 'dnorm',
          mu: 2,
          sigma: 3
        };
        expect(manualInputService.inputToString(normal)).toEqual('2 (3)\nDistribution: normal');
      });
    });
    describe('for t effects', function () {
      it('should give missing or invalid  data for an incomplete effect', function () {
        var missingMu = {
          type: 'dt',
          stdErr: 4,
          dof: 4
        };
        var missingStdErr = {
          type: 'dt',
          mu: 20,
          dof: 45
        };
        var missingDof = {
          type: 'dt',
          mu: 43,
          stdErr: 53
        };
        var missingAll = {
          type: 'dt'
        };
        expect(manualInputService.inputToString(missingMu)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingStdErr)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingDof)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingAll)).toEqual('Missing or invalid input');
      });
      it('should render a complete effect', function () {
        var t = {
          type: 'dt',
          mu: 3.14,
          stdErr: 1.23,
          dof: 36
        };
        expect(manualInputService.inputToString(t)).toEqual('3.14 (1.23), 37\nDistribution: Student\'s t');
      });
    });
    describe('for surv effects', function () {
      it('should give missing or invalid  data for an incomplete effect', function () {
        var missingAlpha = {
          type: 'dsurv',
          beta: 20
        };
        var missingBeta = {
          type: 'dsurv',
          beta: 20
        };
        var missingBoth = {
          type: 'dsurv'
        };
        expect(manualInputService.inputToString(missingAlpha)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingBeta)).toEqual('Missing or invalid input');
        expect(manualInputService.inputToString(missingBoth)).toEqual('Missing or invalid input');
      });
      it('should render a complete effect', function () {
        var beta = {
          type: 'dsurv',
          alpha: 10.001,
          beta: 20.001
        };
        expect(manualInputService.inputToString(beta)).toEqual('10 / 20\nDistribution: gamma');
      });
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