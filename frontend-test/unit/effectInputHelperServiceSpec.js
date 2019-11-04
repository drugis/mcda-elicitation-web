'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(_, angular) {
  var effectInputHelperService;
  var constraintServiceMock = jasmine.createSpyObj('ConstraintService', ['percentage', 'decimal', 'belowOrEqualTo', 'positive']);
  var inputKnowledgeServiceMock = jasmine.createSpyObj('InputKnowledgeService', [
    'getOptions'
  ]);
  var percentageConstraint = {
    label: 'Proportion (percentage)'
  };
  var decimalConstraint = {
    label: 'Proportion (decimal)'
  };
  var belowOrEqualToConstraint = {
    label: 'belowOrEqualTo'
  };
  var positiveConstraint = {
    label: 'positive'
  };
  constraintServiceMock.percentage.and.returnValue(percentageConstraint);
  constraintServiceMock.decimal.and.returnValue(decimalConstraint);
  constraintServiceMock.belowOrEqualTo.and.returnValue(belowOrEqualToConstraint);
  constraintServiceMock.positive.and.returnValue(positiveConstraint);

  describe('The effectInputHelperService', function() {
    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('InputKnowledgeService', inputKnowledgeServiceMock);
      $provide.value('ConstraintService', constraintServiceMock);
    }));

    beforeEach(inject(function(EffectInputHelperService) {
      effectInputHelperService = EffectInputHelperService;
    }));

    describe('getInputError', function() {
      it('should run all the constraints of a cell\'s parameters, returning the first error found', function() {
        var cell = {
          firstParameter: 10,
          secondParameter: 20,
          inputParameters: {
            firstParameter: {
              constraints: [{
                validator: function() { }
              }]
            },
            secondParameter: {
              constraints: [{
                validator: function() { }
              }, {
                validator: function() { return 'error message'; }
              }]
            }
          }
        };
        var result = effectInputHelperService.getInputError(cell);
        expect(result).toBe('error message');
      });

      it('should return no error for an empty typed cell', function() {
        var cell = {
          inputParameters: {
            id: 'empty'
          }
        };
        expect(effectInputHelperService.getInputError(cell)).toBeFalsy();
      });

      it('should return no error for an text typed cell', function() {
        var cell = {
          inputParameters: {
            id: 'text'
          }
        };
        expect(effectInputHelperService.getInputError(cell)).toBeFalsy();
      });

      it('should return no error for bounds that are not estimable', function() {
        var cell = {
          lowerBoundNE: true,
          upperBoundNE: true,
          firstParameter: 10,
          secondParameter: 20,
          inputParameters: {
            firstParameter: {
              label: 'Lower bound',
              constraints: [
                function() { }
              ]
            },
            secondParameter: {
              label: 'Upper bound'
            }
          }
        };
        expect(effectInputHelperService.getInputError(cell)).toBeFalsy();
      });
    });

    describe('inputToString', function() {
      it('should call the toString function on the cell', function() {
        var cell = {
          inputParameters: {
            toString: function() {
              return 'great success';
            }
          }
        };
        expect(effectInputHelperService.inputToString(cell)).toEqual('great success');
      });

      it('should return an invalid input message if the input is invalid', function() {
        var invalidInput = {
          firstParameter: 10,
          inputParameters: {
            firstParameter: {
              constraints: [{
                validator: function() {
                  return 'error in input';
                }
              }]
            }
          }
        };
        expect(effectInputHelperService.inputToString(invalidInput)).toEqual('Missing or invalid input');
      });
    });

    describe('getOptions', function() {
      it('should call the inputknowledgeservice', function() {
        inputKnowledgeServiceMock.getOptions.and.returnValue('here are some options');
        expect(effectInputHelperService.getOptions()).toEqual('here are some options');
      });
    });

    describe('updateParameterConstraints', function() {
      it('should add percentage constraints', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: 100
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [percentageConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add decimal constraints', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: 1
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [decimalConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a positive constraint', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: Infinity
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [positiveConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a \'below or equal to\' constraint', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: -Infinity,
          upperBound: 100
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [belowOrEqualToConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });


      it('should not add a \'below or equal to\' constraint if the scale is [null, null]', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: null,
          upperBound: null
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: []
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should remove no longer applicable constraints, leaving intact other constraints', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [
                positiveConstraint,
                belowOrEqualToConstraint,
                decimalConstraint,
                percentageConstraint, {
                  label: 'other constraint'
                }]
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: -Infinity,
          upperBound: Infinity
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [{
                label: 'other constraint'
              }]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a positive constraint to the second parameter', function() {
        var cell = {
          inputParameters: {
            secondParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: Infinity
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            secondParameter: {
              label: 'Value',
              constraints: [positiveConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a positive constraint to the third parameter', function() {
        var cell = {
          inputParameters: {
            thirdParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: Infinity
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            thirdParameter: {
              label: 'Value',
              constraints: [positiveConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should not remove the lower bound constraint of the cell lower bound if there also is a decimal or percentage constraint', function() {
        var cell = {
          inputParameters: {
            secondParameter: {
              label: 'Lower bound',
              constraints: [belowOrEqualToConstraint]
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: 100
        };
        var result = effectInputHelperService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            secondParameter: {
              label: 'Lower bound',
              constraints: [belowOrEqualToConstraint, percentageConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('removeTextValue', function() {
      it('should delete the first parameter if the parameter is text and the chosen option is not', function() {
        const inputCell = {
          firstParameter: 'bla',
          inputParameters: {
            id: 'value'
          }
        };
        const result = effectInputHelperService.removeTextValue(inputCell);
        const expectedResult = {
          inputParameters: {
            id: 'value'
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should keep the firstParameter if the chosen option is text', function() {
        const inputCell = {
          firstParameter: 'bla',
          inputParameters: {
            id: 'text'
          }
        };
        const result = effectInputHelperService.removeTextValue(inputCell);
        expect(result).toEqual(inputCell);
      });

      it('should keep the firstParameter if the value is a number', function() {
        const inputCell = {
          firstParameter: 37,
          inputParameters: {
            id: 'value'
          }
        };
        const result = effectInputHelperService.removeTextValue(inputCell);
        expect(result).toEqual(inputCell);
      });
    });

    describe('getCellConstraint', function() {
      it('should return the unit of measurement type if the type is not custom', function() {
        const type = 'percentage';
        const result = effectInputHelperService.getCellConstraint(type);
        expect(result).toEqual(type);
      });

      it('should return "none" if the type is custom', function() {
        const type = 'custom';
        const result = effectInputHelperService.getCellConstraint(type);
        expect(result).toEqual('None');
      });
    });

    describe('getInputParameters', function() {
      it('should return the first parameter options if there are no parameters yet', function() {
        var parameters;
        const parameterOptions = {
          one: {
            id: 1
          },
          two: {
            id: 2
          }
        };
        const result = effectInputHelperService.getInputParameters(parameters, parameterOptions);
        expect(result).toEqual(parameterOptions.one);
      });

      it('should return the correct options if the parameters are already chosen', function() {
        var parameters = {
          id: 'two'
        };
        const parameterOptions = {
          one: {
            id: 1
          },
          two: {
            id: 2
          }
        };
        const result = effectInputHelperService.getInputParameters(parameters, parameterOptions);
        expect(result).toEqual(parameterOptions.two);
      });
    });

    describe('saveCell', function() {
      it('should return a cell without error message, with formatted numbers, and a label', function() {
        const inputCell = {
          inputParameters: {
            id: 'valueCI',
            toString: function(){
              return 'labelString';
            }
          },
          firstParameter: 37,
          secondParameter: 0.00001,
          thirdParameter: 42.00006
        };
        const result = effectInputHelperService.saveCell(inputCell);
        const expectedResult = {
          inputParameters: {
            id: 'valueCI'
          },
          firstParameter: 37,
          secondParameter: 0.00001,
          thirdParameter: 42,
          label: 'labelString'
        };
        delete result.inputParameters.toString;
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
