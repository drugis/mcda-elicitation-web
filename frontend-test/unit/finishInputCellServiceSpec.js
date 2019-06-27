'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular) {
  describe('the finish input service', function() {
    var finishInputCellService;
    var options;
    var constraintServiceMock = jasmine.createSpyObj('ConstraintService', [
      'percentage',
      'decimal'
    ]);
    constraintServiceMock.percentage.and.returnValue({
      label: 'Proportion (percentage)'
    });
    constraintServiceMock.decimal.and.returnValue({
      label: 'Proportion (decimal)'
    });

    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('ConstraintService', constraintServiceMock);
    }));

    beforeEach(inject(function(FinishInputCellService) {
      finishInputCellService = FinishInputCellService;
    }));

    beforeEach(function() {
      options = {
        firstParameter: {
          constraints: []
        }
      };
    });

    describe('finishValueCell', function() {
      it('should create a finished input cell', function() {
        var performance = {
          type: 'exact',
          value: 50
        };
        var result = finishInputCellService.finishValueCell(options, performance);
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
        var result = finishInputCellService.finishValueCell(options, performance);
        expect(result.firstParameter).toEqual(50);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (percentage)');
      });

      it('should create a finished input cell for a cell with decimal scale', function() {
        var performance = {
          type: 'exact',
          value: 0.5,
          input: {
            scale: 'decimal'
          }
        };
        var result = finishInputCellService.finishValueCell(options, performance);
        expect(result.firstParameter).toEqual(0.5);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (decimal)');
      });
    });

    describe('finishValueSE', function() {
      it('should create a finished input cell', function() {
        var performance = {
          input: {
            value: 50,
            stdErr: 0.5
          }
        };
        var result = finishInputCellService.finishValueSE(options, performance);
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
        var result = finishInputCellService.finishValueSE(options, performance);
        expect(result.firstParameter).toEqual(performance.input.value);
        expect(result.secondParameter).toEqual(performance.input.stdErr);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (percentage)');
      });

      it('should create a finished input cell with scale decimal', function() {
        var performance = {
          input: {
            value: 0.5,
            stdErr: 0.5,
            scale: 'decimal'
          }
        };
        var result = finishInputCellService.finishValueSE(options, performance);
        expect(result.firstParameter).toEqual(performance.input.value);
        expect(result.secondParameter).toEqual(performance.input.stdErr);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (decimal)');
      });
    });

    describe('finishValueCI', function() {
      it('should create a finished input cell given estimable bounds', function() {
        var performance = {
          input: {
            value: 50,
            lowerBound: 40,
            upperBound: 60
          }
        };
        var result = finishInputCellService.finishValueCI(options, performance);
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
        var result = finishInputCellService.finishValueCI(options, performance);
        expect(result.firstParameter).toEqual(performance.input.value);
        expect(result.secondParameter).toEqual(performance.input.lowerBound);
        expect(result.thirdParameter).toEqual(performance.input.upperBound);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (percentage)');
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
        var result = finishInputCellService.finishValueCI(options, performance);
        expect(result.firstParameter).toEqual(performance.input.value);
        expect(result.secondParameter).toEqual(performance.input.lowerBound);
        expect(result.thirdParameter).toEqual(performance.input.upperBound);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (decimal)');
      });

      it('should create a finished input cell given non-estimable bounds', function() {
        var performance = {
          input: {
            value: 50,
            lowerBound: 'NE',
            upperBound: 'NE'
          }
        };
        var result = finishInputCellService.finishValueCI(options, performance);
        expect(result.firstParameter).toEqual(performance.input.value);
        expect(result.secondParameter).toBeUndefined();
        expect(result.thirdParameter).toBeUndefined();
        expect(result.lowerBoundNE).toBeTruthy();
        expect(result.upperBoundNE).toBeTruthy();
      });
    });

    describe('finishValueSampleSize', function() {
      it('should create a finished input cell', function() {
        var performance = {
          input: {
            value: 50,
            sampleSize: 100
          }
        };
        var result = finishInputCellService.finishValueSampleSizeCell(options, performance);
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
        var result = finishInputCellService.finishValueSampleSizeCell(options, performance);
        expect(result.firstParameter).toEqual(performance.input.value);
        expect(result.secondParameter).toEqual(performance.input.sampleSize);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (percentage)');
      });

      it('should create a finished input decimal cell', function() {
        var performance = {
          input: {
            value: 0.5,
            sampleSize: 100,
            scale: 'decimal'
          }
        };
        var result = finishInputCellService.finishValueSampleSizeCell(options, performance);
        expect(result.firstParameter).toEqual(performance.input.value);
        expect(result.secondParameter).toEqual(performance.input.sampleSize);
        expect(result.inputParameters.firstParameter.constraints[0].label).toEqual('Proportion (decimal)');
      });
    });

    describe('finishEventSampleSizeInputCell', function() {
      it('should create a finished input cell', function() {
        var performance = {
          input: {
            events: 50,
            sampleSize: 100
          }
        };
        var result = finishInputCellService.finishEventSampleSizeInputCell(options, performance);
        expect(result.firstParameter).toEqual(performance.input.events);
        expect(result.secondParameter).toEqual(performance.input.sampleSize);
      });
    });

    describe('finishEmptyCell', function() {
      it('should create a finished input cell', function() {
        var result = finishInputCellService.finishEmptyCell(options);
        expect(result.inputParameters).toEqual(options);
      });
    });

    describe('finishTextCell', function() {
      it('should create a finished input cell', function() {
        var performance = {
          value: 'foo'
        };
        var result = finishInputCellService.finishTextCell(options, performance);
        expect(result.firstParameter).toEqual(performance.value);
      });
    });

    describe('finishBetaCell', function() {
      it('should create a finished input cell', function() {
        var performance = {
          type: 'dbeta',
          parameters: {
            alpha: 10,
            beta: 15
          }
        };
        var result = finishInputCellService.finishBetaCell(options, performance);
        expect(result.firstParameter).toEqual(10);
        expect(result.secondParameter).toEqual(15);
      });
    });

    describe('finishGammaCell', function() {
      it('should create a finished input cell', function() {
        var performance = {
          type: 'dgamma',
          parameters: {
            alpha: 10,
            beta: 15
          }
        };
        var result = finishInputCellService.finishGammaCell(options, performance);
        expect(result.firstParameter).toEqual(10);
        expect(result.secondParameter).toEqual(15);
      });
    });

    describe('finishNormalInputCell', function() {
      it('should create a finished input cell', function() {
        var performance = {
          type: 'dnorm',
          parameters: {
            mu: 10,
            sigma: 15
          }
        };
        var result = finishInputCellService.finishNormalInputCell(options, performance);
        expect(result.firstParameter).toEqual(10);
        expect(result.secondParameter).toEqual(15);
      });
    });
  });
});
