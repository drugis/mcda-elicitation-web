'use strict';
define([
  'angular',
  'lodash',
  'angular-mocks',
  'mcda/benefitRisk/benefitRisk'
], function (angular, _) {
  var getDataSourcesByIdMock = jasmine.createSpy();
  var generateUuidMock = function () {
    return 'uuid';
  };
  var currentSchemaVersion = '1.4.7';
  var schemaService;

  describe('The SchemaService', function () {
    beforeEach(
      angular.mock.module('elicit.benefitRisk', function ($provide) {
        $provide.value('generateUuid', generateUuidMock);
        $provide.value('currentSchemaVersion', currentSchemaVersion);
        $provide.value('getDataSourcesById', getDataSourcesByIdMock);
      })
    );

    beforeEach(inject(function (SchemaService) {
      schemaService = SchemaService;
    }));

    var normalPerformance = {
      type: 'dnorm',
      parameters: {
        mu: 1,
        sigma: 0.5
      }
    };

    describe('updateWorkspaceToCurrentSchema', function () {
      beforeEach(function () {
        getDataSourcesByIdMock.calls.reset();
      });

      it('should do nothing to a workspace of the current version', function () {
        var workspace = {
          problem: exampleProblem()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        expect(result).toEqual(workspace);
      });

      it('should update a workspace of version 1.3.4 to the current version and divide the distribution exact value by 100 if unit of measurement is percentage', function () {
        const dataSourcesById = {
          d1: _.merge(exampleProblem134().criteria.c1.dataSources[0], {
            unitOfMeasurement: {
              type: 'percentage',
              label: '%'
            }
          }),
          d2: _.merge(exampleProblem134().criteria.c2.dataSources[0], {
            unitOfMeasurement: {
              type: 'decimal',
              label: 'Proportion'
            }
          })
        };
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);

        var workspace = {
          problem: exampleProblem134()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = angular.copy(workspace);
        expectedResult.problem.criteria.c1.id = 'c1';
        expectedResult.problem.criteria.c2.id = 'c2';
        expectedResult.problem.alternatives.a1.id = 'a1';
        expectedResult.problem.alternatives.a2.id = 'a2';
        expectedResult.problem.criteria.c1.dataSources[0].unitOfMeasurement = {
          type: 'percentage',
          label: '%'
        };
        expectedResult.problem.criteria.c2.dataSources[0].unitOfMeasurement = {
          type: 'decimal',
          label: ''
        };
        expectedResult.problem.performanceTable[0].performance.distribution.value = 0.5;
        expectedResult.problem.performanceTable[0].performance.distribution.input = {
          value: 50,
          scale: 'percentage'
        };
        expectedResult.problem.schemaVersion = currentSchemaVersion;
        expect(result).toEqual(expectedResult);
      });

      it('should update a workspace without schemaversion to the current version', function () {
        const dataSourcesById = {
          uuid: {}
        };
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);
        var workspace = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                isFavorable: undefined,
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source1'
              },
              crit2: {
                title: 'criterion 2',
                description: 'desc',
                isFavorable: null,
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source2'
              }
            },
            alternatives: {
              alt1: {
                title: 'alt1'
              },
              alt2: {
                title: 'alt2'
              }
            },
            performanceTable: [
              {
                criterion: 'crit1',
                alternative: 'alt1',
                performance: normalPerformance
              },
              {
                criterionUri: 'crit2',
                alternative: 'alt1',
                performance: normalPerformance
              },
              {
                criterion: 'crit1',
                alternative: 'alt2',
                performance: normalPerformance
              },
              {
                criterionUri: 'crit2',
                alternative: 'alt2',
                performance: normalPerformance
              }
            ]
          }
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                id: 'crit1',
                title: 'criterion 1',
                description: 'desc',
                dataSources: [
                  {
                    id: 'uuid',
                    unitOfMeasurement: {
                      label: 'ms',
                      type: 'custom'
                    },
                    uncertainties: 'unc',
                    source: 'source1',
                    scale: [-Infinity, Infinity]
                  }
                ]
              },
              crit2: {
                id: 'crit2',
                title: 'criterion 2',
                description: 'desc',
                dataSources: [
                  {
                    id: 'uuid',
                    unitOfMeasurement: {
                      label: 'ms',
                      type: 'custom'
                    },
                    uncertainties: 'unc',
                    source: 'source2',
                    scale: [-Infinity, Infinity]
                  }
                ]
              }
            },
            alternatives: {
              alt1: {
                id: 'alt1',
                title: 'alt1'
              },
              alt2: {
                id: 'alt2',
                title: 'alt2'
              }
            },
            performanceTable: [
              {
                criterion: 'crit1',
                alternative: 'alt1',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              },
              {
                criterion: 'crit2',
                alternative: 'alt1',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              },
              {
                criterion: 'crit1',
                alternative: 'alt2',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              },
              {
                criterion: 'crit2',
                alternative: 'alt2',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              }
            ],
            schemaVersion: currentSchemaVersion
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should update a workspace of version 1.0.0 to the current version', function () {
        const dataSourcesById = {
          uuid: {}
        };
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);
        var workspace = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source'
              },
              crit2: {
                title: 'criterion 2',
                description: 'desc',
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source'
              }
            },
            alternatives: {
              alt1: {
                title: 'alt1'
              },
              alt2: {
                title: 'alt2'
              }
            },
            performanceTable: [
              {
                criterion: 'crit1',
                alternative: 'alt1',
                performance: normalPerformance
              },
              {
                criterion: 'crit2',
                alternative: 'alt1',
                performance: normalPerformance
              },
              {
                criterion: 'crit1',
                alternative: 'alt2',
                performance: normalPerformance
              },
              {
                criterion: 'crit2',
                alternative: 'alt2',
                performance: normalPerformance
              }
            ],
            valueTree: {
              children: [
                {
                  children: {
                    criteria: ['crit1', 'crit2']
                  }
                },
                {
                  criteria: []
                }
              ]
            }
          }
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                id: 'crit1',
                title: 'criterion 1',
                description: 'desc',
                isFavorable: true,
                dataSources: [
                  {
                    id: 'uuid',
                    unitOfMeasurement: {
                      label: 'ms',
                      type: 'custom'
                    },
                    uncertainties: 'unc',
                    source: 'source',
                    scale: [-Infinity, Infinity]
                  }
                ]
              },
              crit2: {
                id: 'crit2',
                title: 'criterion 2',
                description: 'desc',
                isFavorable: true,
                dataSources: [
                  {
                    id: 'uuid',
                    unitOfMeasurement: {
                      label: 'ms',
                      type: 'custom'
                    },
                    uncertainties: 'unc',
                    source: 'source',
                    scale: [-Infinity, Infinity]
                  }
                ]
              }
            },
            alternatives: {
              alt1: {
                id: 'alt1',
                title: 'alt1'
              },
              alt2: {
                id: 'alt2',
                title: 'alt2'
              }
            },
            performanceTable: [
              {
                criterion: 'crit1',
                alternative: 'alt1',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              },
              {
                criterion: 'crit2',
                alternative: 'alt1',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              },
              {
                criterion: 'crit1',
                alternative: 'alt2',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              },
              {
                criterion: 'crit2',
                alternative: 'alt2',
                dataSource: 'uuid',
                performance: {
                  distribution: normalPerformance
                }
              }
            ],
            schemaVersion: currentSchemaVersion
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should update a problem of schema version 1.1.0 to the current version', function () {
        const dataSourcesById = {
          proxDvtDS: exampleProblem().criteria['Prox DVT'].dataSources[0],
          distDvtDS: exampleProblem().criteria['Dist DVT'].dataSources[0],
          bleedDS: exampleProblem().criteria.Bleed.dataSources[0]
        };
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);
        var workspace = {
          problem: exampleProblem110()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: exampleProblem()
        };
        expect(result).toEqual(expectedResult);
      });

      it('should update a problem of schema version 1.2.2 to the current version', function () {
        const dataSourcesById = {
          proxDvtDS: exampleProblem().criteria['Prox DVT'].dataSources[0],
          distDvtDS: exampleProblem().criteria['Dist DVT'].dataSources[0],
          bleedDS: exampleProblem().criteria.Bleed.dataSources[0]
        };
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);
        var workspace = {
          problem: exampleProblem122()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: exampleProblem()
        };
        expect(result).toEqual(expectedResult);
      });

      it('should update a problem of schema version 1.4.5 to the current version', function () {
        const workspace = {
          problem: exampleProblem145()
        };
        const result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        let expectedResult = angular.copy(workspace);
        expectedResult.problem.performanceTable[1].performance.effect.input.value = 0.01;
        expectedResult.problem.performanceTable[1].performance.effect.input.upperBound = 0.02;
        expectedResult.problem.performanceTable[2].performance.effect.input.lowerBound = 0.01;
        expectedResult.problem.performanceTable[2].performance.effect.input.upperBound = 0.9;
        expectedResult.problem.performanceTable[3].performance.effect.input.value = 0.19;
        expectedResult.problem.performanceTable[4].performance.effect.input.value = 0.19;
        expectedResult.problem.schemaVersion = currentSchemaVersion;
        expect(result).toEqual(expectedResult);
      });
    });

    describe('updateProblemToCurrentSchema', function () {
      it('should throw an error if the final schema version is not the current version', function () {
        const funkyProblem = {
          schemaVersion: 'can.never.happen'
        };
        const error = `Configured current schema version (${currentSchemaVersion}) is not the same as the updated schema version (${funkyProblem.schemaVersion})`;

        expect(function () {
          schemaService.updateProblemToCurrentSchema(funkyProblem);
        }).toThrow(error);
      });
    });

    describe('validateProblem', function () {
      beforeEach(function () {
        getDataSourcesByIdMock.calls.reset();
      });

      it('should throw no errors if the JSON file passed to the function is valid according to the schema', function () {
        var inputJSON = require('./test.json');
        expect(function () {
          schemaService.validateProblem(inputJSON);
        }).not.toThrow();
      });

      it('should throw no errors if the JSON file passed to the function contains correct relative data', function () {
        var inputJSON = require('./hansen-updated.json');
        const dataSourcesById = createHansenDataSourcesById(inputJSON);
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);
        expect(function () {
          schemaService.validateProblem(inputJSON);
        }).not.toThrow();
      });

      function createHansenDataSourcesById(inputJSON) {
        var dataSourcesById = {};
        var proportionUnit = {
          unitOfMeasurement: {
            type: 'decimal',
            label: 'Proportion'
          }
        };
        var criteria = inputJSON.criteria;
        dataSourcesById[criteria['HAM-D'].dataSources[0].id] = _.merge(
          dataSourcesById[criteria['HAM-D'].dataSources[0].id],
          proportionUnit
        );
        dataSourcesById[criteria.Diarrhea.dataSources[0].id] = _.merge(
          dataSourcesById[criteria.Diarrhea.dataSources[0].id],
          proportionUnit
        );
        dataSourcesById[criteria.Dizziness.dataSources[0].id] = _.merge(
          dataSourcesById[criteria.Dizziness.dataSources[0].id],
          proportionUnit
        );
        dataSourcesById[criteria.Headache.dataSources[0].id] = _.merge(
          dataSourcesById[criteria.Headache.dataSources[0].id],
          proportionUnit
        );
        dataSourcesById[criteria.Insomnia.dataSources[0].id] = _.merge(
          dataSourcesById[criteria.Insomnia.dataSources[0].id],
          proportionUnit
        );
        dataSourcesById[criteria.Nausea.dataSources[0].id] = _.merge(
          dataSourcesById[criteria.Nausea.dataSources[0].id],
          proportionUnit
        );
        return dataSourcesById;
      }

      it('should return true if the JSON file passed to the function is not valid according to the schema', function () {
        var inputJSON = require('./test-false.json');
        expect(function () {
          schemaService.validateProblem(inputJSON);
        }).toThrow();
      });
    });

    describe('isInputPercentified', function () {
      it('should return true if datasource unit type is percentage and there is an effect with lowerbound input', () => {
        const isDataSourcePercentageMap = {dsId: true};
        const entry = {
          dataSource: 'dsId',
          performance: {effect: {input: {lowerBound: 0.1}}}
        };
        const result = schemaService.isInputPercentified(
          isDataSourcePercentageMap,
          entry
        );
        expect(result).toBeTruthy();
      });

      it('should return true if datasource unit type is percentage and there is an effect with sampleSize input', () => {
        const isDataSourcePercentageMap = {dsId: true};
        const entry = {
          dataSource: 'dsId',
          performance: {effect: {input: {value: 42, sampleSize: 1337}}}
        };
        const result = schemaService.isInputPercentified(
          isDataSourcePercentageMap,
          entry
        );
        expect(result).toBeTruthy();
      });

      it('should return true if datasource unit type is percentage and there is an effect with value input', () => {
        const isDataSourcePercentageMap = {dsId: true};
        const entry = {
          dataSource: 'dsId',
          performance: {effect: {input: {value: 42}}}
        };
        const result = schemaService.isInputPercentified(
          isDataSourcePercentageMap,
          entry
        );
        expect(result).toBeTruthy();
      });

      it('should return false if datasource unit type is not percentage and there is an effect with lowerbound input', () => {
        const isDataSourcePercentageMap = {dsId: false};
        const entry = {
          dataSource: 'dsId',
          performance: {effect: {input: {lowerBound: 0.1}}}
        };
        const result = schemaService.isInputPercentified(
          isDataSourcePercentageMap,
          entry
        );
        expect(result).toBeFalsy();
      });

      it('should return false if datasource unit type is percentage but there is no effect performance', () => {
        const isDataSourcePercentageMap = {dsId: false};
        const entry = {
          dataSource: 'dsId',
          performance: {}
        };
        const result = schemaService.isInputPercentified(
          isDataSourcePercentageMap,
          entry
        );
        expect(result).toBeFalsy();
      });

      it('should return false if datasource unit type is percentage but effect has no input', () => {
        const isDataSourcePercentageMap = {dsId: false};
        const entry = {
          dataSource: 'dsId',
          performance: {effect: {}}
        };
        const result = schemaService.isInputPercentified(
          isDataSourcePercentageMap,
          entry
        );
        expect(result).toBeFalsy();
      });

      it('should return false if datasource unit type is percentage but input has no lowerBound', () => {
        const isDataSourcePercentageMap = {dsId: false};
        const entry = {
          dataSource: 'dsId',
          performance: {effect: {sampleSize: 42}}
        };
        const result = schemaService.isInputPercentified(
          isDataSourcePercentageMap,
          entry
        );
        expect(result).toBeFalsy();
      });
    });

    describe('extractPvfs', () => {
      it('should return pvfs keyed by criterion id', () => {
        const criteria = {
          crit1Id: {
            id: 'crit1Id',
            title: 'criterion1',
            dataSources: [
              {id: 'ds1Id', pvf: {range: [0, 1], direction: 'increasing'}}
            ]
          }
        };
        const result = schemaService.extractPvfs(criteria);
        const expectedResult = {
          crit1Id: {
            direction: 'increasing'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('mergePvfs', () => {
      it('should merge pvfs onto scenario if there are none', () => {
        const scenario = {
          id: 1,
          state: {problem: {criteria: {crit1Id: {}}}}
        };
        const pvfs = {crit1Id: {direction: 'increasing'}};
        const result = schemaService.mergePvfs(scenario, pvfs);
        const expectedResult = {
          id: 1,
          state: {
            problem: {
              criteria: {
                crit1Id: {
                  dataSources: [{pvf: {direction: 'increasing'}}]
                }
              }
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should not merge pvfs onto scenario if there are already', () => {
        const scenario = {
          id: 1,
          state: {
            problem: {
              criteria: {
                crit1Id: {
                  dataSources: [{pvf: {direction: 'decreasing'}}]
                }
              }
            }
          }
        };
        const pvfs = {crit1Id: {direction: 'increasing'}};
        const result = schemaService.mergePvfs(scenario, pvfs);
        const expectedResult = {
          id: 1,
          state: {
            problem: {
              criteria: {
                crit1Id: {
                  dataSources: [{pvf: {direction: 'decreasing'}}]
                }
              }
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('extractRanges', () => {
      it('should return ranges keyed by data source id', () => {
        const criteria = {
          crit1Id: {
            id: 'crit1Id',
            title: 'criterion1',
            dataSources: [
              {id: 'ds1Id', pvf: {range: [0, 1], direction: 'increasing'}}
            ]
          }
        };
        const result = schemaService.extractRanges(criteria);
        const expectedResult = {
          ds1Id: [0, 1]
        };
        expect(result).toEqual(expectedResult);
      });

      it('should return nothing if there are no pvf on the data source', () => {
        const criteria = {
          crit1Id: {
            id: 'crit1Id',
            title: 'criterion1',
            dataSources: [{id: 'ds1Id'}]
          }
        };
        const result = schemaService.extractRanges(criteria);
        const expectedResult = {};
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
