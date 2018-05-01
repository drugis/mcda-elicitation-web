'use strict';
define(['angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(angular) {

  var generateUuidMock = jasmine.createSpy('generateUuid');
  var manualInputService;
  var inputKnowledgeServiceMock = jasmine.createSpyObj('InputKnowledgeService', ['getKnowledge', 'inputToString',
    'finishInputCell', 'buildPerformance']);
  describe('The manualInputService', function() {
    beforeEach(module('elicit.manualInput', function($provide) {

      $provide.value('generateUuid', generateUuidMock);
      $provide.value('InputKnowledgeService', inputKnowledgeServiceMock);
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
    describe('inputToString', function() {
      it('should use the inputknowledgeservice for valid inputs', function() {
        inputKnowledgeServiceMock.inputToString.and.returnValue('great success');
        expect(manualInputService.inputToString({})).toEqual('great success');
      });
      it('should return an invalid input message if the input is invalid', function() {
        var invalidInput = {
          firstParameter: 10,
          inputParameters: {
            firstParameter: {
              constraints: [
                function() {
                  return 'error in input';
                }
              ]
            }
          }
        };
        expect(manualInputService.inputToString(invalidInput)).toEqual('Missing or invalid input');
      });
    });

    describe('prepareInputData', function() {
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
        inputMetaData: {
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'other'
        }
      }, {
        id: 'crit2id',
        inputMetaData: {
          title: 'criterion 2 title',
          inputType: 'effect',
          dataType: 'other'
        }
      }];
      it('should prepare the cells of the table for input', function() {
        var result = manualInputService.prepareInputData(criteria, treatments);
        var expectedResult = {
          'crit1id': {
            alternative1: _.extend({}, criteria[0].inputMetaData, {
              isInvalid: true
            }),
            alternative2: _.extend({}, criteria[0].inputMetaData, {
              isInvalid: true
            })
          },
          'crit2id': {
            alternative1: _.extend({}, criteria[1].inputMetaData, {
              isInvalid: true
            }),
            alternative2: _.extend({}, criteria[1].inputMetaData, {
              isInvalid: true
            })
          }
        };
        expect(result).toEqual(expectedResult);
      });
      it('should preserve data if there is old data supplied and the criterion type has not changed', function() {
        var oldInputData = {
          'crit2id': {
            alternative1: {
              title: 'criterion 2 oldtitle',
              inputType: 'distribution',
              inputMethod: 'manualDistribution'
            },
            alternative2: criteria[1].inputMetaData
          }
        };
        var result = manualInputService.prepareInputData(criteria, treatments, oldInputData);

        var expectedResult = {
          'crit1id': {
            alternative1: _.extend({}, criteria[0].inputMetaData, {
              isInvalid: true
            }),
            alternative2: _.extend({}, criteria[0].inputMetaData, {
              isInvalid: true
            })
          },
          'crit2id': {
            alternative1: _.extend({}, oldInputData['crit2id']['alternative1'], {
              isInvalid: true
            }),
            alternative2: _.extend({}, criteria[1].inputMetaData, {
              isInvalid: true
            })
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
      }];
      it('should create a problem, ready to go to the workspace', function() {
        inputKnowledgeServiceMock.buildPerformance.and.returnValue({});
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
            }
          },
          performanceTable: [{
            alternative: 'alternative1',
            criterion: 'criterion1id',
            performance: {}
          }, {
            alternative: 'alternative1',
            criterion: 'criterion2id',
            performance: {}
          }, {
            alternative: 'alternative1',
            criterion: 'criterion3id',
            performance: {}
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createInputFromOldWorkspace', function() {
      var criterion;
      var criteria;
      var alternatives = [{
        id: 'alt',
        oldId: 'oldAlt'
      }];
      var tableEntry;
      var oldWorkspace = {
        problem: {}
      };
      beforeEach(function() {
        criterion = {
          id: 'crit',
          oldId: 'oldCrit',
          inputMetaData: {}
        };
        criteria = [criterion];
        tableEntry = {
          criterion: 'oldCrit',
          alternative: 'oldAlt'
        }
        oldWorkspace.problem.performanceTable = [tableEntry];
      });
      // describe('for effect performance data', function() {
      //   beforeEach(function() {
      //     criterion.inputMetaData.inputType = 'effect';
      //   });
      //   describe('for dichotomous data', function() {
      //     beforeEach(function() {
      //       criterion.inputMetaData.dataType = 'dichotomous';
      //     });
      //     it('should work for a decimal value', function() {
      //       tableEntry.performance = {
      //         type: 'exact',
      //         value: 0.57
      //       };
      //       var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //       expect(result.crit.alt.inputParameters.id).toEqual('dichotomousDecimal');
      //       expect(result.crit.alt.firstParameter).toEqual(0.57);
      //     });
      //     it('should work for a percentage value', function() {
      //       tableEntry.performance = {
      //         type: 'exact',
      //         value: 0.57,
      //         input: {
      //           scale: 'percentage',
      //           value: 57
      //         }
      //       };
      //       var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //       expect(result.crit.alt.inputParameters.id).toEqual('dichotomousPercentage');
      //       expect(result.crit.alt.firstParameter).toEqual(57);
      //     });
      //     describe('when not normally distributed', function() {
      //       beforeEach(function() {
      //         tableEntry.performance = {
      //           type: 'exact',
      //           value: 0.57,
      //         };
      //       });
      //       it('should work for a decimal value with sample size', function() {
      //         tableEntry.performance.input = {
      //           value: 0.57,
      //           sampleSize: 321
      //         };
      //         var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //         expect(result.crit.alt.inputParameters.id).toEqual('dichotomousDecimalSampleSize');
      //         expect(result.crit.alt.firstParameter).toEqual(0.57);
      //         expect(result.crit.alt.secondParameter).toEqual(321);
      //         expect(result.crit.alt.isNormal).toBeFalsy();
      //       });
      //       it('should work for a percentage value with sample size', function() {
      //         tableEntry.performance.input = {
      //           value: 57,
      //           sampleSize: 321,
      //           scale: 'percentage'
      //         };
      //         var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //         expect(result.crit.alt.inputParameters.id).toEqual('dichotomousPercentageSampleSize');
      //         expect(result.crit.alt.firstParameter).toEqual(57);
      //         expect(result.crit.alt.secondParameter).toEqual(321);
      //         expect(result.crit.alt.isNormal).toBeFalsy();
      //       });
      //       it('should work for a fraction', function() {
      //         tableEntry.performance.input = {
      //           events: 57,
      //           sampleSize: 100
      //         };
      //         var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //         expect(result.crit.alt.inputParameters.id).toEqual('dichotomousFraction');
      //         expect(result.crit.alt.firstParameter).toEqual(57);
      //         expect(result.crit.alt.secondParameter).toEqual(100);
      //         expect(result.crit.alt.isNormal).toBeFalsy();
      //       });
      //     });
      //     describe('when normally distributed', function() {
      //       beforeEach(function() {
      //         tableEntry.performance = {
      //           type: 'dnorm'
      //         };
      //       });
      //       it('should work for a decimal value with sample size', function() {
      //         tableEntry.performance.input = {
      //           mu: 0.57,
      //           sampleSize: 321
      //         };
      //         var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //         expect(result.crit.alt.inputParameters.id).toEqual('dichotomousDecimalSampleSize');
      //         expect(result.crit.alt.firstParameter).toEqual(0.57);
      //         expect(result.crit.alt.secondParameter).toEqual(321);
      //         expect(result.crit.alt.isNormal).toBe(true);
      //       });
      //       it('should work for a percentage value with sample size', function() {
      //         tableEntry.performance.input = {
      //           mu: 57,
      //           sampleSize: 321,
      //           scale: 'percentage'
      //         };
      //         var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //         expect(result.crit.alt.inputParameters.id).toEqual('dichotomousPercentageSampleSize');
      //         expect(result.crit.alt.firstParameter).toEqual(57);
      //         expect(result.crit.alt.secondParameter).toEqual(321);
      //         expect(result.crit.alt.isNormal).toBe(true);
      //       });
      //       it('should work for a fraction', function() {
      //         tableEntry.performance.input = {
      //           events: 57,
      //           sampleSize: 100
      //         };
      //         var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //         expect(result.crit.alt.inputParameters.id).toEqual('dichotomousFraction');
      //         expect(result.crit.alt.firstParameter).toEqual(57);
      //         expect(result.crit.alt.secondParameter).toEqual(100);
      //         expect(result.crit.alt.isNormal).toBe(true);
      //       });
      //     });
      //   });
      //   describe('for continuous data', function() {
      //     beforeEach(function() {
      //       criterion.inputMetaData.dataType = 'continuous';
      //     });
      //     describe('for parameter of interest mean', function() {
      //       beforeEach(function() {
      //         criterion.inputMetaData.parameterOfInterest = mean;
      //       });
      //       it('should work for a single value', function() {
      //         tableEntry.performance = {
      //           type: 'exact',
      //           value: 37
      //         };
      //         var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //         expect(result.crit.alt.inputParameters.id).toEqual('value');
      //         expect(result.crit.alt.firstParameter).toEqual(37);
      //       });
      //     });
      //     describe('for parameter of interest median', function() { });
      //     describe('for parameter of interest cumulative probability', function() { });
      //   });
      //   describe('for other data', function() {
      //     beforeEach(function() {
      //       criterion.inputMetaData.dataType = 'other';
      //       tableEntry.performance = {
      //         type: 'exact',
      //         value: 37
      //       };
      //     });
      //     it('should work for value', function() {
      //       var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //       expect(result.crit.alt.inputParameters.id).toEqual('value');
      //       expect(result.crit.alt.firstParameter).toEqual(37);
      //     });
      //     it('should work for value + standard error', function() {
      //       tableEntry.performance.input = {
      //         value: 37,
      //         stdErr: 4.2
      //       };
      //       var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //       expect(result.crit.alt.inputParameters.id).toEqual('valueSE');
      //       expect(result.crit.alt.firstParameter).toEqual(37);
      //       expect(result.crit.alt.secondParameter).toEqual(4.2);
      //     });
      //     it('should work for value + confidence interval', function() {
      //       tableEntry.performance.input = {
      //         value: 37,
      //         lowerBound: 4.2,
      //         upperBound: 1337
      //       };
      //       var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
      //       expect(result.crit.alt.inputParameters.id).toEqual('valueCI');
      //       expect(result.crit.alt.firstParameter).toEqual(37);
      //       expect(result.crit.alt.secondParameter).toEqual(4.2);
      //       expect(result.crit.alt.thirdParameter).toEqual(1337);
      //     });
      //   });
      // });
      xit('should calculate the effects table input parameters from the performanceTable of the old workspace', function() {
        function buildCriterion(number, metaData) {
          return {
            title: 'criterion ' + number,
            id: 'c' + number,
            oldId: 'crit' + number,
            inputMetaData: metaData
          }
        }
        var criteria = [
          buildCriterion(1, {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }),
          buildCriterion(2, {
            inputType: 'effect',
            dataType: 'dichotomous'
          }),
          buildCriterion(3, {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }),
          buildCriterion(4, {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'continuous'
          }),
          buildCriterion(5, {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }),
          buildCriterion(6, {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }),
          buildCriterion(7, {
            inputType: 'effect',
            dataType: 'dichotomous'
          }),
          buildCriterion(8, {
            inputType: 'effect',
            dataType: 'dichotomous'
          }),
          buildCriterion(9, {
            inputType: 'effect',
            dataType: 'dichotomous'
          }),
          buildCriterion(10, {
            inputType: 'effect',
            dataType: 'dichotomous'
          }),
          buildCriterion(11, {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'dichotomous'
          }),
          buildCriterion(12, {
            inputType: 'effect',
            dataType: 'other'
          }),
          buildCriterion(13, {
            inputType: 'effect',
            dataType: 'other'
          }),
          buildCriterion(14, {
            inputType: 'effect',
            dataType: 'other'
          })];

        var oldWorkspace = {
          problem: {
            performanceTable: [
              {
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
                  type: 'exact',
                  value: 0.5,
                  input: {
                    events: 10,
                    sampleSize: 20
                  }
                }
              }, {
                criterion: 'crit3',
                alternative: 'alt1',
                performance: {
                  type: 'dgamma',
                  parameters: {
                    alpha: 123,
                    beta: 23
                  }
                }
              }, {
                criterion: 'crit4',
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
                criterion: 'crit5',
                alternative: 'alt1',
                performance: {
                  type: 'dbeta',
                  parameters: {
                    alpha: 123,
                    beta: 23
                  }
                }
              }, {
                criterion: 'crit6',
                alternative: 'alt1',
                performance: {
                  type: 'dnorm',
                  parameters: {
                    mu: 123,
                    sigma: 23
                  }
                }
              }, {
                criterion: 'crit7',
                alternative: 'alt1',
                performance: {
                  type: 'dnorm',
                  input: {
                    mu: 0.57,
                    sampleSize: 321
                  },
                  parameters: {
                    mu: 0.57,
                    sigma: 23
                  }
                }
              }, , {
                criterion: 'crit9',
                alternative: 'alt1',
                performance: {
                  type: 'exact',
                  value: 0.57,
                  input: {
                    value: 57,
                    scale: 'percentage'
                  }
                }
              }, {
                criterion: 'crit10',
                alternative: 'alt1',
                performance: {
                  type: 'exact',
                  value: 0.57,
                  input: {
                    value: 57,
                    scale: 'percentage',
                    sampleSize: 321
                  }
                }
              }, {
                criterion: 'crit11',
                alternative: 'alt1',
                performance: {
                  type: 'dbeta',
                  parameters: {
                    alpha: 20,
                    beta: 10
                  }
                }
              }, {
                criterion: 'crit12',
                alternative: 'alt1',
                performance: {
                  type: 'exact',
                  value: 37
                }
              }, {
                criterion: 'crit13',
                alternative: 'alt1',
                performance: {
                  type: 'exact',
                  value: 42,
                  input: {
                    value: 42,
                    stdErr: 2.3
                  }
                }
              }, {
                criterion: 'crit14',
                alternative: 'alt1',
                performance: {
                  type: 'exact',
                  value: 1337,
                  input: {
                    value: 1337,
                    lowerBound: 37,
                    upperBound: 2048
                  }
                }
              }

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
        expect(result.c4.a1.inputParameters.id).toEqual('assistedContinuousStdErr');
        expect(result.c4.a1.firstParameter).toEqual(30);
        expect(result.c4.a1.secondParameter).toEqual(2.3);
        expect(result.c4.a1.thirdParameter).toEqual(123);
        expect(result.c5.a1.inputParameters.id).toEqual('manualBeta');
        expect(result.c5.a1.firstParameter).toEqual(123);
        expect(result.c5.a1.secondParameter).toEqual(23);
        expect(result.c6.a1.inputParameters.id).toEqual('manualNormal');
        expect(result.c6.a1.firstParameter).toEqual(123);
        expect(result.c6.a1.secondParameter).toEqual(23);
        expect(result.c7.a1.inputParameters.id).toEqual('dichotomousDecimalSampleSize');
        expect(result.c7.a1.firstParameter).toEqual(0.57);
        expect(result.c7.a1.secondParameter).toEqual(321);
        expect(result.c8.a1.inputParameters.id).toEqual('dichotomousDecimal');
        expect(result.c8.a1.firstParameter).toEqual(0.57);
        expect(result.c9.a1.inputParameters.id).toEqual('dichotomousPercentage');
        expect(result.c9.a1.firstParameter).toEqual(57);
        expect(result.c10.a1.inputParameters.id).toEqual('dichotomousPercentageSampleSize');
        expect(result.c10.a1.firstParameter).toEqual(57);
        expect(result.c10.a1.secondParameter).toEqual(321);
        expect(result.c11.a1.inputParameters.id).toEqual('assistedDichotomous');
        expect(result.c11.a1.firstParameter).toEqual(19);
        expect(result.c11.a1.secondParameter).toEqual(27);
        expect(result.c12.a1.inputParameters.id).toEqual('value');
        expect(result.c12.a1.firstParameter).toEqual(37);
        expect(result.c13.a1.inputParameters.id).toEqual('valueSE');
        expect(result.c13.a1.firstParameter).toEqual(42);
        expect(result.c13.a1.secondParameter).toEqual(2.3);
        expect(result.c14.a1.inputParameters.id).toEqual('valueCI');
        expect(result.c14.a1.firstParameter).toEqual(1337);
        expect(result.c14.a1.secondParameter).toEqual(37);
        expect(result.c14.a1.thirdParameter).toEqual(2048);
        // expect(result.c5.a1.inputType).toEqual('Unknown');

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
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'continuous'
          }
        }, {
          id: 'uuid2',
          oldId: 'crit2',
          title: 'criterion 2',
          source: 'single study',
          sourceLink: 'http://www.drugis.org',
          isFavorable: true,
          unitOfMeasurement: 'Response size',
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }
        }, {
          id: 'uuid3',
          oldId: 'crit3',
          title: 'criterion 3',
          source: 'single study',
          isFavorable: false,
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }
        }, {
          id: 'uuid4',
          oldId: 'crit4',
          title: 'criterion 4',
          source: 'single study',
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
          },
          isFavorable: false
        }, {
          id: 'uuid5',
          oldId: 'crit5',
          title: 'criterion 5',
          isFavorable: false,
          source: 'single study',
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }
        }, {
          id: 'uuid6',
          oldId: 'crit6',
          title: 'durrrvival',
          isFavorable: false,
          inputMetaData: {
            inputType: 'Unknown'
          }
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
                inputMetaData: {
                  inputType: 'distribution',
                  inputMethod: 'assistedDistribution',
                  dataType: 'dichotomous'
                }
              },
              crit2: {
                id: 'crit2',
                title: 'criterion 2',
                inputMetaData: {
                  inputType: 'effect',
                  dataType: 'continuous',
                  parameterOfInterest: 'mean'
                }
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
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'dichotomous'
          }
        }, {
          id: 'uuid2',
          oldId: 'crit2',
          title: 'criterion 2',
          inputMetaData: {
            inputType: 'effect',
            dataType: 'continuous',
            parameterOfInterest: 'mean'
          },
          isFavorable: false
        }];
        expect(result).toEqual(expectedResult);
      });
    });
    describe('getOptions', function() {
      it('should call the inputknowledgeservice', function() {
        inputKnowledgeServiceMock.getKnowledge.and.returnValue({
          getOptions: function() {
            return 'here are some options';
          }
        });
        expect(manualInputService.getOptions()).toEqual('here are some options');
      });
    });
  });
});
