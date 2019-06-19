'use strict';
define(['angular', 'lodash', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular, _) {
  describe('the finish input service', function() {
    var finishInputCellService;
    var options = {
      firstParameter:{
        constraints: []
      }
    };
    var constraintServiceMock = jasmine.createSpyObj('ConstraintService', [
      'percentage',
      'decimal'
    ]);

    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('ConstraintService', constraintServiceMock);
    }));
 
    beforeEach(inject(function(FinishInputCellService) {
      finishInputCellService = FinishInputCellService;
    }));

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
        var result = finishInputCellService.finishValueCell(options, performance);
        expect(result.firstParameter).toEqual(0.5);
        expect(result.inputParameters.firstParameter.constraints[1].label).toEqual('Proportion (decimal)');
      });
    });
  });
});
