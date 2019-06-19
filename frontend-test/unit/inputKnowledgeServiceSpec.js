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

  describe('the input knowledge service', function() {
    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('PerformanceService', performanceServiceMock);
      $provide.value('GenerateDistributionService', generateDistributionServiceMock);
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

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildBetaPerformance).toHaveBeenCalledWith(cell);
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

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildNormalPerformance).toHaveBeenCalledWith(cell);
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

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildGammaPerformance).toHaveBeenCalledWith(cell);
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
          performanceServiceMock.buildValuePerformance.calls.reset();
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

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildValuePerformance).toHaveBeenCalledWith(cell);
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
          performanceServiceMock.buildValuePerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = 'empty cell';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString();
          expect(result).toEqual(expectedResult);
        });

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance();
          expect(performanceServiceMock.buildEmptyPerformance).toHaveBeenCalled();
        });

        it('should create a finished input cell', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell();
          expect(result.inputParameters.id).toEqual('empty');
          expect(result.inputParameters.label).toEqual('Empty cell');
        });
      });

      describe('for a text cell', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'text';
          cell.firstParameter = 'foo';
          performanceServiceMock.buildTextPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          var expectedResult = 'foo';
          expect(result).toEqual(expectedResult);
        });

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildTextPerformance).toHaveBeenCalledWith(cell.firstParameter);
        });

        it('should create a finished input cell', function() {
          var performance = {
            value: 'foo'
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.value);
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
          performanceServiceMock.buildValuePerformance.calls.reset();
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

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildValuePerformance).toHaveBeenCalledWith(cell);
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
      });

      describe('for a value with standard error', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'valueSE';
          cell.secondParameter = 0.5;
          performanceServiceMock.buildValueSEPerformance.calls.reset();
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
          expect(performanceServiceMock.buildValueSEPerformance).toHaveBeenCalledWith(cell);
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
      });

      describe('for a value with confidence interval', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'valueCI';
          cell.secondParameter = 40;
          cell.thirdParameter = 60;
          performanceServiceMock.buildValuePerformance.calls.reset();
          performanceServiceMock.buildValueCIPerformance.calls.reset();
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

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildValueCIPerformance).toHaveBeenCalledWith(cell);
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
      });

      describe('for a value with sample size', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'valueSampleSize';
          cell.secondParameter = 100;
          performanceServiceMock.buildValueSampleSizePerformance.calls.reset();
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

        it('should call the correct function of the performance service', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildValueSampleSizePerformance).toHaveBeenCalledWith(cell);
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
      });

      describe('for events with sample size', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'eventsSampleSize';
          cell.secondParameter = 100;
          performanceServiceMock.buildEventsSampleSizePerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = '50 / 100';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          expect(result).toEqual(expectedResult);
        });

        it('should call the correct function of the performance service', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildEventsSampleSizePerformance).toHaveBeenCalledWith(cell);
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
      });

      describe('for an empty cell', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'empty';
          performanceServiceMock.buildValuePerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var expectedResult = 'empty cell';
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString();
          expect(result).toEqual(expectedResult);
        });

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance();
          expect(performanceServiceMock.buildEmptyPerformance).toHaveBeenCalled();
        });

        it('should create a finished input cell', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell();
          expect(result.inputParameters.id).toEqual('empty');
        });
      });

      describe('for a text cell', function() {
        beforeEach(function() {
          cell.inputParameters.id = 'text';
          cell.firstParameter = 'foo';
          performanceServiceMock.buildTextPerformance.calls.reset();
        });

        it('should render correct inputs', function() {
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].toString(cell);
          var expectedResult = 'foo';
          expect(result).toEqual(expectedResult);
        });

        it('should call the correct performance service function', function() {
          inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].buildPerformance(cell);
          expect(performanceServiceMock.buildTextPerformance).toHaveBeenCalledWith(cell.firstParameter);
        });

        it('should create a finished input cell', function() {
          var performance = {
            value: 'foo'
          };
          var result = inputKnowledgeService.getOptions(inputType)[cell.inputParameters.id].finishInputCell(performance);
          expect(result.firstParameter).toEqual(performance.value);
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
