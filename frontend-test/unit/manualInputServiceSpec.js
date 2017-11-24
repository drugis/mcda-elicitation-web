'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function() {
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
        }).toThrowError(TypeError);

      });
    });

    describe('createProblem', function() {
      var title = 'title';
      var description = 'A random description of a random problem';
      var treatments = {
        treatment1: {
          title: 'treatment1',
          hash: 'treatment1'
        },
        treatment2: {
          title: 'treatment2',
          hash: 'treatment2'
        }
      };
      it('should create a problem, ready to go to the workspace', function() {
        var criteria = [{
          title: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true,
          hash: 'favorable criterion',
          dataSource: 'exact'
        }, {
          title: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          hash: 'unfavorable criterion',
          dataSource: 'exact'
        }];
        var performanceTable = {
          'favorable criterion': {
            treatment1: {
              type: 'exact',
              value: 10,
              hash: 'treatment1',
              source: 'exact'
            },
            treatment2: {
              type: 'exact',
              value: 5,
              hash: 'treatment2',
              source: 'exact'
            }
          },
          'unfavorable criterion': {
            treatment1: {
              type: 'exact',
              value: 20,
              hash: 'treatment1',
              source: 'exact'
            },
            treatment2: {
              type: 'exact',
              value: 30,
              hash: 'treatment2',
              source: 'exact'
            }
          }
        };
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable, true);
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
          title: 'survival mean',
          dataType: 'survival',
          summaryMeasure: 'mean',
          timeScale: 'hour',
          description: 'some crit description',
          unitOfMeasurement: 'hour',
          isFavorable: true,
          hash: 'survival mean',
          dataSource: 'study'
        }, {
          title: 'survival at time',
          dataType: 'survival',
          summaryMeasure: 'survivalAtTime',
          timeScale: 'minute',
          timePointOfInterest: 3,
          description: 'some crit description',
          unitOfMeasurement: 'Proportion',
          isFavorable: false,
          hash: 'survival at time',
          dataSource: 'study'
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
        var result = manualInputService.createProblem(criteria, treatments, title, description, performanceTable, true);
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
        // criteria
        var dichotomousCriterion = {
          dataSource: 'study',
          dataType: 'dichotomous'
        };
        var survivalCriterion = {
          dataSource: 'study',
          dataType: 'survival'
        };
        var continuousCriterion = {
          dataSource: 'study',
          dataType: 'continuous'
        };

        // tests
        var dichotomousState = {
          count: 0,
          sampleSize: 10
        };
        var expectedDichotomousResult = {
          alpha: 1,
          beta: 11,
          type: 'dbeta'
        };
        var dichotomousResult = manualInputService.createDistribution(dichotomousState, dichotomousCriterion);
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
        var survivalResult = manualInputService.createDistribution(survivalState, survivalCriterion);
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
        var continuousStandardErrorNormalResult = manualInputService
          .createDistribution(continuousStandardErrorNormalState, continuousCriterion);
        expect(continuousStandardErrorNormalResult)
          .toEqual(expectedContinuousStandardErrorNormalResult);

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
        var continuousStandardDeviationNormalResult = manualInputService
          .createDistribution(continuousStandardDeviationNormalState, continuousCriterion);
        expect(continuousStandardDeviationNormalResult)
          .toEqual(expectedContinuousStandardDeviationNormalResult);

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
        var continuousStandardErrorStudentTResult = manualInputService
          .createDistribution(continuousStandardErrorStudentTState, continuousCriterion);
        expect(continuousStandardErrorStudentTResult)
          .toEqual(expectedContinuousStandardErrorStudentTResult);

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
        var continuousStandardDeviationStudentTResult = manualInputService
          .createDistribution(continuousStandardDeviationStudentTState, continuousCriterion);
        expect(continuousStandardDeviationStudentTResult)
          .toEqual(expectedContinuousStandardDeviationStudentTResult);

      });
    });

    describe('prepareInputData', function() {
      it('should prepare a zero initialized table', function() {
        var treatments = {
          treatment1: {
            title: 'treatment1',
            hash: 'treatment1'
          },
          treatment2: {
            title: 'treatment2',
            hash: 'treatment2'
          }
        };
        var criteria = [{
          title: 'criterion 1 title',
          hash: 'criterion 1 title',
          dataSource: 'exact'
        }, {
          title: 'criterion 2 title',
          hash: 'criterion 2 title',
          dataSource: 'exact'
        }];
        var result = manualInputService.prepareInputData(criteria, treatments);
        var newCell = {
          type: 'exact',
          value: undefined,
          source: 'exact',
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
            title: 'treatment1',
            hash: 'treatment1'
          },
          treatment2: {
            title: 'treatment2',
            hash: 'treatment2'
          }
        };
        var criteria = [{
          title: 'survival to exact',
          hash: 'survival to exact',
          dataType: 'exact',
          dataSource: 'exact'
        }, {
          title: 'survival stays the same',
          hash: 'survival stays the same',
          dataType: 'survival',
          dataSource: 'study'
        }, {
          title: 'exact to survival',
          hash: 'exact to survival',
          dataType: 'survival',
          dataSource: 'study'
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
        var result = manualInputService.prepareInputData(criteria, treatments, oldInputData);
        var newCellExact = {
          type: 'exact',
          value: undefined,
          source: 'exact',
          isInvalid: true
        };
        var newCellSurvival = {
          type: 'dsurv',
          value: undefined,
          source: 'study',
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

    describe('createInputFromOldWorkspace', function() {
      it('should calculate the effects table input parameters from the performanceTable of the old workspace', function() {
        var criteria = [{
          title: 'criterion 1',
          hash: 'c1',
          dataSource: 'exact'
        }, {
          title: 'criterion 2',
          hash: 'c2',
          dataSource: 'study',
          dataType: 'dichotomous'
        }, {
          title: 'criterion 3',
          hash: 'c3',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 4',
          hash: 'c4',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 5',
          hash: 'c5',
          dataSource: 'study',
          dataType: 'survival'
        }];
        var alternatives = [{
          title: 'alternative 1',
          hash: 'a1'
        }];
        var oldWorkspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1'
              },
              crit2: {
                title: 'criterion 2'
              },
              crit3: {
                title: 'criterion 3'
              },
              crit4: {
                title: 'criterion 4'
              },
              crit5: {
                title: 'criterion 5'
              }
            },
            alternatives: {
              alt1: {
                title: 'alternative 1'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              performance: {
                type: 'exact',
                value: 1337
              }
            }, {
              criterion: 'crit2',
              alternative: 'alt1',
              performance: {
                type: 'dbeta',
                parameters: {
                  alpha: 12,
                  beta: 23
                }
              }
            }, {
              criterion: 'crit3',
              alternative: 'alt1',
              performance: {
                type: 'dt',
                parameters: {
                  dof: 123,
                  stdErr: 2.3,
                  mu: 30
                }
              }
            }, {
              criterion: 'crit4',
              alternative: 'alt1',
              performance: {
                type: 'dnorm',
                parameters: {
                  sigma: 1.2,
                  mu: 23
                }
              }
            }, {
              criterion: 'crit5',
              alternative: 'alt1',
              performance: {
                type: 'dsurv',
                parameters: {
                  alpha: 12.001,
                  beta: 23.001,
                  summaryMeasure: 'mean'
                }
              }
            }, ]
          }
        };
        var inputData = {
          c1: {
            a1: {
              type: 'exact',
              value: undefined
            }
          },
          c2: {
            a1: {
              type: 'dbeta',
              count: undefined,
              sampleSize: undefined
            }
          },
          c3: {
            a1: {
              type: 'dt',
              mu: undefined,
              stdErr: undefined,
              sampleSize: undefined
            }
          },
          c4: {
            a1: {
              type: 'dnorm',
              stdErr: undefined,
              mu: undefined
            }
          },
          c5: {
            a1: {
              type: 'dsurv',
              events: undefined,
              exposure: undefined,
              summaryMeasure: undefined
            }
          }
        };
        var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace, inputData);
        var expectedResult = {
          c1: {
            a1: {
              type: 'exact',
              value: 1337,
              isInvalid: false,
              label: 'exact(1337)'
            }
          },
          c2: {
            a1: {
              type: 'dbeta',
              count: 11,
              sampleSize: 33,
              isInvalid: false,
              label: 'Beta(12, 23)'
            }
          },
          c3: {
            a1: {
              type: 'dt',
              mu: 30,
              stdErr: 2.3,
              sampleSize: 124,
              isInvalid: false,
              continuousType: 'SEt',
              label: 't(30, 2.3, 123)'
            }
          },
          c4: {
            a1: {
              type: 'dnorm',
              mu: 23,
              stdErr: 1.2,
              isInvalid: false,
              continuousType: 'SEnorm',
              label: 'N(23.000, 1.2)'
            }
          },
          c5: {
            a1: {
              type: 'dsurv',
              events: 12,
              exposure: 23,
              summaryMeasure: 'mean',
              isInvalid: false,
              label: 'Gamma(12.001, 23.001)',
              timeScale: undefined
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('copyWorkspaceCriteria', function() {
      it('should copy the criteria from the oldworkspace to the format used by the rest of the manual input', function() {
        var workspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'bla',
                source: 'single study',
                sourceLink: 'http://www.drugis.org'
              },
              crit2: {
                title: 'criterion 2',
                description: 'bla 2',
                source: 'single study',
                sourceLink: 'http://www.drugis.org'
              },
              crit3: {
                title: 'criterion 3',
                description: 'bla3',
                source: 'single study',
                sourceLink: 'http://www.drugis.org'
              },
              crit4: {
                title: 'criterion 4',
                description: 'bla4',
                source: 'single study',
                sourceLink: 'http://www.drugis.org'
              },
              crit5: {
                title: 'criterion 5',
                description: 'bla5',
                source: 'single study',
                sourceLink: 'http://www.drugis.org'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              performance: {
                type: 'dsurv',
                parameters: {
                  summaryMeasure: 'mean',
                  time: 200,
                }
              }
            }, {
              criterion: 'crit2',
              performance: {
                type: 'dbeta'
              }
            }, {
              criterion: 'crit3',
              performance: {
                type: 'dt'
              }
            }, {
              criterion: 'crit4',
              performance: {
                type: 'dnorm'
              }
            }, {
              criterion: 'crit5',
              performance: {
                type: 'exact'
              }
            }]
          }
        };
        var result = manualInputService.copyWorkspaceCriteria(workspace);
        var expectedResult = [{
          title: 'criterion 1',
          description: 'bla',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          dataSource: 'study',
          dataType: 'survival',
          summaryMeasure: 'mean',
          timePointOfInterest: 200,
          timeScale: 'time scale not set'
        }, {
          title: 'criterion 2',
          description: 'bla 2',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          dataSource: 'study',
          dataType: 'dichotomous'
        }, {
          title: 'criterion 3',
          description: 'bla3',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 4',
          description: 'bla4',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          dataSource: 'study',
          dataType: 'continuous'
        }, {
          title: 'criterion 5',
          description: 'bla5',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          dataSource: 'exact'
        }];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});