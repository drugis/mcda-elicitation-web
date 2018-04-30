'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular) {
  var MISSING_OR_INVALID = 'Missing or invalid input';
  var NULL_PARAMETERS = {
    firstParameter: {
      constraints: []
    },
    secondParameter: {
      constraints: []
    },
    thirdParameter: {
      constraints: []
    }
  };
  var generateUuidMock = jasmine.createSpy('generateUuid');
  var manualInputService;
  describe('The manualInputService', function() {
    beforeEach(module('elicit.manualInput', function($provide) {
      $provide.value('generateUuid', generateUuidMock);
    }));
    beforeEach(inject(function(ManualInputService) {
      manualInputService = ManualInputService;
    }));
    describe('getInputError', function() {
      it('should run all the constraints of a cell\'s parameters, returning the first error found', function() {
        var cell = {
          firstParameter: 10,
          secondParameter: 20,
          inputParameters: {
            firstParameter: {
              constraints: [
                function() { }
              ]
            },
            secondParameter: {
              constraints: [
                function() { },
                function() { return 'error message' }
              ]
            }
          }
        };
        var result = manualInputService.getInputError(cell);
        expect(result).toBe('error message');
      });
    });

    describe('inputToString,', function() {
      var cell;
      describe('for incorrect input', function() {
        it('should return the invalid input message', function() {
          var cell = {
            firstParameter: 10,
            inputParameters: {
              firstParameter: {
                constraints: [function() { return 'error'; }]
              }
            }
          };
          var result = manualInputService.inputToString(cell);
          expect(result).toEqual(MISSING_OR_INVALID);
        });
      });
      describe('for distributions,', function() {
        beforeEach(function() {
          cell = {
            inputType: 'distribution'
          };
        });
        describe('for assisted inputs,', function() {
          beforeEach(function() {
            cell.inputMethod = 'assistedDistribution';
            cell.firstParameter = 30;
            cell.secondParameter = 40;
            cell.thirdParameter = 150;
            cell.inputParameters = angular.copy(NULL_PARAMETERS);
          });
          describe('for dichotomous inputs,', function() {
            beforeEach(function() {
              cell.dataType = 'dichotomous';
            });
            it('should render correct inputs', function() {
              var expectedResult = '30 / 40\nDistribution: Beta(31, 12)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for continuous inputs,', function() {
            beforeEach(function() {
              cell.dataType = 'continuous';
            });
            describe('for inputs with standard error', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'assistedContinuousStdErr';
              });
              it('should render correct inputs', function() {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 40)';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('for inputs with standard deviation', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'assistedContinuousStdDev';
              });
              it('should render correct inputs', function() {
                var expectedResult = '30 (40), 150\nDistribution: t(149, 30, 3.266)';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
        });
        describe('for manual inputs,', function() {
          beforeEach(function() {
            cell.inputMethod = 'manualDistribution';
            cell.firstParameter = 30;
            cell.secondParameter = 40;
            cell.inputParameters = angular.copy(NULL_PARAMETERS);
          });
          describe('for beta distributions', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'manualBeta';
            });
            it('should render correct inputs', function() {
              var expectedResult = 'Beta(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for normal distributions', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'manualNormal';
            });
            it('should render correct inputs', function() {
              var expectedResult = 'Normal(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for gamma distributions', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'manualGamma';
            });
            it('should render correct inputs', function() {
              var expectedResult = 'Gamma(30, 40)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for exact inputs,', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'manualExact';
            });
            it('should render correct inputs', function() {
              var expectedResult = 'exact(30)';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
        });
      });
      describe('for effects,', function() {
        beforeEach(function() {
          cell = {
            inputType: 'effect',
            inputParameters: angular.copy(NULL_PARAMETERS)
          };
        });
        describe('for dichotomous,', function() {
          beforeEach(function() {
            cell.dataType = 'dichotomous';
            cell.firstParameter = 0.5;
          });
          describe('for decimal input', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousDecimal';
            });
            it('should render correct inputs', function() {
              var expectedResult = '0.5\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for decimal inputs with sample size', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousDecimalSampleSize';
              cell.secondParameter = 100;
            });
            it('should render correct inputs with sample size', function() {
              var expectedResult = '0.5 (100)\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function() {
              cell.isNormal = true;
              var expectedResult = '0.5 (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for percentage input', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousPercentage';
            });
            it('should render correct inputs', function() {
              delete cell.secondParameter;
              var expectedResult = '0.5%\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for percentage inputs with sample size', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousPercentageSampleSize';
              cell.firstParameter = 50;
              cell.secondParameter = 100;
            }); it('should render correct inputs with sample size', function() {
              var expectedResult = '50% (100)\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function() {
              cell.isNormal = true;
              var expectedResult = '50% (100)\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
          describe('for fraction input', function() {
            beforeEach(function() {
              cell.inputParameters.id = 'dichotomousFraction';
              cell.firstParameter = 50;
              cell.secondParameter = 100;
            });
            it('should render correct inputs', function() {
              var expectedResult = '50 / 100\nDistribution: none';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
            it('should render correct normalised inputs', function() {
              cell.isNormal = true;
              var expectedResult = '50 / 100\nNormal(0.5, ' + Math.sqrt(0.5 * (1 - 0.5) / 100) + ')';
              var result = manualInputService.inputToString(cell);
              expect(result).toEqual(expectedResult);
            });
          });
        });
        describe('for continuous,', function() {
          beforeEach(function() {
            cell.dataType = 'continuous';
            cell.firstParameter = 50;
            cell.secondParameter = 5;
            cell.thirdParameter = 100;
          });
          describe('for parameter of interest mean,', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'mean';
            });
            describe('without dispersion', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'continuousMeanNoDispersion';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with standard error', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'continuousMeanStdErr';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50 (5)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
              it('should render correct inputs with normal distribution', function() {
                var normalCell = angular.copy(cell);
                normalCell.isNormal = true;
                var expectedResult = '50 (5)\nNormal(50, 5)';
                var result = manualInputService.inputToString(normalCell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with a confidence interval', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'continuousMeanConfidenceInterval';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50 (5; 100)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
              it('should render correct inputs with normal distribution', function() {
                var normalCell = angular.copy(cell);
                normalCell.isNormal = true;
                var expectedResult = '50 (5; 100)\nNormal(50, ' + (100 - 5) / (2 * 1.96) + ')';
                var result = manualInputService.inputToString(normalCell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
          describe('for parameter of interest median', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'median';
            });
            describe('without dispersion', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'continuousMedianNoDispersion';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with a confidence interval', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'continuousMedianConfidenceInterval';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50 (5; 100)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
          describe('for parameter of interest cumulative probability', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'cumulativeProbability';
              cell.scale = 'percentage';
            });
            describe('without dispersion', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'cumulativeProbabilityValue';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50%\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
            describe('with a confidence interval', function() {
              beforeEach(function() {
                cell.inputParameters.id = 'cumulativeProbabilityValueCI';
              });
              it('should render correct inputs', function() {
                var expectedResult = '50% (5%; 100%)\nDistribution: none';
                var result = manualInputService.inputToString(cell);
                expect(result).toEqual(expectedResult);
              });
            });
          });
        });
      });
    });

    describe('prepareInputData', function() {
      it('should prepare the cells of the table for input', function() {
        var treatments = {
          alternative1: {
            title: 'alternative1',
            id: 'alternative1'
          },
          alternative2: {
            title: 'alternative2',
            id: 'alternative2'
          }
        };
        var criteria = [{
          id: 'crit1id',
          title: 'criterion 1 title',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'other',
        }, {
          id: 'crit2id',
          title: 'criterion 2 title',
          inputType: 'effect',
          dataType: 'other'
        }];
        var result = manualInputService.prepareInputData(criteria, treatments);
        var expectedResult = {
          'crit1id': {
            alternative1: _.extend({}, criteria[0], {
              isInvalid: true
            }),
            alternative2: _.extend({}, criteria[0], {
              isInvalid: true
            })
          },
          'crit2id': {
            alternative1: _.extend({}, criteria[1], {
              isInvalid: true
            }),
            alternative2: _.extend({}, criteria[1], {
              isInvalid: true
            })
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should preserve data if there is old data supplied and the criterion type has not changed', function() {
        var treatments = {
          alternative1: {
            title: 'alternative1',
            id: 'alternative1'
          },
          alternative2: {
            title: 'alternative2',
            id: 'alternative2'
          }
        };
        var criteria = [{
          title: 'criterion 1 title',
          id: 'criterion1',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'other'
        }, {
          title: 'criterion 2 title',
          id: 'criterion2',
          inputType: 'effect',
          dataType: 'other'
        }];

        var oldInputData = {
          'criterion2': {
            alternative1: {
              title: 'criterion 2 oldtitle',
              inputType: 'distribution',
              inputMethod: 'manualDistribution'
            },
            alternative2: criteria[1]
          }
        };
        var result = manualInputService.prepareInputData(criteria, treatments, oldInputData);

        var expectedResult = {
          'criterion1': {
            alternative1: _.extend({}, criteria[0], {
              isInvalid: true
            }),
            alternative2: _.extend({}, criteria[0], {
              isInvalid: true
            })
          },
          'criterion2': {
            alternative1: oldInputData['criterion2']['alternative1'],
            alternative2: criteria[1]
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createProblem', function() {
      var title = 'title';
      var description = 'A random description of a random problem';
      var treatments = [{
        title: 'alternative1',
        id: 'alternative1'
      },
      {
        title: 'alternative2',
        id: 'alternative2'
      }];
      it('should create a problem, ready to go to the workspace', function() {
        var criteria = [{
          title: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true,
          id: 'criterion1id',
          scale: [0, 1],
          omitThis: 'yech',
          inputType: 'effect',
          dataType: 'other'
        }, {
          title: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          id: 'criterion2id',
          inputType: 'distribution',
          inputMethod: 'manualDistribution'
        }, {
          title: 'dichotomousDecimalSampleSize',
          id: 'criterion3id',
          inputType: 'effect',
          dataType: 'dichotomous',
        }];
        var inputData = {
          criterion1id: {
            alternative1: {
              inputType: 'effect',
              dataType: 'other',
              firstParameter: 10,
              inputParameters: {
                id: 'value'
              }
            },
            alternative2: {
              inputType: 'effect',
              dataType: 'other',
              firstParameter: 5,
              secondParameter: 3,
              thirdParameter: 7,
              inputParameters: {
                id: 'valueCI'
              }
            }
          },
          criterion2id: {
            alternative1: {
              inputType: 'distribution',
              inputMethod: 'manualDistribution',
              firstParameter: 20,
              inputParameters: {
                id: 'manualExact'
              }
            },
            alternative2: {
              inputType: 'distribution',
              inputMethod: 'manualDistribution',
              firstParameter: 30,
              inputParameters: {
                id: 'manualExact'
              }
            }
          },
          criterion3id: {
            alternative1: {
              inputType: 'effect',
              dataType: 'dichotomous',
              isNormal: true,
              firstParameter: 0.5,
              secondParameter: 20,
              inputParameters: {
                id: 'dichotomousDecimalSampleSize'
              }
            },
            alternative2: {
              inputType: 'effect',
              dataType: 'dichotomous',
              isNormal: false,
              firstParameter: 0.5,
              secondParameter: 20,
              inputParameters: {
                id: 'dichotomousDecimalSampleSize'
              }
            }

          }
        };
        var result = manualInputService.createProblem(criteria, treatments, title, description, inputData, true);
        var expectedResult = {
          title: title,
          schemaVersion: '1.0.0',
          description: description,
          valueTree: {
            title: 'Benefit-risk balance',
            children: [{
              title: 'Favourable effects',
              criteria: ['criterion1id']
            }, {
              title: 'Unfavourable effects',
              criteria: ['criterion2id', 'criterion3id']
            }]
          },
          criteria: {
            criterion1id: {
              title: 'favorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [-Infinity, Infinity],
              inputMetaData: {
                inputType: 'effect',
                dataType: 'other'
              }
            },
            criterion2id: {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              scale: [-Infinity, Infinity],
              inputMetaData: {
                inputType: 'distribution',
                inputMethod: 'manualDistribution'
              }
            },
            criterion3id: {
              title: 'dichotomousDecimalSampleSize',
              scale: [0, 1],
              inputMetaData: {
                inputType: 'effect',
                dataType: 'dichotomous'
              }
            }
          },
          alternatives: {
            alternative1: {
              title: 'alternative1'
            },
            alternative2: {
              title: 'alternative2'
            }
          },
          performanceTable: [{
            alternative: 'alternative1',
            criterion: 'criterion1id',
            performance: {
              type: 'exact',
              value: 10,
              input: undefined
            }
          }, {
            alternative: 'alternative2',
            criterion: 'criterion1id',
            performance: {
              type: 'exact',
              value: 5,
              input: {
                value: 5,
                lowerBound: 3,
                upperBound: 7
              }
            }
          }, {
            alternative: 'alternative1',
            criterion: 'criterion2id',
            performance: {
              type: 'exact',
              value: 20,
              input: undefined
            }
          }, {
            alternative: 'alternative2',
            criterion: 'criterion2id',
            performance: {
              type: 'exact',
              value: 30,
              input: undefined
            }
          }, {
            alternative: 'alternative1',
            criterion: 'criterion3id',
            performance: {
              type: 'dnorm',
              parameters: {
                mu: 0.5,
                sigma: 0.11180339887498948
              },
              input: {
                mu: 0.5,
                sampleSize: 20
              }
            }
          }, {
            alternative: 'alternative2',
            criterion: 'criterion3id',
            performance: {
              type: 'exact',
              value: 0.5,
              input: {
                value: 0.5,
                sampleSize: 20
              }
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createInputFromOldWorkspace', function() {
      it('should calculate the effects table input parameters from the performanceTable of the old workspace', function() {
        var criteria = [{
          title: 'criterion 1',
          id: 'c1',
          oldId: 'crit1',
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }
        }, {
          title: 'criterion 2',
          id: 'c2',
          oldId: 'crit2',
          inputMetaData: {
            inputType: 'effect',
            dataType: 'dichotomous',
            parameterOfInterest: 'eventProbability'
          }
        }, {
          title: 'criterion 3',
          id: 'c3',
          oldId: 'crit3',
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }
        }, {
          title: 'criterion 4',
          id: 'c4',
          oldId: 'crit4',
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }
        }, {
          title: 'criterion 5',
          id: 'c5',
          oldId: 'crit5',
          inputMetaData: {
            inputType: 'Unknown'
          }
        }];
        var alternatives = [{
          title: 'alternative 1',
          id: 'a1',
          oldId: 'alt1'
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
            performanceTable: [
              {
              criterion: 'crit1',
              alternative: 'alt1',
              performance: {
                type: 'exact',
                value: 1337
              }
            }, 
            {
              criterion: 'crit2',
              alternative: 'alt1',
              performance: {
                type: 'exact',
                value: 0.5,
                input: {
                  events: 10,
                  sampleSize: 20
                }
              }
            }
            , {
              criterion: 'crit3',
              alternative: 'alt1',
              performance: {
                type: 'dgamma',
                parameters: {
                  alpha: 123,
                  beta: 23
                }
              }
            }
            // , {
            //   criterion: 'crit3',
            //   alternative: 'alt1',
            //   performance: {
            //     type: 'dt',
            //     parameters: {
            //       dof: 123,
            //       stdErr: 2.3,
            //       mu: 30
            //     }
            //   }
            // }, {
            //   criterion: 'crit4',
            //   alternative: 'alt1',
            //   performance: {
            //     type: 'dnorm',
            //     parameters: {
            //       sigma: 1.2,
            //       mu: 23
            //     }
            //   }
            // }, {
            //   criterion: 'crit5',
            //   alternative: 'alt1',
            //   performance: {
            //     type: 'dsurv',
            //     parameters: {
            //       alpha: 12.001,
            //       beta: 23.001,
            //       summaryMeasure: 'mean'
            //     }
            //   }
            // }
          ]
          }
        };
        var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
        expect(result.c1.a1.inputParameters.id).toEqual('manualExact');
        expect(result.c1.a1.firstParameter).toEqual(1337);
        expect(result.c2.a1.inputParameters.id).toEqual('dichotomousFraction');
        expect(result.c2.a1.firstParameter).toEqual(10);
        expect(result.c2.a1.secondParameter).toEqual(20);
        expect(result.c3.a1.inputParameters.id).toEqual('manualGamma');
        expect(result.c3.a1.firstParameter).toEqual(123);
        expect(result.c3.a1.secondParameter).toEqual(23);
        expect(result.c4.a1.inputParameters.id).toEqual('manualNormal');
        expect(result.c4.a1.firstParameter).toEqual(23);
        expect(result.c4.a1.firstParameter).toEqual(1.2);
        expect(result.c5.a1.inputType).toEqual('Unknown');

      });
    });

    describe('copyWorkspaceCriteria', function() {
      beforeEach(function() {
        generateUuidMock.and.returnValues('uuid1', 'uuid2', 'uuid3', 'uuid4', 'uuid5', 'uuid6');
      });
      it('for schema zero should copy and update the criteria from the old workspace, preserving units and value tree', function() {
        var workspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'bla',
                source: 'single study',
                sourceLink: 'http://www.drugis.org',
                unitOfMeasurement: 'Proportion'
              },
              crit2: {
                title: 'criterion 2',
                source: 'single study',
                sourceLink: 'http://www.drugis.org',
                unitOfMeasurement: 'Response size'
              },
              crit3: {
                title: 'criterion 3',
                source: 'single study',
              },
              crit4: {
                title: 'criterion 4',
                source: 'single study',
              },
              crit5: {
                title: 'criterion 5',
                source: 'single study',
              },
              crit6: {
                title: 'durrrvival',
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              performance: {
                type: 'dt'
              }
            }, {
              criterion: 'crit2',
              performance: {
                type: 'dbeta'
              }
            }, {
              criterion: 'crit3',
              performance: {
                type: 'dgamma'
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
            }, {
              criterion: 'crit6',
              performance: {
                type: 'dsurv'
              }
            }],
            valueTree: {
              title: 'Benefit-risk balance',
              children: [{
                title: 'Favourable effects',
                criteria: ['crit1', 'crit2']
              }, {
                title: 'Unfavourable effects',
                criteria: ['crit3', 'crit4', 'crit5']
              }]
            }
          }
        };
        var result = manualInputService.copyWorkspaceCriteria(workspace);
        var expectedResult = [{
          id: 'uuid1',
          oldId: 'crit1',
          title: 'criterion 1',
          description: 'bla',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          isFavorable: true,
          unitOfMeasurement: 'Proportion',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'continuous'
        }, {
          id: 'uuid2',
          oldId: 'crit2',
          title: 'criterion 2',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          isFavorable: true,
          unitOfMeasurement: 'Response size',
          inputType: 'distribution',
          inputMethod: 'manualDistribution'
        }, {
          id: 'uuid3',
          oldId: 'crit3',
          title: 'criterion 3',
          source: 'single study',
          isFavorable: false,
          inputType: 'distribution',
          inputMethod: 'manualDistribution'
        }, {
          id: 'uuid4',
          oldId: 'crit4',
          title: 'criterion 4',
          source: 'single study',
          inputType: 'distribution',
          inputMethod: 'manualDistribution',
          isFavorable: false
        }, {
          id: 'uuid5',
          oldId: 'crit5',
          title: 'criterion 5',
          isFavorable: false,
          source: 'single study',
          inputType: 'distribution',
          inputMethod: 'manualDistribution'
        }, {
          id: 'uuid6',
          oldId: 'crit6',
          title: 'durrrvival',
          isFavorable: false,
          inputType: 'Unknown'
        }];
        expect(result).toEqual(expectedResult);
      });
      it('for schema one should copy and update the criteria from the old workspace, preserving units and value tree', function() {
        var workspace = {
          problem: {
            schemaVersion: '1.0.0',
            criteria: {
              crit1: {
                id: 'crit1',
                title: 'criterion 1',
                description: 'desc',
                source: 'well',
                sourceLink: 'zelda',
                unitOfMeasurement: 'absolute',
                strengthOfEvidence: '9001',
                uncertainties: 'dunno',
                omitThis: 'yech',
                scales: [0, 1],
                pvf: {
                  direction: 'decreasing',
                  type: 'linear',
                  range: [0.0, 1.0]
                },
                inputType: 'distribution',
                inputMethod: 'assistedDistribution',
                dataType: 'dichotomous'
              },
              crit2: {
                id: 'crit2',
                title: 'criterion 2',
                inputType: 'effect',
                dataType: 'continuous',
                parameterOfInterest: 'mean'
              }
            },
            performanceTable: [],
            valueTree: {
              title: 'Benefit-risk balance',
              children: [{
                title: 'Favourable effects',
                criteria: ['crit1']
              }, {
                title: 'Unfavourable effects',
                criteria: ['crit2']
              }]
            }
          }
        };
        var result = manualInputService.copyWorkspaceCriteria(workspace);
        var expectedResult = [{
          id: 'uuid1',
          oldId: 'crit1',
          title: 'criterion 1',
          description: 'desc',
          source: 'well',
          isFavorable: true,
          sourceLink: 'zelda',
          unitOfMeasurement: 'absolute',
          strengthOfEvidence: '9001',
          uncertainties: 'dunno',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'dichotomous'
        }, {
          id: 'uuid2',
          oldId: 'crit2',
          title: 'criterion 2',
          inputType: 'effect',
          dataType: 'continuous',
          isFavorable: false,
          parameterOfInterest: 'mean'
        }];
        expect(result).toEqual(expectedResult);
      });
    });
    describe('getOptions', function() {
      var cell = {};
      describe('for distributions', function() {
        beforeEach(function() {
          cell.inputType = 'distribution';
        });
        describe('for assisted distributions', function() {
          beforeEach(function() {
            cell.inputMethod = 'assistedDistribution';
          });
          describe('for dichotomous distributions', function() {
            beforeEach(function() {
              cell.dataType = 'dichotomous';
            });
            it('should return the correct options', function() {
              expect(_.keys(manualInputService.getOptions(cell))).toEqual(['assistedDichotomous']);
            });
          });
          describe('for continuous distributions', function() {
            beforeEach(function() {
              cell.dataType = 'continuous';
            });
            it('should return the correct options', function() {
              expect(_.keys(manualInputService.getOptions(cell))).toEqual(['assistedContinuousStdErr', 'assistedContinuousStdDev']);
            });
          });
        });
        describe('for manual distributions', function() {
          beforeEach(function() {
            cell.inputMethod = 'manualDistribution';
          });
          it('should return the manual distribution options', function() {
            expect(_.keys(manualInputService.getOptions(cell))).toEqual([
              'manualBeta',
              'manualNormal',
              'manualGamma',
              'manualExact'
            ]);
          });
        });
      });
      describe('for effects', function() {
        beforeEach(function() {
          cell.inputType = 'effect';
        });
        describe('that are dichotomous', function() {
          beforeEach(function() {
            cell.dataType = 'dichotomous';
          });
          it('should return the correct options', function() {
            expect(_.keys(manualInputService.getOptions(cell))).toEqual([
              'dichotomousDecimal',
              'dichotomousDecimalSampleSize',
              'dichotomousPercentage',
              'dichotomousPercentageSampleSize',
              'dichotomousFraction'
            ]);
          });
        });
        describe('that are continuous', function() {
          beforeEach(function() {
            cell.dataType = 'continuous';
          });
          describe('and have parameter of interest mean', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'mean';
            });
            it('should return the correct options', function() {
              expect(_.keys(manualInputService.getOptions(cell))).toEqual([
                'continuousMeanNoDispersion',
                'continuousMeanStdErr',
                'continuousMeanConfidenceInterval'
              ]);
            });
          });
          describe('and have parameter of interest median', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'median';
            });
            it('should return the correct options', function() {
              expect(_.keys(manualInputService.getOptions(cell))).toEqual([
                'continuousMedianNoDispersion',
                'continuousMedianConfidenceInterval'
              ]);
            });
          });
          describe('and have parameter of interest cumulativeProbability', function() {
            beforeEach(function() {
              cell.parameterOfInterest = 'cumulativeProbability';
            });
            it('should return the correct options', function() {
              expect(_.keys(manualInputService.getOptions(cell))).toEqual([
                'cumulativeProbabilityValue',
                'cumulativeProbabilityValueCI'
              ]);
            });
          });
        });
        describe('in other cases', function() {
          beforeEach(function() {
            cell.dataType = 'other';
          });
          it('should return the correct options', function() {
            expect(_.keys(manualInputService.getOptions(cell))).toEqual([
              'value',
              'valueSE',
              'valueCI'
            ]);
          });
        });
      });
    });
  });
});
