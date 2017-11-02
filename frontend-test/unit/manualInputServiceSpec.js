'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function() {
  describe('The manualInputService', function() {
    var manualInputService;
    beforeEach(module('elicit.manualInput'));
    beforeEach(inject(function() {}));
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
        }).toThrowError(TypeError);

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
          hash: 'favorable criterion',
          dataType: 'continuous'
        }, {
          name: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          hash: 'unfavorable criterion',
          dataType: 'continuous'
        }];
        var performanceTable = {
          'favorable criterion': {
            'treatment1': {
              type: 'exact',
              value: 10,
              hash: 'treatment1',
              source: 'distribution'
            },
            'treatment2': {
              type: 'exact',
              value: 5,
              hash: 'treatment2',
              source: 'distribution'
            }
          },
          'unfavorable criterion': {
            'treatment1': {
              type: 'exact',
              value: 20,
              hash: 'treatment1',
              source: 'distribution'
            },
            'treatment2': {
              type: 'exact',
              value: 30,
              hash: 'treatment2',
              source: 'distribution'
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
          name: 'survival mean',
          dataType: 'survival',
          summaryMeasure: 'mean',
          timeScale: 'hour',
          description: 'some crit description',
          unitOfMeasurement: 'hour',
          isFavorable: true,
          hash: 'survival mean'
        }, {
          name: 'survival at time',
          dataType: 'survival',
          summaryMeasure: 'survivalAtTime',
          timeScale: 'minute',
          timePointOfInterest: 3,
          description: 'some crit description',
          unitOfMeasurement: 'Proportion',
          isFavorable: false,
          hash: 'survival at time',
        }];

        var performanceTable = {
          'survival mean': {
            'treatment1': {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment1'
            },
            'treatment2': {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment2'
            }
          },
          'survival at time': {
            'treatment1': {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment1'
            },
            'treatment2': {
              type: 'dsurv',
              events: 3,
              exposure: 5,
              hash: 'treatment2'
            }
          }
        };
        //
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable);
        //
        var expectedResult = {
          title: title,
          description: description,
          valueTree: {
            title: 'Benefit-risk balance',
            children: [{
              title: 'Favourable effects',
              criteria: ['survival mean']
            }, {
              title: 'Unfavourable effects',
              criteria: ['survival at time']
            }]
          },
          criteria: {
            'survival mean': {
              title: 'survival mean',
              description: 'some crit description',
              unitOfMeasurement: 'hour',
              scale: [0, Infinity],
              source: undefined,
              sourceLink: undefined
            },
            'survival at time': {
              title: 'survival at time',
              description: 'some crit description',
              unitOfMeasurement: 'Proportion',
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
            criterion: 'survival mean',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'mean'
              }
            }
          }, {
            alternative: 'treatment2',
            criterion: 'survival mean',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'mean'
              }
            }
          }, {
            alternative: 'treatment1',
            criterion: 'survival at time',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'survivalAtTime',
                time: 3
              }
            }
          }, {
            alternative: 'treatment2',
            criterion: 'survival at time',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 3.001,
                beta: 5.001,
                summaryMeasure: 'survivalAtTime',
                time: 3
              }
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createDistribution', function() {
      it('should create correct distributions for all cases', function() {
        var dichotomousState = {
          count: 0,
          sampleSize: 10
        };
        var expectedDichotomousResult = {
          alpha: 1,
          beta: 11,
          type: 'dbeta'
        };
        var dichotomousResult = manualInputService.createDistribution(dichotomousState, 'dichotomous');
        expect(dichotomousResult).toEqual(expectedDichotomousResult);

        var survivalState = {
          events: 10,
          exposure: 100
        };
        var expectedSurvivalResult = {
          alpha: 10.001,
          beta: 100.001,
          type: 'dsurv'
        };
        var survivalResult = manualInputService.createDistribution(survivalState, 'survival');
        expect(survivalResult).toEqual(expectedSurvivalResult);

        var continuousStandardErrorNormalState = {
          mu: 5,
          stdErr: 0.5,
          continuousType: 'SEnorm'
        };
        var expectedContinuousStandardErrorNormalResult = {
          mu: 5,
          sigma: 0.5,
          type: 'dnorm'
        };
        var continuousStandardErrorNormalResult = manualInputService.createDistribution(continuousStandardErrorNormalState, 'continuous');
        expect(continuousStandardErrorNormalResult).toEqual(expectedContinuousStandardErrorNormalResult);

        var continuousStandardDeviationNormalState = {
          mu: 5,
          sigma: 6,
          sampleSize: 9,
          continuousType: 'SDnorm'
        };
        var expectedContinuousStandardDeviationNormalResult = {
          mu: 5,
          sigma: 2,
          type: 'dnorm'
        };
        var continuousStandardDeviationNormalResult = manualInputService.createDistribution(continuousStandardDeviationNormalState, 'continuous');
        expect(continuousStandardDeviationNormalResult).toEqual(expectedContinuousStandardDeviationNormalResult);

        var continuousStandardErrorStudentTState = {
          mu: 5,
          stdErr: 6,
          sampleSize: 9,
          continuousType: 'SEt'
        };
        var expectedContinuousStandardErrorStudentTResult = {
          mu: 5,
          stdErr: 6,
          dof: 8,
          type: 'dt'
        };
        var continuousStandardErrorStudentTResult = manualInputService.createDistribution(continuousStandardErrorStudentTState, 'continuous');
        expect(continuousStandardErrorStudentTResult).toEqual(expectedContinuousStandardErrorStudentTResult);

        var continuousStandardDeviationStudentTState = {
          mu: 5,
          sigma: 6,
          sampleSize: 9,
          continuousType: 'SDt'
        };
        var expectedContinuousStandardDeviationStudentTResult = {
          mu: 5,
          stdErr: 2,
          dof: 8,
          type: 'dt'
        };
        var continuousStandardDeviationStudentTResult = manualInputService.createDistribution(continuousStandardDeviationStudentTState, 'continuous');
        expect(continuousStandardDeviationStudentTResult).toEqual(expectedContinuousStandardDeviationStudentTResult);

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
        var result = manualInputService.prepareInputData(criteria, treatments, 'distribution');
        var newCell = {
          type: 'exact',
          value: undefined,
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

      it('should preserve data if there is old data supplied and the criterion type has not changed', function() {
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
          name: 'survival to exact',
          hash: 'survival to exact',
          dataType: 'exact'
        }, {
          name: 'survival stays the same',
          hash: 'survival stays the same',
          dataType: 'survival'
        }, {
          name: 'exact to survival',
          hash: 'exact to survival',
          dataType: 'survival'
        }];
        var oldCell = {
          type: 'dsurv',
          value: 5,
          source: 'distribution',
          isInvalid: false
        };
        var oldInputData = {
          'survival to exact': {
            treatment1: {
              type: 'dsurv'
            },
            treatment2: {
              type: 'dsurv'
            }
          },
          'survival stays the same': {
            treatment1: oldCell,
            treatment2: oldCell
          },
          'removed': {
            treatment1: oldCell,
            treatment2: oldCell
          },
          'exact to survival': {
            treatment1: {
              type: 'exact'
            },
            treatment2: {
              type: 'exact'
            }
          }
        };
        var result = manualInputService.prepareInputData(criteria, treatments, 'distribution', oldInputData);
        var newCellExact = {
          type: 'exact',
          value: undefined,
          source: 'distribution',
          isInvalid: true
        };
        var newCellSurvival = {
          type: 'dsurv',
          value: undefined,
          source: 'distribution',
          isInvalid: true
        };
        var expectedResult = {
          'survival to exact': {
            treatment1: newCellExact,
            treatment2: newCellExact
          },
          'survival stays the same': {
            treatment1: oldCell,
            treatment2: oldCell
          },
          'exact to survival': {
            treatment1: newCellSurvival,
            treatment2: newCellSurvival
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('inputToString', function() {
      describe('for exact effects', function() {
        it('should give missing or invalid data for an incomplete effect', function() {
          var exact = {
            type: 'exact'
          };
          expect(manualInputService.inputToString(exact)).toEqual('Missing or invalid input');
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
        it('should give missing or invalid  data for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingAlpha)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingBeta)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingBoth)).toEqual('Missing or invalid input');
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
        it('should give missing or invalid  data or invalid for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingMu)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingSigma)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingBoth)).toEqual('Missing or invalid input');
        });
        it('should render a complete effect', function() {
          var normal = {
            type: 'dnorm',
            mu: 2,
            sigma: 3
          };
          expect(manualInputService.inputToString(normal)).toEqual('N(2.000, 3)');
        });
      });
      describe('for t effects', function() {
        it('should give missing or invalid  data for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingMu)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingStdErr)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingDof)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingAll)).toEqual('Missing or invalid input');
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
        it('should give missing or invalid  data for an incomplete effect', function() {
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
          expect(manualInputService.inputToString(missingAlpha)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingBeta)).toEqual('Missing or invalid input');
          expect(manualInputService.inputToString(missingBoth)).toEqual('Missing or invalid input');
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