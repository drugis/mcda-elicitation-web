'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(_) {

  var generateUuidMock = jasmine.createSpy('generateUuid');
  var manualInputService;
  var currentSchemaVersion = '1.0.0';
  var inputKnowledgeServiceMock = jasmine.createSpyObj('InputKnowledgeService', ['getOptions', 'inputToString',
    'finishInputCell', 'buildPerformance']);
  describe('The manualInputService', function() {
    beforeEach(module('elicit.manualInput', function($provide) {

      $provide.value('generateUuid', generateUuidMock);
      $provide.value('currentSchemaVersion', currentSchemaVersion);
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
                function() { return 'error message'; }
              ]
            }
          }
        };
        var result = manualInputService.getInputError(cell);
        expect(result).toBe('error message');
      });
      it('should return no error for an empty typed cell', function() {
        var cell = {
          empty: true
        };
        expect(manualInputService.getInputError(cell)).toBeFalsy();
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
          id: 'ds1id',
          inputType: 'distribution',
          inputMethod: 'assistedDistribution',
          dataType: 'other'
        }]
      }, {
        id: 'crit2id',
        title: 'criterion 2 title',
        dataSources: [{
          id: 'ds2id',
          inputType: 'effect',
          dataType: 'other'
        }]
      }];
      it('should prepare the cells of the table for input', function() {
        var result = manualInputService.prepareInputData(criteria, alternatives);
        var expectedResult = {
          'ds1id': {
            alternative1: _.extend({}, _.omit(criteria[0].dataSources[0], ['id']), {
              isInvalid: true
            }),
            alternative2: _.extend({}, _.omit(criteria[0].dataSources[0], ['id']), {
              isInvalid: true
            })
          },
          'ds2id': {
            alternative1: _.extend({}, _.omit(criteria[1].dataSources[0], ['id']), {
              isInvalid: true
            }),
            alternative2: _.extend({}, _.omit(criteria[1].dataSources[0], ['id']), {
              isInvalid: true
            })
          }
        };
        expect(result).toEqual(expectedResult);
      });
      it('should preserve data if there is old data supplied and the criterion type has not changed', function() {
        var oldInputData = {
          'ds2id': {
            alternative1: {
              inputType: 'distribution',
              inputMethod: 'manualDistribution'
            },
            alternative2: criteria[1].inputMetaData
          }
        };
        var result = manualInputService.prepareInputData(criteria, alternatives, oldInputData);

        var expectedResult = {
          'ds1id': {
            alternative1: _.extend({}, _.omit(criteria[0].dataSources[0], ['id']), {
              isInvalid: true
            }),
            alternative2: _.extend({}, _.omit(criteria[0].dataSources[0], ['id']), {
              isInvalid: true
            })
          },
          'ds2id': {
            alternative1: _.extend({}, oldInputData.ds2id.alternative1, {
              isInvalid: true
            }),
            alternative2: _.extend({}, _.omit(criteria[1].dataSources[0], ['id']), {
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
          dataSources: [{
            id: 'ds1id',
            inputType: 'effect',
            dataType: 'other'
          }]
        }, {
          title: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          id: 'criterion2id',
          dataSources: [{
            id: 'ds2id',
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }]
        }, {
          title: 'dichotomousDecimalSampleSize',
          id: 'criterion3id',
          dataSources: [{
            id: 'ds3id',
            inputType: 'effect',
            dataType: 'dichotomous'
          }]
        }];
        var inputData = {
          ds1id: {
            alternative1: {
              inputType: 'effect',
              dataType: 'other',
              firstParameter: 10,
              inputParameters: {
                id: 'valueExact'
              }
            }
          },
          ds2id: {
            alternative1: {
              inputType: 'distribution',
              inputMethod: 'manualDistribution',
              firstParameter: 20,
              inputParameters: {
                id: 'valueExact'
              }
            }
          },
          ds3id: {
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
        var useFavorability = true;
        var result = manualInputService.createProblem(criteria, treatments, title, description, inputData, useFavorability);
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
              dataSources: [{
                id: 'ds1id',
                scale: [-Infinity, Infinity],
                inputType: 'effect',
                dataType: 'other'
              }]
            },
            criterion2id: {
              title: 'unfavorable criterion',
              description: 'some crit description',
              unitOfMeasurement: 'particles',
              dataSources: [{
                id: 'ds2id',
                scale: [-Infinity, Infinity],
                inputType: 'distribution',
                inputMethod: 'manualDistribution'
              }]
            },
            criterion3id: {
              title: 'dichotomousDecimalSampleSize',
              dataSources: [{
                id: 'ds3id',
                scale: [0, 1],
                inputType: 'effect',
                dataType: 'dichotomous'
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
            performance: {}
          }, {
            alternative: 'alternative1',
            criterion: 'criterion2id',
            dataSource: 'ds2id',
            performance: {}
          }, {
            alternative: 'alternative1',
            criterion: 'criterion3id',
            dataSource: 'ds3id',
            performance: {}
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createInputFromOldWorkspace', function() {
      var criteria;
      var alternatives = [{
        id: 'alt',
        oldId: 'oldAlt'
      }];
      var oldWorkspace = {
        problem: {}
      };
      beforeEach(function() {
        criteria = [{
          id: 'crit',
          oldId: 'oldCrit',
          dataSources: [{
            id: 'ds1',
            inputType: 'effect',
            dataType: 'other'
          }]
        }];
        oldWorkspace.problem.performanceTable = [{
          criterion: 'oldCrit',
          alternative: 'oldAlt',
          performance: {
            value: 10,
            type: 'exact'
          }
        }];
      });
      it('should create input data', function() {
        inputKnowledgeServiceMock.finishInputCell.and.returnValue({
          firstParameter: 10
        });
        var result = manualInputService.createInputFromOldWorkspace(criteria, alternatives, oldWorkspace);
        var expectedResult = {
          ds1: {
            alt: {
              firstParameter: 10
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('copyWorkspaceCriteria', function() {
      beforeEach(function() {
        generateUuidMock.and.returnValues('uuid1', 'uuid2', 'uuid3', 'uuid4', 'uuid5', 'uuid6', 'uuid7', 'uuid8', 'uuid9', 'uuid10', 'uuid11', 'uuid12');
      });
      it('for schema zero should copy and update the criteria from the old workspace, preserving units and value tree', function() {
        var workspace = {
          problem: {
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'bla',
                unitOfMeasurement: 'Proportion',
                dataSources: [{
                  id: 'ds1',
                  source: 'single study',
                  sourceLink: 'http://www.drugis.org',
                  inputType: 'distribution',
                  inputMethod: 'assistedDistribution',
                  dataType: 'continuous'
                }]
              },
              crit2: {
                title: 'criterion 2',
                unitOfMeasurement: 'Response size',
                dataSources: [{
                  id: 'ds2',
                  inputType: 'distribution',
                  inputMethod: 'manualDistribution',
                  source: 'single study',
                  sourceLink: 'http://www.drugis.org'
                }]
              },
              crit3: {
                title: 'criterion 3',
                dataSources: [{
                  id: 'ds3',
                  inputType: 'distribution',
                  inputMethod: 'manualDistribution',
                  source: 'single study'
                }]
              },
              crit4: {
                title: 'criterion 4',
                dataSources: [{
                  id: 'ds4',
                  inputType: 'distribution',
                  inputMethod: 'manualDistribution',
                  source: 'single study'
                }]
              },
              crit5: {
                title: 'criterion 5',
                dataSources: [{
                  id: 'ds5',
                  inputType: 'distribution',
                  inputMethod: 'manualDistribution',
                  source: 'single study'
                }]
              },
              crit6: {
                title: 'durrrvival',
                dataSources: [{
                  id: 'ds6',
                  inputType: 'Unknown'

                }]
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              dataSource: 'ds1',
              performance: {
                type: 'dt'
              }
            }, {
              criterion: 'crit2',
              dataSource: 'ds2',
              performance: {
                type: 'dbeta'
              }
            }, {
              criterion: 'crit3',
              dataSource: 'ds3',
              performance: {
                type: 'dgamma'
              }
            }, {
              criterion: 'crit4',
              dataSource: 'ds4',
              performance: {
                type: 'dnorm'
              }
            }, {
              criterion: 'crit5',
              dataSource: 'ds5',
              performance: {
                type: 'exact'
              }
            }, {
              criterion: 'crit6',
              dataSource: 'ds6',
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
          id: 'uuid2',
          title: 'criterion 1',
          description: 'bla',
          dataSources: [{
            id: 'uuid1',
            oldId: 'ds1',
            source: 'single study',
            sourceLink: 'http://www.drugis.org',
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'continuous'
          }],
          isFavorable: true,
          unitOfMeasurement: 'Proportion'

        }, {
          id: 'uuid4',
          title: 'criterion 2',
          dataSources: [{
            id: 'uuid3',
            oldId: 'ds2',
            source: 'single study',
            sourceLink: 'http://www.drugis.org',
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }],
          isFavorable: true,
          unitOfMeasurement: 'Response size'

        }, {
          id: 'uuid6',
          title: 'criterion 3',
          dataSources: [{
            id: 'uuid5',
            oldId: 'ds3',
            source: 'single study',
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }],
          isFavorable: false

        }, {
          id: 'uuid8',
          title: 'criterion 4',
          dataSources: [{
            id: 'uuid7',
            oldId: 'ds4',
            source: 'single study',
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
          }],
          isFavorable: false
        }, {
          id: 'uuid10',
          title: 'criterion 5',
          dataSources: [{
            id: 'uuid9',
            oldId: 'ds5',
            source: 'single study',
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }],
          isFavorable: false,
        }, {
          id: 'uuid12',
          title: 'durrrvival',
          dataSources: [{
            id: 'uuid11',
            oldId: 'ds6',
            inputType: 'Unknown'
          }],
          isFavorable: false,
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
                dataSources: [{
                  id: 'ds1',
                  source: 'well',
                  sourceLink: 'zelda',
                  strengthOfEvidence: '9001',
                  uncertainties: 'dunno',
                  scales: [0, 1],
                  pvf: {
                    direction: 'decreasing',
                    type: 'linear',
                    range: [0.0, 1.0]
                  },
                  inputType: 'distribution',
                  inputMethod: 'assistedDistribution',
                  dataType: 'dichotomous'
                }],
                unitOfMeasurement: 'absolute',
                omitThis: 'yech'
              },
              crit2: {
                id: 'crit2',
                title: 'criterion 2',
                dataSources: [{
                  id: 'ds2',
                  inputType: 'effect',
                  dataType: 'continuous',
                  parameterOfInterest: 'mean'
                }]
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
          id: 'uuid2',
          title: 'criterion 1',
          description: 'desc',
          dataSources: [{
            id: 'uuid1',
            oldId: 'ds1',
            source: 'well',
            sourceLink: 'zelda',
            strengthOfEvidence: '9001',
            uncertainties: 'dunno',
            inputType: 'distribution',
            inputMethod: 'assistedDistribution',
            dataType: 'dichotomous'
          }],
          unitOfMeasurement: 'absolute',
          isFavorable: true
        }, {
          id: 'uuid4',
          title: 'criterion 2',
          dataSources: [{
            oldId: 'ds2',
            id: 'uuid3',
            inputType: 'effect',
            dataType: 'continuous',
            parameterOfInterest: 'mean'
          }],
          isFavorable: false
        }];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getOptions', function() {
      it('should call the inputknowledgeservice', function() {
        inputKnowledgeServiceMock.getOptions.and.returnValue('here are some options');
        expect(manualInputService.getOptions()).toEqual('here are some options');
      });
    });
  });
});
