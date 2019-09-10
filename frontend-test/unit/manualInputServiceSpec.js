'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(_, angular) {
  var generateUuidMock = jasmine.createSpy('generateUuid');
  var manualInputService;
  var constraintServiceMock = jasmine.createSpyObj('ConstraintService', ['percentage', 'decimal', 'belowOrEqualTo', 'positive']);
  var currentSchemaVersion = '1.2.2';
  var inputKnowledgeServiceMock = jasmine.createSpyObj('InputKnowledgeService', [
    'getOptions'
  ]);
  var percentageConstraint = {
    label: 'Proportion (percentage)'
  };
  var decimalConstraint = {
    label: 'Proportion (decimal)'
  };
  var belowOrEqualToConstraint = {
    label: 'belowOrEqualTo'
  };
  var positiveConstraint = {
    label: 'positive'
  };
  constraintServiceMock.percentage.and.returnValue(percentageConstraint);
  constraintServiceMock.decimal.and.returnValue(decimalConstraint);
  constraintServiceMock.belowOrEqualTo.and.returnValue(belowOrEqualToConstraint);
  constraintServiceMock.positive.and.returnValue(positiveConstraint);

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

      it('should return no error for bounds that are not estimable', function() {
        var cell = {
          lowerBoundNE: true,
          upperBoundNE: true,
          firstParameter: 10,
          secondParameter: 20,
          inputParameters: {
            firstParameter: {
              label: 'Lower bound',
              constraints: [
                function() { }
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
      const defaultCell = {
        isInvalid: true,
        inputParameters: {
          id: 'value'
        }
      };

      it('should prepare the cells of the table for input', function() {
        var result = manualInputService.prepareInputData(criteria, alternatives);
        var expectedResult = {
          'effect': {
            'ds1id': {
              alternative1: defaultCell,
              alternative2: defaultCell
            },
            'ds2id': {
              alternative1: defaultCell,
              alternative2: defaultCell
            }
          },
          'distribution': {
            'ds1id': {
              alternative1: defaultCell,
              alternative2: defaultCell
            },
            'ds2id': {
              alternative1: defaultCell,
              alternative2: defaultCell
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should preserve data if there is old data supplied and the criterion type has not changed', function() {
        var oldInputData = {
          effect: {
            ds2id: {
              alternative1: {
                firstParameter: 1,
                inputParameters: {}
              },
              alternative2: {
                inputParameters: {}
              }
            }
          },
          distribution: {
            ds2id: {
              alternative1: {
                firstParameter: 2
              },
              alternative2: {}
            }
          }
        };
        var result = manualInputService.prepareInputData(criteria, alternatives, oldInputData);

        var expectedResult = {
          effect: {
            ds1id: {
              alternative1: defaultCell,
              alternative2: defaultCell
            },
            ds2id: {
              alternative1: _.extend({}, oldInputData.effect.ds2id.alternative1, {
                isInvalid: true,
                inputParameters: {}
              }),
              alternative2: {
                isInvalid: true,
                inputParameters: {}
              }
            }
          },
          distribution: {
            ds1id: {
              alternative1: defaultCell,
              alternative2: defaultCell
            },
            ds2id: {
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
      var criteria = [{
        title: 'favorable criterion',
        description: 'some crit description',
        isFavorable: true,
        id: 'criterion1id',
        oldid: 'criterion1oldId',
        scale: [0, 1],
        omitThis: 'yech',
        dataSources: [{
          unitOfMeasurement: {
            value: 'particles',
            lowerBound: -Infinity,
            upperBound: Infinity,
            selectedOption: {
              type: 'custom'
            }
          },
          id: 'ds1id',
          oldId: 'ds1oldId'
        }]
      }, {
        title: 'unfavorable criterion',
        description: 'some crit description',
        isFavorable: false,
        id: 'criterion2id',
        dataSources: [{
          unitOfMeasurement: {
            value: '%',
            lowerBound: 0,
            upperBound: 100,
            selectedOption: {
              type: 'percentage'
            }
          },
          id: 'ds2id'
        }]
      }, {
        title: 'dichotomousDecimalSampleSize',
        id: 'criterion3id',
        isFavorable: false,
        dataSources: [{
          unitOfMeasurement: {
            lowerBound: -Infinity,
            upperBound: Infinity,
            value: '',
            selectedOption: {
              type: 'custom'
            }
          },
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
      var expectedResult; 

      beforeEach(function(){
        expectedResult = {
          title: title,
          schemaVersion: '1.2.2',
          description: description,
          criteria: {
            criterion1id: {
              title: 'favorable criterion',
              description: 'some crit description',
              dataSources: [{
                id: 'ds1id',
                unitOfMeasurement: {
                  label: 'particles',
                  type: 'custom'
                },
                scale: [-Infinity, Infinity],
              }]
            },
            criterion2id: {
              title: 'unfavorable criterion',
              description: 'some crit description',
              dataSources: [{
                id: 'ds2id',
                unitOfMeasurement: {
                  label: '%',
                  type: 'percentage'
                },
                scale: [0, 100],
              }]
            },
            criterion3id: {
              title: 'dichotomousDecimalSampleSize',
              dataSources: [{
                id: 'ds3id',
                unitOfMeasurement: {
                  label: '',
                  type: 'custom'
                },
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
      });

      it('should create a problem, ready to go to the workspace, removing old ids', function() {
        expectedResult.criteria.criterion1id.isFavorable = true;
        expectedResult.criteria.criterion2id.isFavorable = false;
        expectedResult.criteria.criterion3id.isFavorable = false;
        var useFavorability = true;

        var result = manualInputService.createProblem(criteria, alternatives, title, description, inputData, useFavorability);

        expect(result).toEqual(expectedResult);
      });

      it('should not put favorability on problems for which the state does not use it', function(){
        var useFavorability = false;

        var result = manualInputService.createProblem(criteria, alternatives, title, description, inputData, useFavorability);

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
                isFavorable: true,
                dataSources: [{
                  id: 'ds1',
                  scale: [0, 1],
                  source: 'single study',
                  sourceLink: 'http://www.drugis.org',
                  unitOfMeasurement: {
                    label: 'label',
                    type: 'custom'
                  }
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
              sourceLink: 'http://www.drugis.org',
              unitOfMeasurement: {
                value: 'label',
                lowerBound: 0,
                upperBound: 1,
                selectedOption: {
                  type: 'custom'
                }
              },
              scale: [0, 1]
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

          it('should create a new state with a value cell and Proportion (decimal) unit of measurement', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                criteria: {
                  crit1: {
                    dataSources: [{
                      scale: [0, 1],
                      unitOfMeasurement: {
                        type: 'decimal',
                        label: 'Proportion'
                      }
                    }]
                  }
                },
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact',
                      input: {
                        scale: 'decimal'
                      }
                    }
                  }
                }]
              }
            });
            baseExpectedResult.criteria[0].dataSources[0].unitOfMeasurement.selectedOption.type = 'decimal';
            baseExpectedResult.criteria[0].dataSources[0].unitOfMeasurement.value = 'Proportion';

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
          });

          it('should create a new state with a value cell and Proportion (percentage) unit of measurement', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                criteria: {
                  crit1: {
                    dataSources: [{
                      scale: [0, 100],
                      unitOfMeasurement: {
                        type: 'percentage',
                        label: '%'
                      }
                    }]
                  }
                },
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact',
                      input: {
                        scale: 'percentage'
                      }
                    }
                  }
                }]
              }
            });
            baseExpectedResult.criteria[0].dataSources[0].unitOfMeasurement.selectedOption.type = 'percentage';
            baseExpectedResult.criteria[0].dataSources[0].unitOfMeasurement.value = '%';
            baseExpectedResult.criteria[0].dataSources[0].unitOfMeasurement.upperBound = 100;
            baseExpectedResult.criteria[0].dataSources[0].scale[1] = 100;

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
          });

          it('should create a new state with a value cell and default unit of measurement and with bounds', function() {
            var workspace = _.merge({}, baseWorkspace, {
              problem: {
                criteria: {
                  crit1: {
                    dataSources: [{
                      scale: [0, Infinity]
                    }]
                  }
                },
                performanceTable: [{
                  criterion: 'crit1',
                  dataSource: 'ds1',
                  alternative: 'alt1',
                  performance: {
                    effect: {
                      type: 'exact',
                      input: {
                        scale: 'percentage'
                      }
                    }
                  }
                }]
              }
            });
            baseExpectedResult.criteria[0].dataSources[0].unitOfMeasurement.upperBound = Infinity;
            baseExpectedResult.criteria[0].dataSources[0].scale[1] = Infinity;

            var result = manualInputService.createStateFromOldWorkspace(workspace);
            var expectedResult = _.merge({}, baseExpectedResult, {
              oldWorkspace: workspace
            });
            expect(result).toEqual(expectedResult);
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

    describe('updateParameterConstraints', function() {
      it('should add percentage constraints', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: 100
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [percentageConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add decimal constraints', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: 1
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [decimalConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a positive constraint', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: Infinity
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [positiveConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a \'below or equal to\' constraint', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: -Infinity,
          upperBound: 100
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [belowOrEqualToConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });


      it('should not add a \'below or equal to\' constraint if the scale is [null, null]', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: null,
          upperBound: null
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: []
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should remove no longer applicable constraints, leaving intact other constraints', function() {
        var cell = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [
                positiveConstraint,
                belowOrEqualToConstraint,
                decimalConstraint,
                percentageConstraint, {
                  label: 'other constraint'
                }]
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: -Infinity,
          upperBound: Infinity
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            firstParameter: {
              label: 'Value',
              constraints: [{
                label: 'other constraint'
              }]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a positive constraint to the second parameter', function() {
        var cell = {
          inputParameters: {
            secondParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: Infinity
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            secondParameter: {
              label: 'Value',
              constraints: [positiveConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should add a positive constraint to the third parameter', function() {
        var cell = {
          inputParameters: {
            thirdParameter: {
              label: 'Value'
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: Infinity
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            thirdParameter: {
              label: 'Value',
              constraints: [positiveConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should not remove the lower bound constraint of the cell lower bound if there also is a decimal or percentage constraint', function() {
        var cell = {
          inputParameters: {
            secondParameter: {
              label: 'Lower bound',
              constraints: [belowOrEqualToConstraint]
            }
          }
        };
        var unitOfMeasurement = {
          lowerBound: 0,
          upperBound: 100
        };
        var result = manualInputService.updateParameterConstraints(cell, unitOfMeasurement);
        var expectedResult = {
          inputParameters: {
            secondParameter: {
              label: 'Lower bound',
              constraints: [belowOrEqualToConstraint, percentageConstraint]
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('checkStep1Errors', function() {
      it('should return an error with a missing title error', function() {
        var state = {
          criteria: [{
            dataSources: [{}]
          }, {
            dataSources: [{}]
          }],
          alternatives: [{}, {}]
        };
        var result = manualInputService.checkStep1Errors(state);
        var expectedResult = ['Missing title'];
        expect(result).toEqual(expectedResult);
      });

      it('should return an error with a not enough criteria error', function() {
        var state = {
          title: 'some title',
          criteria: [{
            dataSources: [{}]
          }],
          alternatives: [{}, {}]
        };
        var result = manualInputService.checkStep1Errors(state);
        var expectedResult = ['At least two criteria required'];
        expect(result).toEqual(expectedResult);
      });

      it('should return an error with a not enough alternatives error', function() {
        var state = {
          title: 'some title',
          criteria: [{
            dataSources: [{}]
          }, {
            dataSources: [{}]
          }],
          alternatives: [{}]
        };
        var result = manualInputService.checkStep1Errors(state);
        var expectedResult = ['At least two alternatives required'];
        expect(result).toEqual(expectedResult);
      });

      it('should return an error with a missing data source error', function() {
        var state = {
          title: 'some title',
          criteria: [{
            dataSources: [{}]
          }, {
            dataSources: []
          }],
          alternatives: [{}, {}]
        };
        var result = manualInputService.checkStep1Errors(state);
        var expectedResult = ['All criteria require at least one data source'];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
