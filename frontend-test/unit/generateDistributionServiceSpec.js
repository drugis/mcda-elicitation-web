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
      label: 'Proportion (percentage)',
      validator: validator
    };
    var decimalConstraint = {
      label: 'Proportion (decimal)',
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
        cell.constraint = percentageConstraint.label;
        cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
        var result = generateDistributionService.generateValueDistribution(cell);
        var expectedResult = {
          firstParameter: 0.5,
          label: label,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });

      it('should generate an exact distribution, removing decimal proportion constraints', function() {
        cell.constraint = decimalConstraint.label;
        cell.inputParameters.firstParameter.constraints.push(decimalConstraint);
        var result = generateDistributionService.generateValueDistribution(cell);
        var expectedResult = {
          firstParameter: 50,
          label: label,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('generateValueSEDistribution', function() {
      var cell;
      beforeEach(function() {
        cell = {
          firstParameter: 50,
          secondParameter: 0.5,
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

      it('should generate a normal distribution', function() {
        var result = generateDistributionService.generateValueSEDistribution(options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 50,
          secondParameter: 0.5,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });

      it('should generate a normal distribution from a percentage', function() {
        cell.constraint = percentageConstraint.label;
        var result = generateDistributionService.generateValueSEDistribution(options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 0.5,
          secondParameter: 0.005,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
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
        cell.constraint = percentageConstraint.label;
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

    describe('generateValueSampleSizeDistribution', function() {
      var cell;
      beforeEach(function() {
        cell = {
          firstParameter: 50,
          secondParameter: 100,
          inputParameters: {
            firstParameter: {
              constraints: []
            }
          }
        };
      });

      it('should generate an exact distribution', function() {
        var result = generateDistributionService.generateValueSampleSizeDistribution(options, options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 50,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });

      it('should generate beta distribution given a percentage constraint', function() {
        cell.constraint = percentageConstraint.label;
        cell.inputParameters.firstParameter.constraints.push(percentageConstraint);
        var result = generateDistributionService.generateValueSampleSizeDistribution(options, options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 51,
          secondParameter: 51,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });

      it('should generate beta distribution given a decimal constraint', function() {
        cell.constraint = decimalConstraint.label;
        cell.inputParameters.firstParameter.constraints.push(decimalConstraint);
        cell.firstParameter = 0.5;
        var result = generateDistributionService.generateValueSampleSizeDistribution(options, options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 51,
          secondParameter: 51,
          inputParameters: options
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('generateEventsSampleSizeDistribution', function() {
      it('should generate a beta distribution', function() {
        var cell = {
          firstParameter: 50,
          secondParameter: 100
        };
        var result = generateDistributionService.generateEventsSampleSizeDistribution(options, cell);
        var expectedResult = {
          label: label,
          firstParameter: 51,
          secondParameter: 51,
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
