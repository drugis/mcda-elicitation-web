'use strict';
define(['angular-mocks', 'mcda/manualInput/manualInput'], function() {
  describe('The manualInputService', function() {
    var manualInputService;
    beforeEach(module('elicit.manualInput'));
    beforeEach(inject(function(ManualInputService) {
      manualInputService = ManualInputService;
    }));

    describe('isInvalidCell', function() {
      it('should be true for valid data of all types', function() {
        var validExact = {
          type: 'exact',
          value: 0
        };
        var validBeta = {
          type: 'dbeta',
          alpha: 2,
          beta: 3
        };
        var validNorm = {
          type: 'dnorm',
          mu: 0.3,
          sigma: 10
        };
        expect(manualInputService.isInvalidCell(validExact)).toBeFalsy();
        expect(manualInputService.isInvalidCell(validBeta)).toBeFalsy();
        expect(manualInputService.isInvalidCell(validNorm)).toBeFalsy();
      });
      it('should be falsy for invalid data', function() {
        var invalidExact = {
          type: 'exact'
        };
        expect(manualInputService.isInvalidCell(invalidExact)).toBeTruthy();
        var invalidAlpha = {
          type: 'dbeta',
          alpha: null,
          beta: 3
        };
        expect(manualInputService.isInvalidCell(invalidAlpha)).toBeTruthy();
        var invalidBeta = {
          type: 'dbeta',
          alpha: null
        };
        expect(manualInputService.isInvalidCell(invalidBeta)).toBeTruthy();
        var invalidSigma = {
          type: 'dnorm',
          mu: 3
        };
        expect(manualInputService.isInvalidCell(invalidSigma)).toBeTruthy();
        var invalidMu = {
          type: 'dnorm',
          mu: null,
          sigma: 3
        };
        expect(manualInputService.isInvalidCell(invalidMu)).toBeTruthy();
        var invalidNorm = {
          type: 'dnorm'
        };
        expect(manualInputService.isInvalidCell(invalidNorm)).toBeTruthy();
        var invalidType = {
          type: 'somethingsomething'
        };
        expect(function() {
          manualInputService.isInvalidCell(invalidType);
        }).toThrow(new TypeError('Cannot read property \'isInvalidInput\' of undefined'));

      });
    });

    describe('createProblem', function() {
      it('should create a problem, ready to go to the workspace', function() {
        var title = 'title';
        var description = 'A random description of a random problem';
        var treatments = {
          treatment1: {
            name: 'treatment1'
          },
          treatment2: {
            name: 'treatment2'
          }
        };
        var criteria = [{
          name: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true
        }, {
          name: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false
        }];
        var performanceTable = {
          'favorable criterion': {
            'treatment1': {
              type: 'exact',
              value: 10
            },
            'treatment2': {
              type: 'exact',
              value: 5
            }
          },
          'unfavorable criterion': {
            'treatment1': {
              type: 'exact',
              value: 20
            },
            'treatment2': {
              type: 'exact',
              value: 30
            }
          }
        };
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable);
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
              scale: [-Infinity, Infinity]
            },
            'unfavorable criterion': {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [-Infinity, Infinity]
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
    });

    describe('prepareInputData', function() {
      it('should prepare a zero initialized table', function() {
        var treatments = {
          treatment1: {
            name: 'treatment1'
          },
          treatment2: {
            name: 'treatment2'
          }
        };
        var criteria = [{
          name: 'criterion 1 title'
        }, {
          name: 'criterion 2 title'
        }];
        var result = manualInputService.prepareInputData(criteria, treatments);
        var newCell = {
              type: 'exact',
              value: 0,
              label: 'exact(0)'
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
    });

    describe('inputToString', function() {
      it('should render exact, beta and normal effects', function() {
        var normal = {
          type: 'dnorm',
          mu: 2,
          sigma: 3
        };
        expect(manualInputService.inputToString(normal)).toEqual('N(2, 3)');
        var beta = {
          type: 'dbeta',
          alpha: 10,
          beta: 20
        };
        expect(manualInputService.inputToString(beta)).toEqual('Beta(10, 20)');
        var exact = {
          type: 'exact',
          value: 3.14
        };
        expect(manualInputService.inputToString(exact)).toEqual('exact(3.14)');
      });
    });

  });
});
