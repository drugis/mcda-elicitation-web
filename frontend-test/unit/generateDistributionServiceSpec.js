'use strict';
define(['angular', 'lodash', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular, _) {
  describe('the generate distribution service', function() {
    var generateDistributionService;

    var label = 'label';
    var options = {
      toString: function() {
        return label;
      },
      firstParameter: {
        constraints: []
      },
      secondParameter: {
        constraints: []
      }
    };
    var validator = function() {
      return;
    };
    var percentageConstraint = {
      label: 'percentage',
      validator: validator
    };
    var decimalConstraint = {
      label: 'decimal',
      validator: validator
    };

    beforeEach(angular.mock.module('elicit.manualInput'));

    beforeEach(inject(function(GenerateDistributionService) {
      generateDistributionService = GenerateDistributionService;
    }));

    describe('generateValueDistribution', function() {
      var cell;
      beforeEach(function() {
        cell = {
          label: label,
          firstParameter: 50,
          inputParameters: {
            firstParameter: {
              constraints: []
            },
            secondParameter: {
              constraints: []
            },
            toString: options.toString
          }
        };
      });

      it('should generate an exact distribution', function() {
        var result = generateDistributionService.generateValueDistribution(cell);
        expect(result).toEqual(cell);
      });

      it('should generate an exact distribution from a percentage value', function() {
        cell.constraint = 'percentage';
        cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
        var result = generateDistributionService.generateValueDistribution(cell);
        expect(result).toEqual(cell);
      });

      it('should generate an exact distribution, keeping decimal proportion constraints', function() {
        cell.constraint = 'decimal';
        cell.inputParameters.firstParameter.constraints.push(decimalConstraint);
        var result = generateDistributionService.generateValueDistribution(cell);
        expect(result).toEqual(cell);
      });
    });

    describe('generateValueCIDistribution', function() {
      var cell;
      beforeEach(function() {
        cell = {
          firstParameter: 50,
          secondParameter: 40,
          thirdParameter: 60,
          inputParameters: {
            firstParameter: {
              constraints: []
            },
            secondParameter: {
              constraints: []
            }
          }
        };
      });

      it('should generate a normal distribution given a symmetric interval', function() {
        var result = generateDistributionService.generateValueCIDistribution(options, options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 50,
          secondParameter: 5.102,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });

      it('should generate a normal distribution given an almost (eps < 0.05) symmetric interval', function() {
        cell.thirdParameter = 60.2;
        var result = generateDistributionService.generateValueCIDistribution(options, options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 50,
          secondParameter: 5.153,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });

      it('should generate an exact distribution given a asymmetric interval', function() {
        cell.secondParameter = 30;
        var result = generateDistributionService.generateValueCIDistribution(options, options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 50,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });

      it('should generate a non-percentage normal distribution given a symmetric interval and a percentage constraint', function() {
        cell.constraint = 'percentage';
        cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
        cell.inputParameters.secondParameter.constraints.push(percentageConstraint);
        var result = generateDistributionService.generateValueCIDistribution(options, options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 0.5,
          secondParameter: 0.05102,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('generateEmptyDistribution', function() {
      it('should copy the cell', function() {
        var cell = {
          foo: 'bar'
        };
        var result = generateDistributionService.generateEmptyDistribution(cell);
        expect(result).toEqual(cell);
      });
    });
  });
});
