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
        var validT = {
          type: 'dt',
          mu: 1.5,
          stdErr: 0.5,
          dof: 15
        };
        expect(manualInputService.isInvalidCell(validExact)).toBeFalsy();
        expect(manualInputService.isInvalidCell(validBeta)).toBeFalsy();
        expect(manualInputService.isInvalidCell(validNorm)).toBeFalsy();
        expect(manualInputService.isInvalidCell(validT)).toBeFalsy();
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
        var invalidT = {
          type: 'dt'
        };
        expect(manualInputService.isInvalidCell(invalidT)).toBeTruthy();
        var invalidTmu = {
          type: 'dt',
          mu: NaN,
          stdErr: 1.4,
          dof: 123
        };
        expect(manualInputService.isInvalidCell(invalidTmu)).toBeTruthy();
        var invalidTstdErr = {
          type: 'dt',
          mu: 12,
          stdErr: null,
          dof: 123
        };
        expect(manualInputService.isInvalidCell(invalidTstdErr)).toBeTruthy();
        var invalidTdof = {
          type: 'dt',
          mu: 12,
          stdErr: 2,
          dof: undefined
        };
        expect(manualInputService.isInvalidCell(invalidTdof)).toBeTruthy();
        var invalidType = {
          type: 'somethingsomething'
        };
        expect(function() {
          manualInputService.isInvalidCell(invalidType);
        }).toThrow(new TypeError('Cannot read property \'isInvalidInput\' of undefined'));

      });
    });

    describe('createProblem', function() {
      var title = 'title';
      var description = 'A random description of a random problem';
      var treatments = {
        treatment1: {
          name: 'treatment1',
          hash: 'treatment1'
        },
        treatment2: {
          name: 'treatment2',
          hash: 'treatment2'
        }
      };
      it('should create a problem, ready to go to the workspace', function() {
        var criteria = [{
          name: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true,
          hash: 'favorable criterion'
        }, {
          name: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          hash: 'unfavorable criterion',
        }];
        var performanceTable = {
          'favorable criterion': {
            'treatment1': {
              type: 'exact',
              value: 10,
              hash: 'treatment1'
            },
            'treatment2': {
              type: 'exact',
              value: 5,
              hash: 'treatment2'
            }
          },
          'unfavorable criterion': {
            'treatment1': {
              type: 'exact',
              value: 20,
              hash: 'treatment1'
            },
            'treatment2': {
              type: 'exact',
              value: 30,
              hash: 'treatment2'
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
              scale: [-Infinity, Infinity],
              source: undefined,
              sourceLink: undefined
            },
            'unfavorable criterion': {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [-Infinity, Infinity],
              source: undefined,
              sourceLink: undefined
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
      it('should create a problem with survival data', function() {
        var criteria = [{
          name: 'favorable survival',
          dataType: 'survival',
          summaryMeasure: 'mean',
          timeScale: 'hour',
          description: 'some crit description',
          unitOfMeasurement: 'hour',
          isFavorable: true,
          hash: 'favorable criterion'
        }, {
          name: 'unfavorable criterion',
          dataType: 'survival',
          summaryMeasure: 'survivalAtTime',
          timeScale: 'minute',
          timePointOfInterest: 3,
          description: 'some crit description',
          unitOfMeasurement: 'Proportion',
          isFavorable: false,
          hash: 'unfavorable criterion',
        }];

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
              unitOfMeasurement: 'hour',
              scale: [0, Infinity],
              source: undefined,
              sourceLink: undefined
            },
            'unfavorable criterion': {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [0, 1],
              source: undefined,
              sourceLink: undefined
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
        var performanceTable = {
          'favorable survival': {
            'treatment1': {
              type: 'dsurv',
              alpha: 3,
              beta: 5,
              hash: 'treatment1'
            },
            'treatment2': {
              type: 'dsurv',
              alpha: 3,
              beta: 5,
              hash: 'treatment2'
            }
          },
          'unfavorable survival': {
            'treatment1': {
              type: 'dsurv',
              alpha: 3,
              beta: 5,
              hash: 'treatment1'
            },
            'treatment2': {
              type: 'dsurv',
              alpha: 3,
              beta: 5,
              hash: 'treatment2'
            }
          }
        };
        //
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable);
        //
        expect(result).toEqual(expectedResult);
      });
    });

    describe('prepareInputData', function() {
      it('should prepare a zero initialized table', function() {
        var treatments = {
          treatment1: {
            name: 'treatment1',
            hash: 'treatment1'
          },
          treatment2: {
            name: 'treatment2',
            hash: 'treatment2'
          }
        };
        var criteria = [{
          name: 'criterion 1 title',
          hash: 'criterion 1 title'
        }, {
          name: 'criterion 2 title',
          hash: 'criterion 2 title'
        }];
        var result = manualInputService.prepareInputData(criteria, treatments);
        var newCell = {
          type: 'exact',
          value: undefined,
          label: 'No data entered',
          source: 'distribution',
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
    });

    describe('inputToString', function() {
      describe('for exact effects', function() {
        it('should give missing data for an incomplete effect', function() {
          var exact = {
            type: 'exact'
          };
          expect(manualInputService.inputToString(exact)).toEqual('Missing input');
        });
        it('should render a complete effect', function() {
          var exact = {
            type: 'exact',
            value: 3.14
          };
          expect(manualInputService.inputToString(exact)).toEqual('exact(3.14)');
        });
      });
      describe('for beta effects', function() {
        it('should give missing data for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingAlpha)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingBeta)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingBoth)).toEqual('Missing input');
        });
        it('should render a complete effect', function() {
          var beta = {
            type: 'dbeta',
            alpha: 10,
            beta: 20
          };
          expect(manualInputService.inputToString(beta)).toEqual('Beta(10, 20)');
        });
      });
      describe('for normal effects', function() {
        it('should give missing data for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingMu)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingSigma)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingBoth)).toEqual('Missing input');
        });
        it('should render a complete effect', function() {
          var normal = {
            type: 'dnorm',
            mu: 2,
            sigma: 3
          };
          expect(manualInputService.inputToString(normal)).toEqual('N(2, 3)');
        });
      });
      describe('for t effects', function() {
        it('should give missing data for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingMu)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingStdErr)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingDof)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingAll)).toEqual('Missing input');
        });
        it('should render a complete effect', function() {
          var t = {
            type: 'dt',
            mu: 3.14,
            stdErr: 1.23,
            dof: 37
          };
          expect(manualInputService.inputToString(t)).toEqual('t(3.14, 1.23, 37)');
        });
      });
      describe('for surv effects', function() {
        it('should give missing data for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingAlpha)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingBeta)).toEqual('Missing input');
          expect(manualInputService.inputToString(missingBoth)).toEqual('Missing input');
        });
        it('should render a complete effect', function() {
          var beta = {
            type: 'dsurv',
            alpha: 10,
            beta: 20
          };
          expect(manualInputService.inputToString(beta)).toEqual('Gamma(10, 20)');
        });
      });
    });

  });
});
