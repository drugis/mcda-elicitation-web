'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(_, angular) {

  var generateUuidMock = jasmine.createSpy('generateUuid');
  var manualInputService;
  var constraintServiceMock = jasmine.createSpyObj('ConstraintService', ['percentage', 'decimal']);
  var currentSchemaVersion = '1.2.2';
  var inputKnowledgeServiceMock = jasmine.createSpyObj('InputKnowledgeService', [
    'getOptions'
  ]);

  describe('The manualInputService', function() {
    beforeEach(angular.mock.module('elicit.manualInput', function($provide) {
      $provide.value('generateUuid', generateUuidMock);
      $provide.value('currentSchemaVersion', currentSchemaVersion);
      $provide.value('InputKnowledgeService', inputKnowledgeServiceMock);
      $provide.value('ConstraintService', constraintServiceMock);
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
              constraints: [{
                validator: function() { }
              }]
            },
            secondParameter: {
              constraints: [{
                validator: function() { }
              }, {
                validator: function() { return 'error message'; }
              }]
            }
          }
        };
        var result = manualInputService.getInputError(cell);
        expect(result).toBe('error message');
      });

      it('should return no error for an empty typed cell', function() {
        var cell = {
          inputParameters: {
            id: 'empty'
          }
        };
        expect(manualInputService.getInputError(cell)).toBeFalsy();
      });

      it('should return no error for an text typed cell', function() {
        var cell = {
          inputParameters: {
            id: 'text'
          }
        };
        expect(manualInputService.getInputError(cell)).toBeFalsy();
      });

      it('should return no error for bounds that are not estimable', () => {
        var cell = {
          lowerBoundNE: true,
          upperBoundNE: true,
          firstParameter: 10,
          secondParameter: 20,
          inputParameters: {
            firstParameter: {
              label: 'Lower bound',
              constraints: [
                () => { }
              ]
            },
            secondParameter: {
              label: 'Upper bound'
            }
          }
        };
        expect(manualInputService.getInputError(cell)).toBeFalsy();
      });
    });
    describe('inputToString', function() {
      it('should call the toString function on the cell', function() {
        var cell = {
          inputParameters: {
            toString: function() {
              return 'great success';
            }
          }
        };
        expect(manualInputService.inputToString(cell)).toEqual('great success');
      });

      it('should return an invalid input message if the input is invalid', function() {
        var invalidInput = {
          firstParameter: 10,
          inputParameters: {
            firstParameter: {
              constraints: [{
                validator: function() {
                  return 'error in input';
                }
              }]
            }
          }
        };
        expect(manualInputService.inputToString(invalidInput)).toEqual('Missing or invalid input');
      });
    });

    describe('prepareInputData', function() {
      var alternatives = [{
        title: 'alternative1',
        id: 'alternative1'
      }, {
        title: 'alternative2',
        id: 'alternative2'
      }];
      var criteria = [{
        id: 'crit1id',
        title: 'criterion 1 title',
        dataSources: [{
          id: 'ds1id'
        }]
      }, {
        id: 'crit2id',
        title: 'criterion 2 title',
        dataSources: [{
          id: 'ds2id'
        }]
      }];

      it('should prepare the cells of the table for input', function() {
        var result = manualInputService.prepareInputData(criteria, alternatives);
        var expectedResult = {
          'effect': {
            'ds1id': {
              alternative1: {
                isInvalid: true
              },
              alternative2: {
                isInvalid: true
              }
            },
            'ds2id': {
              alternative1: {
                isInvalid: true
              },
              alternative2: {
                isInvalid: true
              }
            }
          },
          'distribution': {
            'ds1id': {
              alternative1: {
                isInvalid: true
              },
              alternative2: {
                isInvalid: true
              }
            },
            'ds2id': {
              alternative1: {
                isInvalid: true
              },
              alternative2: {
                isInvalid: true
              }
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should preserve data if there is old data supplied and the criterion type has not changed', function() {
        var oldInputData = {
          'effect': {
            'ds2id': {
              alternative1: {
                firstParameter: 1
              },
              alternative2: {}
            }
          },
          'distribution': {
            'ds2id': {
              alternative1: {
                firstParameter: 2
              },
              alternative2: {}
            }
          }
        };
        var result = manualInputService.prepareInputData(criteria, alternatives, oldInputData);

        var expectedResult = {
          'effect': {
            'ds1id': {
              alternative1: {
                isInvalid: true
              },
              alternative2: {
                isInvalid: true
              }
            },
            'ds2id': {
              alternative1: _.extend({}, oldInputData.effect.ds2id.alternative1, {
                isInvalid: true
              }),
              alternative2: {
                isInvalid: true
              }
            }
          },
          'distribution': {
            'ds1id': {
              alternative1: {
                isInvalid: true
              },
              alternative2: {
                isInvalid: true
              }
            },
            'ds2id': {
              alternative1: _.extend({}, oldInputData.distribution.ds2id.alternative1, {
                isInvalid: true
              }),
              alternative2: {
                isInvalid: true
              }
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createProblem', function() {
      var title = 'title';
      var description = 'A random description of a random problem';
      var alternatives = [{
        title: 'alternative1',
        id: 'alternative1',
        oldId: 'alternative1Oldid'
      }];

      it('should create a problem, ready to go to the workspace, removing old ids', function() {
        var criteria = [{
          title: 'favorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: true,
          id: 'criterion1id',
          oldid: 'criterion1oldId',
          scale: [0, 1],
          omitThis: 'yech',
          dataSources: [{
            id: 'ds1id',
            oldId: 'ds1oldId',
          }]
        }, {
          title: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          id: 'criterion2id',
          dataSources: [{
            id: 'ds2id',
          }]
        }, {
          title: 'dichotomousDecimalSampleSize',
          id: 'criterion3id',
          isFavorable: false,
          dataSources: [{
            id: 'ds3id',
          }]
        }];
        var inputData = {
          effect: {
            ds1id: {
              alternative1: {
                firstParameter: 10,
                inputParameters: {
                  id: 'value',
                  buildPerformance: function() {
                    return {};
                  }
                }
              }
            },
            ds2id: {
              alternative1: {
                firstParameter: 20,
                inputParameters: {
                  id: 'value',
                  buildPerformance: function() {
                    return {};
                  }
                }
              }
            },
            ds3id: {
              alternative1: {
                firstParameter: 0.5,
                secondParameter: 20,
                inputParameters: {
                  id: 'valueSampleSize',
                  buildPerformance: function() {
                    return {};
                  }
                }
              }
            }
          },
          distribution: {
            ds1id: {
              alternative1: {
                firstParameter: 10,
                secondParameter: 20,
                inputParameters: {
                  id: 'normal',
                  buildPerformance: function() {
                    return {};
                  }
                }
              }
            },
            ds2id: {
              alternative1: {
                firstParameter: 20,
                secondParameter: 20,
                inputParameters: {
                  id: 'beta',
                  buildPerformance: function() {
                    return {};
                  }
                }
              }
            },
            ds3id: {
              alternative1: {
                firstParameter: 0.5,
                secondParameter: 20,
                inputParameters: {
                  id: 'gamma',
                  buildPerformance: function() {
                    return {};
                  }
                }
              }
            }
          }
        };
        var useFavorability = true;
        var result = manualInputService.createProblem(criteria, alternatives, title, description, inputData, useFavorability);
        var expectedResult = {
          title: title,
          schemaVersion: '1.2.2',
          description: description,
          criteria: {
            criterion1id: {
              title: 'favorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              isFavorable: true,
              dataSources: [{
                id: 'ds1id',
                scale: [-Infinity, Infinity],
              }]
            },
            criterion2id: {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              isFavorable: false,
              dataSources: [{
                id: 'ds2id',
                scale: [-Infinity, Infinity],
              }]
            },
            criterion3id: {
              title: 'dichotomousDecimalSampleSize',
              isFavorable: false,
              dataSources: [{
                id: 'ds3id',
                scale: [-Infinity, Infinity],
              }]
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
            dataSource: 'ds1id',
            performance: {
              effect: {},
              distribution: {}
            }
          }, {
            alternative: 'alternative1',
            criterion: 'criterion2id',
            dataSource: 'ds2id',
            performance: {
              effect: {},
              distribution: {}
            }
          }, {
            alternative: 'alternative1',
            criterion: 'criterion3id',
            dataSource: 'ds3id',
            performance: {
              effect: {},
              distribution: {}
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createStateFromOldWorkspace', function() {
      var baseWorkspace;
      var baseExpectedResult;

      var option = {
        finishInputCell: jasmine.createSpy()
      };

      beforeEach(function() {
        option.finishInputCell.calls.reset();

        inputKnowledgeServiceMock.getOptions.and.returnValue({
          value: option,
          valueSE: option,
          valueCI: option,
          eventsSampleSize: option,
          valueSampleSize: option,
          empty: option,
          normal: option,
          gamma: option,
          beta: option,
          text: option
        });
        generateUuidMock.and.returnValues('uuid1', 'uuid2', 'uuid3', 'uuid4', 'uuid5', 'uuid6',
          'uuid7', 'uuid8', 'uuid9', 'uuid10', 'uuid11', 'uuid12', 'uuid13', 'uuid14', 'uuid15');
        baseWorkspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'bla',
                unitOfMeasurement: '%',
                isFavorable: true,
                dataSources: [{
                  id: 'ds1',
                  scale: [0, 1],
                  source: 'single study',
                  sourceLink: 'http://www.drugis.org'
                }]
              }
            },
            alternatives: {
              alt1: {
                title: 'alternative 1'
              }
            }
          }
        };
        baseExpectedResult = {
          useFavorability: true,
          step: 'step1',
          isInputDataValid: false,
          description: undefined,
          criteria: [{
            title: 'criterion 1',
            description: 'bla',
            isFavorable: true,
            dataSources: [{
              id: 'uuid1',
              oldId: 'ds1',
              source: 'single study',
              sourceLink: 'http://www.drugis.org'
            }],
            id: 'uuid2'
          }],
          alternatives: [{
            title: 'alternative 1',
            id: 'uuid3',
            oldId: 'alt1'
          }],
          inputData: {
            effect: {
              uuid1: {
                uuid3: undefined
              }
            },
            distribution: {
              uuid1: {
                uuid3: undefined
              }
            }
          }
        };
      });

      describe('for an old workspace with a distribution', function() {
        it('should create a state with an empty distribution cell', function() {
          var workspace = _.merge({}, baseWorkspace, {
            problem: {
              performanceTable: [{
                criterion: 'crit1',
                dataSource: 'ds1',
                alternative: 'alt1',
                performance: {
                  distribution: {
                    type: 'empty'
                  }
                }
              }]
            }
          });

          var result = manualInputService.createStateFromOldWorkspace(workspace);
          var expectedResult = _.merge({}, baseExpectedResult, {
            oldWorkspace: workspace
          });
          expect(result).toEqual(expectedResult);
          expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('distribution');
          expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.distribution);
        });

        it('should create a state with a beta distribution cell', function() {
          var workspace = _.merge({}, baseWorkspace, {
            problem: {
              performanceTable: [{
                criterion: 'crit1',
                dataSource: 'ds1',
                alternative: 'alt1',
                performance: {
                  distribution: {
                    type: 'dbeta'
                  }
                }
              }]
            }
          });

          var result = manualInputService.createStateFromOldWorkspace(workspace);
          var expectedResult = _.merge({}, baseExpectedResult, {
            oldWorkspace: workspace
          });
          expect(result).toEqual(expectedResult);
          expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('distribution');
          expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.distribution);
        });

        it('should create a state with a gamma distribution cell', function() {
          var workspace = _.merge({}, baseWorkspace, {
            problem: {
              performanceTable: [{
                criterion: 'crit1',
                dataSource: 'ds1',
                alternative: 'alt1',
                performance: {
                  distribution: {
                    type: 'dgamma'
                  }
                }
              }]
            }
          });

          var result = manualInputService.createStateFromOldWorkspace(workspace);
          var expectedResult = _.merge({}, baseExpectedResult, {
            oldWorkspace: workspace
          });
          expect(result).toEqual(expectedResult);
          expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('distribution');
          expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.distribution);
        });

        it('should create a state with a normal distribution cell', function() {
          var workspace = _.merge({}, baseWorkspace, {
            problem: {
              performanceTable: [{
                criterion: 'crit1',
                dataSource: 'ds1',
                alternative: 'alt1',
                performance: {
                  distribution: {
                    type: 'dnorm'
                  }
                }
              }]
            }
          });

          var result = manualInputService.createStateFromOldWorkspace(workspace);
          var expectedResult = _.merge({}, baseExpectedResult, {
            oldWorkspace: workspace
          });
          expect(result).toEqual(expectedResult);
          expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('distribution');
          expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.distribution);
        });

        it('should create a state with an exact distribution cell', function() {
          var workspace = _.merge({}, baseWorkspace, {
            problem: {
              performanceTable: [{
                criterion: 'crit1',
                dataSource: 'ds1',
                alternative: 'alt1',
                performance: {
                  distribution: {
                    type: 'exact'
                  }
                }
              }]
            }
          });

          var result = manualInputService.createStateFromOldWorkspace(workspace);
          var expectedResult = _.merge({}, baseExpectedResult, {
            oldWorkspace: workspace
          });
          expect(result).toEqual(expectedResult);
          expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('distribution');
          expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.distribution);
        });

        it('should create a state with a survival distribution cell', function() {
          var workspace = _.merge({}, baseWorkspace, {
            problem: {
              performanceTable: [{
                criterion: 'crit1',
                dataSource: 'ds1',
                alternative: 'alt1',
                performance: {
                  distribution: {
                    type: 'dsurv'
                  }
                }
              }]
            }
          });

          var result = manualInputService.createStateFromOldWorkspace(workspace);
          var expectedResult = _.merge({}, baseExpectedResult, {
            oldWorkspace: workspace
          });
          expect(result).toEqual(expectedResult);
          expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('distribution');
          expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.distribution);
        });

        it('should create a state with a text distribution cell', function() {
          var workspace = _.merge({}, baseWorkspace, {
            problem: {
              performanceTable: [{
                criterion: 'crit1',
                dataSource: 'ds1',
                alternative: 'alt1',
                performance: {
                  distribution: {
                    type: 'empty',
                    value: 'text'
                  }
                }
              }]
            }
          });

          var result = manualInputService.createStateFromOldWorkspace(workspace);
          var expectedResult = _.merge({}, baseExpectedResult, {
            oldWorkspace: workspace
          });
          expect(result).toEqual(expectedResult);
          expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.distribution);
          expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('distribution');
        });
      });

      describe('for an old workspace with an effect', function() {
        describe('with input', function() {
          it('should create a new state with a value SE cell', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact',
                      input: {
                        stdErr: 0.5
                      }
                    }
                  }
                }]
              }
            });

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
            expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('effect');
            expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.effect);
          });

          it('should create a new state with a value CI cell', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact',
                      input: {
                        lowerBound: 0.5,
                        upperBound: 'NE'
                      }
                    }
                  }
                }]
              }
            });

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
            expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('effect');
            expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.effect);
          });

          it('should create a new state with a value sample size cell', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact',
                      input: {
                        sampleSize: 200
                      }
                    }
                  }
                }]
              }
            });

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
            expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('effect');
            expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.effect);
          });

          it('should create a new state with an events sample size cell', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact',
                      input: {
                        events: 200,
                        sampleSize: 3000
                      }
                    }
                  }
                }]
              }
            });

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
            expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('effect');
            expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.effect);
          });
        });

        describe('without input', function() {
          it('should create a new state with a value effect cell', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact'
                    }
                  }
                }]
              }
            });

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);            
            expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('effect');
            expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.effect);
          });

          it('should create a new state with an empty effect cell', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'empty'
                    }
                  }
                }]
              }
            });

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
            expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('effect');
            expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.effect);
          });

          it('should create a new state with a text effect cell', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'empty',
                      value: 'text'
                    }
                  }
                }]
              }
            });

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
            expect(inputKnowledgeServiceMock.getOptions).toHaveBeenCalledWith('effect');
            expect(option.finishInputCell).toHaveBeenCalledWith(workspace.problem.performanceTable[0].performance.effect);
          });
        });
      });
    });

    describe('getOptions', function() {
      it('should call the inputknowledgeservice', function() {
        inputKnowledgeServiceMock.getOptions.and.returnValue('here are some options');
        expect(manualInputService.getOptions()).toEqual('here are some options');
      });
    });

    describe('findInvalidCell', () => {
      it('should return truthy if there is atleast one cell that is marked invalid', () => {
        var inputData = {
          row1: {
            col1: {
              isInvalid: true
            },
            col2: {
              isInvalid: false
            }
          }
        };
        var result = manualInputService.findInvalidCell(inputData);
        expect(result).toBeTruthy();
      });

      it('should return falsy if there is not celel marked invalid', () => {
        var inputData = {
          row1: {
            col1: {
            },
            col2: {
            }
          },
          row2: {
            col1: {
              isInvalid: false
            }
          }
        };
        var result = manualInputService.findInvalidCell(inputData);
        expect(result).toBeFalsy();

      });
    });

    describe('findDuplicateValues', () => {
      it('should return truthy if there is an invalid row i.e. all inputs have the same effect value', () => {
        var inputData = {
          row1: {
            col1: {
              inputType: 'effect',
              firstParameter: 50,
              inputParameters: {
                id: 'value'
              }
            },
            col2: {
              inputType: 'effect',
              firstParameter: 50,
              inputParameters: {
                id: 'value'
              }
            },
            col3: {
              inputType: 'effect',
              firstParameter: 50,
              inputParameters: {
                id: 'value'
              }
            }
          }
        };
        var result = manualInputService.findDuplicateValues(inputData);
        expect(result).toBeTruthy();
      });

      it('should return falsy if atleast one cell has a different value', () => {
        var inputData = {
          row1: {
            col1: {
              inputType: 'distribution',
              firstParameter: 50,
              inputParameters: {
                id: 'value'
              }
            },
            col2: {
              inputType: 'effect',
              firstParameter: 50,
              inputParameters: {
                id: 'value'
              }
            },
            col3: {
              inputType: 'effect',
              firstParameter: 51,
              inputParameters: {
                id: 'value'
              }
            }
          }
        };
        var result = manualInputService.findDuplicateValues(inputData);
        expect(result).toBeFalsy();
      });

      it('should return falsy if there are not values in the row', function() {
        var inputData = {
          row1: {
            col1: {
              isInvalid: true
            },
            col2: {
              isInvalid: true
            }
          }
        };
        var result = manualInputService.findDuplicateValues(inputData);
        expect(result).toBeFalsy();
      });

      it('should return falsy if there are duplcate text cells in the row', function() {
        var inputData = {
          row1: {
            col1: {
              firstParameter: 1,
              inputParameters: {
                id: 'text'
              }
            },
            col2: {
              firstParameter: 1,
              inputParameters: {
                id: 'text'
              }
            }
          }
        };
        var result = manualInputService.findDuplicateValues(inputData);
        expect(result).toBeFalsy();
      });
    });

    describe('generateDistributions', function() {
      it('should generate a distribution from effect data', function() {
        var inputData = {
          effect: {
            d1: {
              a1: {
                inputParameters: {
                  generateDistribution: jasmine.createSpy()
                }
              }
            }
          }
        };
        manualInputService.generateDistributions(inputData);

        expect(inputData.effect.d1.a1.inputParameters.generateDistribution).toHaveBeenCalledWith(inputData.effect.d1.a1);
      });

      it('should leave distribution data intact if the effect data is invalid or missing', function() {
        var inputData = {
          effect: {
            d1: {
              a1: {
                isInvalid: true
              }
            }
          },
          distribution: {
            d1: {
              a1: {
                label: 'test'
              }
            }
          }
        };
        var result = manualInputService.generateDistributions(inputData);

        expect(result).toEqual(inputData.distribution);
      });

      it('should overwrite existing distribution data', function() {
        var inputData = {
          effect: {
            d1: {
              a1: {
                inputParameters: {
                  generateDistribution: jasmine.createSpy()
                }
              }
            }
          },
          distribution: {
            d1: {
              a1: {
                label: 'test'
              }
            }
          }
        };
        inputData.effect.d1.a1.inputParameters.generateDistribution.and.returnValue(inputData.effect.d1.a1);
        var result = manualInputService.generateDistributions(inputData);

        expect(result).toEqual(inputData.effect);
      });
    });

    describe('updateConstraints', function() {
      var percentageConstraint = {
        label: 'Proportion (percentage)'
      };
      var decimalConstraint = {
        label: 'Proportion (decimal)'
      };
      beforeEach(function() {
        constraintServiceMock.percentage.and.returnValue(percentageConstraint);
        constraintServiceMock.decimal.and.returnValue(decimalConstraint);
      });

      it('should remove the percentage and/or decimal constraints', function() {
        var cellConstraint = 'None';
        var constraints = [decimalConstraint, percentageConstraint];
        var result = manualInputService.updateConstraints(cellConstraint, constraints);
        expect(result).toEqual([]);
      });

      it('should add the percentage constraint if percentage is chosen', function() {
        var cellConstraint = percentageConstraint.label;
        var constraints = [];
        var result = manualInputService.updateConstraints(cellConstraint, constraints);
        var expectedResult = [{
          label: 'Proportion (percentage)'
        }];
        expect(result).toEqual(expectedResult);
      });

      it('should add the decimal constraint if decimal is chosen', function() {
        var cellConstraint = decimalConstraint.label;
        var constraints = [];
        var result = manualInputService.updateConstraints(cellConstraint, constraints);
        var expectedResult = [{
          label: 'Proportion (decimal)'
        }];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
