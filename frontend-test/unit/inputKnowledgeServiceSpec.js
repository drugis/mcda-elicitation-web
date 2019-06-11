'use strict';
define(['angular', 'lodash', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular, _) {
  var label = 'label';
  function toString() {
    return label;
  }
  var NULL_PARAMETERS = {
    firstParameter: {
      constraints: []
    },
    secondParameter: {
      constraints: []
    },
    thirdParameter: {
      constraints: []
    },
    toString: toString
  };
  var inputKnowledgeService;
  var performanceServiceMock = jasmine.createSpyObj(
    'PerformanceService', [
      'buildExactPerformance',
      'buildNormalPerformance',
      'buildBetaPerformance',
      'buildGammaPerformance',
      'buildExactConfidencePerformance',
      'buildExactPercentConfidencePerformance',
      'buildExactDecimalConfidencePerformance',
      'buildExactSEPerformance',
      'buildExactPercentSEPerformance',
      'buildExactDecimalSEPerformance'
    ]);
  describe('the input knowledge service', function() {
    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('PerformanceService', performanceServiceMock);
    }));
    beforeEach(inject(function(InputKnowledgeService) {
      inputKnowledgeService = InputKnowledgeService;
    }));

    var cell;

    describe('for distributions,', function() {
      var inputType = 'distribution';
      beforeEach(function() {
        cell = {
          inputType: 'distribution',
          firstParameter: 30,
          secondParameter: 40,
          inputParameters: angular.copy(NULL_PARAMETERS)
        };
      });

      describe('for beta distributions', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'beta';
          performanceServiceMock.buildBetaPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = 'Beta(30, 40)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct performance', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildBetaPerformance).toHaveBeenCalledWith(30, 40);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildBetaPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
            type: 'dbeta',
            parameters: {
              alpha: 10,
              beta: 15
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(10);
          expect(result.secondParameter).toEqual(15);
        });
      });

      describe('for normal distributions', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'normal';
          performanceServiceMock.buildNormalPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = 'Normal(30, 40)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct performance', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(30, 40);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildNormalPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
            type: 'dnorm',
            parameters: {
              mu: 10,
              sigma: 15
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(10);
          expect(result.secondParameter).toEqual(15);
        });
      });

      describe('for gamma distributions', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'gamma';
          performanceServiceMock.buildGammaPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = 'Gamma(30, 40)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct performance', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildGammaPerformance).toHaveBeenCalledWith(30, 40);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildGammaPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
            type: 'dgamma',
            parameters: {
              alpha: 10,
              beta: 15
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(10);
          expect(result.secondParameter).toEqual(15);
        });
      });

      describe('for an exact value,', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'value';
          performanceServiceMock.buildExactPerformance.calls.reset();
        });

        it('should render correct non-percentage inputs', function() {
          var expectedResult = '30';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should render correct percentage inputs', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          var expectedResult = '30%';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct performance', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(30);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
            type: 'exact',
            value: 10
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(10);
        });
      });

      describe('for an empty cell', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'empty';
          performanceServiceMock.buildExactPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = 'empty cell';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString();
          expect(result).toEqual(expectedResult);
        });

        it('should create correct performance', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance();
          var expectedResult = {
            type: 'empty'
          };
          expect(result).toEqual(expectedResult);
        });

        it('should create a finished input cell', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell();
          expect(result.inputParameters.id).toEqual('empty');
          expect(result.inputParameters.label).toEqual('Empty cell');
        });
      });
    });

    describe('for effects,', function() {
      var inputType = 'effect';
      var label = 'label';
      var validator = function() {
        return;
      };
      var percentageConstraint = {
        label: 'Proportion (percentage)',
        validator: validator
      };

      beforeEach(function() {
        cell = {
          firstParameter: 50,
          inputParameters: angular.copy(NULL_PARAMETERS)
        };
      });

      describe('for a value without dispersion', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'value';
          performanceServiceMock.buildExactPerformance.calls.reset();
        });

        it('should render correct non-percentage inputs', function() {
          var expectedResult = '50';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should render correct percentage inputs', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          var expectedResult = '50%';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct non-percentage performance', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50);
        });

        it('should create correct percentage performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          var input = {
            scale: 'percentage',
            value: 50
          };
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50 / 100, input);
        });


        it('should create correct decimal performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (decimal)' });
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          var input = {
            scale: 'decimal',
            value: 50
          };
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(50, input);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
            type: 'exact',
            value: 50
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(50);
        });

        it('should create a finished input cell for a cell with percentage scale', function() {
          var performance = {
            type: 'exact',
            value: 0.5,
            input: {
              scale: 'percentage'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(50);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (percentage)');
        });

        it('should create a finished input cell for a cell with decimal scale', function() {
          var performance = {
            type: 'exact',
            value: 0.5,
            input: {
              scale: 'decimal'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(0.5);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (decimal)');
        });

        it('should generate an exact distribution', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = _.merge({}, cell, {
            label: label
          });
          expect(result).toEqual(expectedResult);
        });

        it('should generate an exact distribution from a percentage value', function() {
          cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            firstParameter: 0.5,
            label: label,
            inputParameters: {
              id: 'value',
              firstParameter: {
                constraints: []
              },
              secondParameter: {
                constraints: []
              },
              thirdParameter: {
                constraints: []
              },
              toString: toString
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should generate an exact distribution, removing decimal proportion constraints', function() {
          cell.inputParameters.firstParameter.constraints.push({
            label: 'Proportion (decimal)',
            validator: validator
          });
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            firstParameter: 50,
            label: label,
            inputParameters: {
              id: 'value',
              firstParameter: {
                constraints: []
              },
              secondParameter: {
                constraints: []
              },
              thirdParameter: {
                constraints: []
              },
              toString: toString
            }
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('for a value with standard error', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'valueSE';
          cell.secondParameter = 0.5;
          performanceServiceMock.buildExactPerformance.calls.reset();
        });

        it('should render correct non-percentage inputs', function() {
          var expectedResult = '50 (0.5)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should render correct percentage inputs', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          var expectedResult = '50% (0.5%)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct non-percentage performance', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactSEPerformance).toHaveBeenCalledWith(50, 0.5);
        });

        it('should create correct percentage performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPercentSEPerformance).toHaveBeenCalledWith(50, 0.5);
        });

        it('should create correct decimal performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (decimal)' });
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactDecimalSEPerformance).toHaveBeenCalledWith(50, 0.5);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
              input: {
                value: 50,
                stdErr: 0.5
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.stdErr);
        });

        it('should create a finished input cell with scale percentage', function() {
          var performance = {
              input: {
                value: 50,
                stdErr: 0.5,
                scale: 'percentage'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.stdErr);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (percentage)');
        });

        it('should create a finished input cell with scale decimal', function() {
          var performance = {
              input: {
                value: 0.5,
                stdErr: 0.5,
                scale: 'decimal'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.stdErr);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (decimal)');
        });

        it('should generate a normal distribution', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: 'Normal(50, 0.5)',
            firstParameter: 50,
            secondParameter: 0.5,
            inputParameters: inputKnowledgeService.getOptions('distribution').normal
          };
          expect(result).toEqual(expectedResult);
        });

        it('should generate a normal distribution from a percentage', function() {
          cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: 'Normal(0.5, 0.005)',
            firstParameter: 0.5,
            secondParameter: 0.005,
            inputParameters: inputKnowledgeService.getOptions('distribution').normal
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('for a value with confidence interval', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'valueCI';
          cell.secondParameter = 40;
          cell.thirdParameter = 60;
          performanceServiceMock.buildExactPerformance.calls.reset();
          performanceServiceMock.buildExactConfidencePerformance.calls.reset();
        });

        it('should render correct non-percentage inputs', function() {
          var expectedResult = '50 (40; 60)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should render correct percentage inputs', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          var expectedResult = '50% (40%; 60%)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct non-percentage performance', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactConfidencePerformance).toHaveBeenCalledWith(cell);
        });

        it('should create correct percentage performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPercentConfidencePerformance).toHaveBeenCalledWith(cell);
        });

        it('should create correct decimal performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (decimal)' });
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactDecimalConfidencePerformance).toHaveBeenCalledWith(cell);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactConfidencePerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell given estimable bounds', function() {
          var performance = {
            input: {
              value: 50,
              lowerBound: 40,
              upperBound: 60
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.lowerBound);
          expect(result.thirdParameter).toEqual(performance.input.upperBound);
        });   
        
        it('should create a finished input cell given estimable bounds with percentage scale', function() {
          var performance = {
            input: {
              value: 50,
              lowerBound: 40,
              upperBound: 60,
              scale: 'percentage'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.lowerBound);
          expect(result.thirdParameter).toEqual(performance.input.upperBound);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (percentage)');
        });
  
        it('should create a finished input cell given estimable bounds with decimal scale', function() {
          var performance = {
            input: {
              value: 0.5,
              lowerBound: 0.4,
              upperBound: 0.6,
              scale: 'decimal'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.lowerBound);
          expect(result.thirdParameter).toEqual(performance.input.upperBound);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (decimal)');
        });

        it('should create a finished input cell given non-estimable bounds', function() {
          var performance = {
            input: {
              value: 50,
              lowerBound: 'NE',
              upperBound: 'NE'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toBeUndefined();
          expect(result.thirdParameter).toBeUndefined();
          expect(result.lowerBoundNE).toBeTruthy();
          expect(result.upperBoundNE).toBeTruthy();
        });

        it('should generate a normal distribution given a symmetric interval', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: 'Normal(50, 5.102)',
            firstParameter: 50,
            secondParameter: 5.102,
            inputParameters: inputKnowledgeService.getOptions('distribution').normal
          };
          expect(result).toEqual(expectedResult);
        });

        it('should generate an exact distribution given a asymmetric interval', function() {
          cell.secondParameter = 30;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: '50',
            firstParameter: 50,
            inputParameters: inputKnowledgeService.getOptions('distribution').value
          };
          expect(result).toEqual(expectedResult);
        });

        it('should generate a non-percentage normal distribution given a symmetric interval and a percentage constraint', function() {
          cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: 'Normal(0.5, 0.05102)',
            firstParameter: 0.5,
            secondParameter: 0.05102,
            inputParameters: inputKnowledgeService.getOptions('distribution').normal
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('for a value with sample size', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'valueSampleSize';
          cell.secondParameter = 100;
          performanceServiceMock.buildExactPerformance.calls.reset();
        });

        it('should render correct non-percentage inputs', function() {
          var expectedResult = '50 (100)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should render correct percentage inputs', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          var expectedResult = '50% (100)';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create correct non-percentage performance', function() {
          var value = cell.firstParameter;
          var input = {
            value: value,
            sampleSize: cell.secondParameter
          };
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(value, input);
        });

        it('should create correct percentage performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (percentage)' });
          var value = cell.firstParameter;
          var input = {
            value: value,
            sampleSize: cell.secondParameter,
            scale: 'percentage'
          };
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(value / 100, input);
        });

        it('should create correct decimal performance', function() {
          cell.inputParameters.firstParameter.constraints.push({ label: 'Proportion (decimal)' });
          var value = cell.firstParameter;
          var input = {
            value: value,
            sampleSize: cell.secondParameter,
            scale: 'decimal'
          };
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(value, input);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
            input: {
              value: 50,
              sampleSize: 100
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.sampleSize);
        });

        it('should create a finished input percentage cell', function() {
          var performance = {
            input: {
              value: 50,
              sampleSize: 100,
              scale: 'percentage'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.sampleSize);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (percentage)');
        });

        it('should create a finished input decimal cell', function() {
          var performance = {
            input: {
              value: 0.5,
              sampleSize: 100,
              scale: 'decimal'
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.value);
          expect(result.secondParameter).toEqual(performance.input.sampleSize);
          expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (decimal)');
        });

        it('should generate an exact distribution', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: '50',
            firstParameter: 50,
            inputParameters: inputKnowledgeService.getOptions('distribution').value
          };
          expect(result).toEqual(expectedResult);
        });

        it('should generate an exact distribution given a percentage constraint', function() {
          cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: '0.5',
            firstParameter: 0.5,
            inputParameters: inputKnowledgeService.getOptions('distribution').value
          };
          expect(result).toEqual(expectedResult);
        });

      });

      describe('for events with sample size', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'eventsSampleSize';
          cell.secondParameter = 100;
          performanceServiceMock.buildExactPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = '50 / 100';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should create the correct performance', function() {
          var input = {
            events: cell.firstParameter,
            sampleSize: cell.secondParameter
          };
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).toHaveBeenCalledWith(cell.firstParameter / cell.secondParameter, input);
        });

        it('should not create performance for an invalid cell', function() {
          cell.isInvalid = true;
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildExactPerformance).not.toHaveBeenCalled();
          expect(result).toBeUndefined();
        });

        it('should create a finished input cell', function() {
          var performance = {
            input: {
              events: 50,
              sampleSize: 100
            }
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.input.events);
          expect(result.secondParameter).toEqual(performance.input.sampleSize);
        });

        it('should generate a beta distribution', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = {
            label: 'Beta(51, 51)',
            firstParameter: 51,
            secondParameter: 51,
            inputParameters: inputKnowledgeService.getOptions('distribution').beta
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('for an empty cell', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'empty';
          performanceServiceMock.buildExactPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = 'empty cell';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString();
          expect(result).toEqual(expectedResult);
        });

        it('should create correct performance', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance();
          var expectedResult = {
            type: 'empty'
          };
          expect(result).toEqual(expectedResult);
        });

        it('should create a finished input cell', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell();
          expect(result.inputParameters.id).toEqual('empty');
        });

        it('should create an empty distribution', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].generateDistribution(cell);
          var expectedResult = cell;
          expect(result).toEqual(expectedResult);
        });
      });
    });

    describe('getOptions', function() {
      describe('for distributions', function() {
        it('should return the manual distribution options', function() {
          var inputType = 'distribution';
          expect(_.keys(inputKnowledgeService.getOptions(inputType))).toEqual([
            'normal',
            'beta',
            'gamma',
            'value',
            'empty'
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
            'empty'
          ]);
        });
      });
    });
  });
});
