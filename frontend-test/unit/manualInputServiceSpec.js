'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/manualInput/manualInput'], function(_) {

  var generateUuidMock = jasmine.createSpy('generateUuid');
  var manualInputService;
  var inputKnowledgeServiceMock = jasmine.createSpyObj('InputKnowledgeService', ['getOptions', 'inputToString',
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
                function() { return 'error message'; }
              ]
            }
          }
        };
        var result = manualInputService.getInputError(cell);
        expect(result).toBe('error message');
      });
      it('should return no error for an empty typed cell', function(){
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
            alternative1: _.extend({}, oldInputData.crit2id.alternative1, {
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
          inputMetaData: {
            inputType: 'effect',
            dataType: 'other'
          }
        }, {
          title: 'unfavorable criterion',
          description: 'some crit description',
          unitOfMeasurement: 'particles',
          isFavorable: false,
          id: 'criterion2id',
          inputMetaData: {
            inputType: 'distribution',
            inputMethod: 'manualDistribution'
          }
        }, {
          title: 'dichotomousDecimalSampleSize',
          id: 'criterion3id',
          inputMetaData: {
            inputType: 'effect',
            dataType: 'dichotomous'
          }
        }];
        var inputData = {
          criterion1id: {
            alternative1: {
              inputType: 'effect',
              dataType: 'other',
              firstParameter: 10,
              inputParameters: {
                id: 'valueExact'
              }
            }
          },
          criterion2id: {
            alternative1: {
              inputType: 'distribution',
              inputMethod: 'manualDistribution',
              firstParameter: 20,
              inputParameters: {
                id: 'valueExact'
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
          inputMetaData: {
            inputType: 'effect',
            dataType: 'other'
          }
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
          crit: {
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
        inputKnowledgeServiceMock.getOptions.and.returnValue('here are some options');
        expect(manualInputService.getOptions()).toEqual('here are some options');
      });
    });
  });
});
