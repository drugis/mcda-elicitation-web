'use strict';
define(['angular-mocks', 'mcda/manualInput/manualInput'], function() {
  describe('The manualInputService', function() {
    var manualInputService;
    beforeEach(module('elicit.manualInput'));
    beforeEach(inject(function(ManualInputService) {
      manualInputService = ManualInputService;
    }));

    describe('isValidInputData', function() {
      it('should be true for valid data of all types', function() {
        var inputData = {
          crit1: {
            treatment1: {
              type: 'exact',
              value: 0
            },
            treatment2: {
              type: 'dbeta',
              alpha: 2,
              beta: 3
            }
          },
          crit2: {
            treatment1: {
              type: 'dnorm',
              mu: 0.3,
              sigma: 10
            }
          }
        };
        expect(manualInputService.isValidInputData(inputData)).toBeTruthy();
      });
      it('should be falsy for invalid data', function() {
        var invalidExact = {
          crit1: {
            treatment1: {
              type: 'exact'
            }
          }
        };
        expect(manualInputService.isValidInputData(invalidExact)).toBeFalsy();
        var invalidAlpha = {
          crit1: {
            treatment1: {
              type: 'dbeta',
              alpha: null,
              beta: 3
            }
          }
        };
        expect(manualInputService.isValidInputData(invalidAlpha)).toBeFalsy();
        var invalidBeta = {
          crit1: {
            treatment1: {
              type: 'dbeta',
              alpha: null
            }
          }
        };
        expect(manualInputService.isValidInputData(invalidBeta)).toBeFalsy();
        var invalidSigma = {
          crit1: {
            treatment1: {
              type: 'dnorm',
              mu: 3
            }
          }
        };
        expect(manualInputService.isValidInputData(invalidSigma)).toBeFalsy();
        var invalidMu = {
          crit1: {
            treatment1: {
              type: 'dnorm',
              mu: null,
              sigma: 3
            }
          }
        };
        expect(manualInputService.isValidInputData(invalidMu)).toBeFalsy();
        var invalidNorm = {
          crit1: {
            treatment1: {
              type: 'dnorm'
            }
          }
        };
        expect(manualInputService.isValidInputData(invalidNorm)).toBeFalsy();
        var invalidType = {
          crit1: {
            treatment1: {
              type: 'somethingsomething'
            }
          }
        };
        expect(function() {
          manualInputService.isValidInputData(invalidType);
        }).toThrow(new TypeError('Cannot read property \'isValidInput\' of undefined'));

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
        var expectedResult = {
          'criterion 1 title': {
            treatment1: {
              type: 'exact',
              value: 0
            },
            treatment2: {
              type: 'exact',
              value: 0
            }
          },
          'criterion 2 title': {
            treatment1: {
              type: 'exact',
              value: 0
            },
            treatment2: {
              type: 'exact',
              value: 0
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

  });
});