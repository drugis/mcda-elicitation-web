'use strict';
/* globals exampleProblem, exampleRelativeProblem */
define([
  'lodash',
  'angular',
  'angular-mocks',
  'mcda/workspace/workspace'
], function(_, angular) {
  describe('The WorkspaceService, ', function() {
    var workspaceService;
    var pataviResultsServiceMock = jasmine.createSpyObj('PataviResultsService', ['postAndHandleResults']);
    var performanceTableServiceMock = jasmine.createSpyObj('performanceTableService', ['getEffectValues', 'getRangeDistributionValues']);
    var qMock = jasmine.createSpyObj('$q', ['resolve']);

    beforeEach(angular.mock.module('elicit.workspace', function($provide) {
      $provide.value('PataviResultsService', pataviResultsServiceMock);
      $provide.value('PerformanceTableService', performanceTableServiceMock);
      $provide.value('$q', qMock);
    }));

    beforeEach(inject(function(WorkspaceService) {
      workspaceService = WorkspaceService;
    }));

    describe('getObservedScales', function() {
      beforeEach(function() {
        pataviResultsServiceMock.postAndHandleResults.calls.reset();
      });

      it('should call the pataviResultService with distribution data', function() {
        var problem = {
          criteria: {
            crit1: {
              dataSources: [{ id: 'ds1' }]
            }
          },
          performanceTable: [{
            criterion: 'crit1',
            dataSource: 'ds1',
            performance: {
              distribution: {}
            }
          }]
        };
        var expectedProblem = {
          criteria: {
            ds1: {
              id: 'ds1'
            }
          },
          performanceTable: [{
            criterion: 'ds1',
            dataSource: 'ds1',
            performance: {}
          }],
          method: 'scales'
        };

        workspaceService.getObservedScales(problem);

        expect(pataviResultsServiceMock.postAndHandleResults).toHaveBeenCalledWith(expectedProblem);
      });

      it('should call the pataviResultService with effect data if distribution data is missing', function() {
        var problem = {
          criteria: {
            crit1: {
              dataSources: [{ id: 'ds1' }]
            }
          },
          performanceTable: [{
            criterion: 'crit1',
            dataSource: 'ds1',
            performance: {
              effect: {}
            }
          }]
        };

        var expectedProblem = {
          criteria: {
            ds1: {
              id: 'ds1'
            }
          },
          performanceTable: [{
            criterion: 'ds1',
            dataSource: 'ds1',
            performance: {}
          }],
          method: 'scales'
        };

        workspaceService.getObservedScales(problem);

        expect(pataviResultsServiceMock.postAndHandleResults).toHaveBeenCalledWith(expectedProblem);
      });

    });

    describe('mergeBaseAndSubProblem', function() {
      it('should create a new problem from the original problem with the sub problem merged into it', function() {
        var problem = {
          criteria: {
            critId1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  range: [4, 5]
                }
              }]
            },
            critId2: {
              dataSources: [{
                id: 'ds2'
              }]
            },
            critId4: {
              dataSources: [{
                id: 'ds4'
              }]
            }
          },
          performanceTable: [{
            criterion: 'critId1',
            alternative: 'alt2',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'exact'
              }
            }
          }, {
            criterion: 'critId2',
            alternative: 'alt1',
            dataSource: 'ds2',
            performance: {
              effect: {
                type: 'exact'
              }
            }
          }, {
            criterion: 'critId2',
            alternative: 'alt2',
            dataSource: 'ds3',
            performance: {
              distribution: {
                type: 'exact'
              }
            }
          }, {
            criterion: 'critId4',
            dataSource: 'ds4',
            performance: {
              distribution: {
                type: 'relative-something',
                parameters: {
                  relative: {
                    cov: {
                      colnames: ['alt1', 'alt2', 'alt3'],
                      rownames: ['alt1', 'alt2', 'alt3'],
                      data: [
                        [1, 2, 3],
                        [4, 5, 6],
                        [7, 8, 9]
                      ]
                    },
                    mu: {
                      alt1: 2,
                      alt2: 5,
                      alt3: 8
                    }
                  }
                }
              }
            }
          }],
          alternatives: {
            alt1: 'altId1',
            alt2: 'altId2',
            alt3: 'altId3'
          }
        };
        var subProblemDefinition = {
          ranges: {
            ds2: {
              pvf: {
                range: [2, 3]
              }
            },
            ds4: {
              pvf: {
                range: [6, 7]
              }
            }
          },
          excludedCriteria: ['critId1'],
          excludedAlternatives: ['alt1'],
          excludedDataSources: ['ds1', 'ds3']
        };
        var result = workspaceService.mergeBaseAndSubProblem(problem, subProblemDefinition);
        var expectedResult = {
          criteria: {
            critId2: {
              dataSources: [{
                id: 'ds2',
                pvf: {
                  range: [2, 3]
                }
              }]
            },
            critId4: {
              dataSources: [{
                id: 'ds4',
                pvf: {
                  range: [6, 7]
                }
              }]
            }
          },
          alternatives: {
            alt2: 'altId2',
            alt3: 'altId3'
          },
          performanceTable: [{
            criterion: 'critId4',
            dataSource: 'ds4',
            performance: {
              distribution: {
                type: 'relative-something',
                parameters: {
                  relative: {
                    cov: {
                      colnames: ['alt2', 'alt3'],
                      rownames: ['alt2', 'alt3'],
                      data: [
                        [5, 6],
                        [8, 9]
                      ]
                    },
                    mu: {
                      alt2: 5,
                      alt3: 8
                    }
                  }
                }
              }
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildAggregateState', function() {
      it('should aggregate the problem with the subproblem and the scenario, and set the theoretical scales', function() {
        var problem = {
          criteria: {
            critId1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  range: [4, 5]
                }
              }]
            },
            critId2: {
              dataSources: [{
                unitOfMeasurement: 'keepme',
                id: 'ds2',
                scale: [0, 1]
              }]
            },
            critId4: {
              dataSources: [{
                id: 'ds4'
              }]
            }
          },
          performanceTable: [{
            criterion: 'critId1',
            dataSource: 'ds1'
          }, {
            criterion: 'critId2',
            dataSource: 'ds2'
          }, {
            criterion: 'critId2',
            dataSource: 'ds3'
          }, {
            criterion: 'critId4',
            dataSource: 'ds4'
          }]
        };
        var subProblem = {
          definition: {
            ranges: {
              ds2: {
                pvf: {
                  range: [2, 3]
                }
              },
              ds4: {
                pvf: {
                  range: [6, 7]
                }
              }
            },
            excludedCriteria: ['critId1'],
            excludedDataSources: ['ds1', 'ds3']
          }
        };
        var scenario = {
          state: {
            criteria: {}
          }
        };
        var result = workspaceService.buildAggregateState(problem, subProblem, scenario);
        var expectedResult = {
          criteria: {},
          problem: {
            criteria: {
              critId2: {
                dataSources: [{
                  id: 'ds2',
                  unitOfMeasurement: 'keepme',
                  pvf: {
                    range: [2, 3]
                  },
                  scale: [0, 1]
                }]
              },
              critId4: {
                dataSources: [{
                  id: 'ds4',
                  pvf: {
                    range: [6, 7]
                  },
                  scale: [-Infinity, Infinity]
                }]
              }
            },
            alternatives: {},
            preferences: undefined,
            performanceTable: [{
              criterion: 'critId2',
              dataSource: 'ds2'
            }, {
              criterion: 'critId4',
              dataSource: 'ds4'
            }]
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('setDefaultObservedScales', function() {
      beforeEach(function() {
        performanceTableServiceMock.getEffectValues.and.returnValue([]);
        performanceTableServiceMock.getRangeDistributionValues.and.returnValue([]);
      });

      it('should set observed scale ranges if none are on the problem & subproblem', function() {
        var scales = {
          observed: {
            ds1: {
              alt1: {
                '50%': 1,
                '2.5%': 2,
                '97.5%': 3
              },
              alt2: {
                '50%': 4,
                '2.5%': 5,
                '97.5%': 6
              }
            },
            ds2: {
              alt1: {
                '50%': 7,
                '2.5%': 8,
                '97.5%': 9
              },
              alt2: {
                '50%': 10,
                '2.5%': 11,
                '97.5%': 12
              }
            }
          }
        };
        var problem = {
          criteria: {
            crit1: { dataSources: [{ id: 'ds1' }] },
            crit2: { dataSources: [{ id: 'ds2' }] }
          }
        };

        var result = workspaceService.setDefaultObservedScales(problem, scales.observed);

        var expectedProblem = {
          criteria: {
            crit1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  range: [1, 6]
                }
              }]
            },
            crit2: {
              dataSources: [{
                id: 'ds2',
                pvf: {
                  range: [7, 12]
                }
              }]
            }
          }
        };
        expect(result).toEqual(expectedProblem);
      });

      it('should not override already-configured scale ranges on the problem or subproblem', function() {
        var scales = {
          observed: {
            ds1: {
              alt1: {
                '50%': 1,
                '2.5%': 2,
                '97.5%': 3
              },
              alt2: {
                '50%': 4,
                '2.5%': 5,
                '97.5%': 6
              }
            },
            ds2: {
              alt1: {
                '50%': 7,
                '2.5%': 8,
                '97.5%': 9
              },
              alt2: {
                '50%': 10,
                '2.5%': 11,
                '97.5%': 12
              }
            },
            crit3ThatShouldBeIgnored: {
              any: 'thing'
            }
          }
        };
        var problem = {
          criteria: {
            crit1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  range: [3, 5]
                }
              }]
            },
            crit2: {
              dataSources: [{
                id: 'ds2',
              }]
            }
          }
        };

        var result = workspaceService.setDefaultObservedScales(problem, scales.observed);

        var expectedProblem = {
          criteria: {
            crit1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  range: [3, 5]
                }
              }]
            },
            crit2: {
              dataSources: [{
                id: 'ds2',
                pvf: {
                  range: [7, 12]
                }
              }]
            }
          }
        };
        expect(result).toEqual(expectedProblem);
      });

      it('should put a margin around ranges where the min and the max are equal', function() {
        var scales = {
          observed: {
            ds1: {
              alt1: {
                '50%': 1,
                '2.5%': 1,
                '97.5%': 1
              }
            }
          }
        };
        var problem = {
          criteria: {
            crit1: { dataSources: [{ id: 'ds1' }] }
          }
        };

        var result = workspaceService.setDefaultObservedScales(problem, scales.observed);

        var expectedProblem = {
          criteria: {
            crit1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  range: [0.999, 1.001]
                }
              }]
            }
          }
        };

        expect(result).toEqual(expectedProblem);
      });
    });

    describe('reduceProblem', function() {
      it('should reduce the problem', function() {
        var problem = {
          criteria: {
            crit1: {
              title: 'critId1',
              somthing: 'else'
            },
            crit2: {
              title: 'critId2',
              scale: [0, 1],
              pvf: 'pvf'
            }
          }
        };
        var expectedResult = {
          criteria: {
            crit1: {},
            crit2: {
              scale: [0, 1],
              pvf: 'pvf'
            }
          }
        };
        var result = workspaceService.reduceProblem(problem);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('filterScenariosWithResults', function() {
      var problem = {
        criteria: {
          crit1: {
            dataSources: [{
              id: 'ds1',
              pvf: {
                range: [1, 2],
                direction: 'decreasing'
              }
            }]
          },
          crit2: {
            dataSources: [{
              id: 'ds2'
            }]
          },
          crit3: {
            dataSources: [{
              id: 'ds3'
            }]
          }
        },
        performanceTable: [{
          criterion: 'crit1',
          dataSource: 'ds1'
        }, {
          criterion: 'crit2',
          dataSource: 'ds2'
        }]
      };
      var subProblem = {
        definition: {
          ranges: {
            crit1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  range: [1, 2]
                }
              }]
            },
            crit2: {
              dataSources: [{
                id: 'ds2',
                pvf: {
                  range: [4, 5]
                }
              }]
            }
          }
        }
      };

      it('should only return the scenarios in which all criteria have fully defined pvfs', function() {
        var scenarios = [{
          state: {
            prefs: {}
          }
        }, {
          state: {
            problem: {
              criteria: {
                crit1: {}
              }
            }
          }
        }, {
          state: {
            problem: {
              criteria: {
                crit2: {
                  dataSources: [{
                    pvf: {
                      range: [4, 5],
                      direction: 'increasing'
                    }
                  }]
                },
                crit3: {
                  dataSources: [{
                    pvf: {
                      range: [5, 6],
                      direction: 'increasing'
                    }
                  }]
                }
              }
            }
          }
        }];

        var result = workspaceService.filterScenariosWithResults(problem, subProblem, scenarios);
        var expectedResult = [{
          state: {
            problem: {
              criteria: {
                crit2: {
                  dataSources: [{
                    pvf: {
                      range: [4, 5],
                      direction: 'increasing'
                    }
                  }]
                },
                crit3: {
                  dataSources: [{
                    pvf: {
                      range: [5, 6],
                      direction: 'increasing'
                    }
                  }]
                }
              }
            }
          }
        }];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('validateWorkspace', function() {
      it('should indicate which required properties are missing', function() {
        var empty = {};
        var validity = workspaceService.validateWorkspace(empty);
        expect(validity.isValid).toBeFalsy();
        expect(validity.errorMessage).toBe('Missing workspace properties: title, criteria, alternatives, performanceTable');
      });

      it('should fail gracefully when exceptions occur', function() {
        var garbage = {
          title: 'foo',
          criteria: {
            foo: {
              title: 'bar'
            },
            qux: {
              title: 'fnord'
            }
          },
          alternatives: {
            foo: {
              title: 'bar'
            },
            qux: {
              title: 'fnord'
            }
          },
          performanceTable: '5'
        };
        var validity = workspaceService.validateWorkspace(garbage);
        expect(validity.isValid).toBeFalsy();
        expect(validity.errorMessage).toBe('Exception while reading problem. Please make sure the file follows the specifications as laid out in the manual');
      });

      describe('for absolute performances', function() {
        it('should return valid for a valid problem', function() {
          var example = exampleProblem();
          var validity = workspaceService.validateWorkspace(example);
          expect(validity.isValid).toBeTruthy();
          expect(validity.errorMessage).toBe(undefined);
        });

        it('should fail if a required property is missing', function() {
          var example = exampleProblem();
          var withoutTitle = _.omit(example, 'title');
          var validityWithoutTitle = workspaceService.validateWorkspace(withoutTitle);
          expect(validityWithoutTitle.isValid).toBeFalsy();
          expect(validityWithoutTitle.errorMessage).toBe('Missing workspace property: title');
          var withoutCriteriaAndAlternatives = _.omit(example, ['criteria', 'alternatives']);
          var validitywithoutCriteriaAndAlternatives = workspaceService.validateWorkspace(withoutCriteriaAndAlternatives);
          expect(validitywithoutCriteriaAndAlternatives.isValid).toBeFalsy();
          expect(validitywithoutCriteriaAndAlternatives.errorMessage).toBe('Missing workspace properties: criteria, alternatives');
        });

        it('should fail if there are fewer than 2 criteria', function() {
          var example = exampleProblem();
          var exampleWithOneCriterion = _.cloneDeep(example);
          delete exampleWithOneCriterion.criteria.Bleed;
          delete exampleWithOneCriterion.criteria['Prox DVT'];
          delete exampleWithOneCriterion.criteria.Bleed2;
          delete exampleWithOneCriterion.criteria.Bleed3;
          delete exampleWithOneCriterion.criteria.null2Infinity;
          var validity = workspaceService.validateWorkspace(exampleWithOneCriterion);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Two or more criteria required');
        });

        it('should fail if there are fewer than 2 alternatives', function() {
          var example = exampleProblem();
          var exampleWithOneAlternative = _.cloneDeep(example);
          delete exampleWithOneAlternative.alternatives.Hep;
          var validity = workspaceService.validateWorkspace(exampleWithOneAlternative);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Two or more alternatives required');
        });

        it('should fail if there is data in the performanceTable for nonexistent criteria', function() {
          var exampleWithExtraPerformanceData = _.cloneDeep(exampleProblem());
          exampleWithExtraPerformanceData.performanceTable.push({
            alternative: 'Enox',
            criterion: 'nonsense',
            performance: {
              distribution: {
                type: 'dbeta',
                parameters: { alpha: 5, beta: 124 }
              }
            }
          });
          var validity = workspaceService.validateWorkspace(exampleWithExtraPerformanceData);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Performance table contains data for nonexistent criterion: "nonsense"');
        });

        it('should fail if there is data in the performanceTable for nonexistent alternatives', function() {
          var exampleWithExtraPerformanceData = _.cloneDeep(exampleProblem());
          exampleWithExtraPerformanceData.performanceTable.push({
            alternative: 'nonsense',
            criterion: 'Bleed',
            performance: {
              distribution: {
                type: 'dbeta',
                parameters: { alpha: 5, beta: 124 }
              }
            }
          });
          var validity = workspaceService.validateWorkspace(exampleWithExtraPerformanceData);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Performance table contains data for nonexistent alternative: "nonsense"');
        });

        it('should fail if a cell of the performance table is left empty', function() {
          var exampleWithMissingPerformanceData = _.cloneDeep(exampleProblem());
          exampleWithMissingPerformanceData.performanceTable.pop();
          var validity = workspaceService.validateWorkspace(exampleWithMissingPerformanceData);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Performance table is missing data for criterion "Bleed" and alternative "Enox"');
        });

        it('should fail if a criterion lacks a title', function() {
          var missingCriterionTitle = _.cloneDeep(exampleProblem());
          delete missingCriterionTitle.criteria.Bleed.title;
          var validity = workspaceService.validateWorkspace(missingCriterionTitle);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Missing title for criterion: "Bleed"');
        });

        it('should fail if a alternative lacks a title', function() {
          var missingAlternativeTitle = _.cloneDeep(exampleProblem());
          delete missingAlternativeTitle.alternatives.Hep.title;
          var validity = workspaceService.validateWorkspace(missingAlternativeTitle);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Missing title for alternative: "Hep"');
        });
      });

      describe('for relative performances', function() {
        it('should work for a valid problem', function() {
          var problem = exampleRelativeProblem();
          var validity = workspaceService.validateWorkspace(problem);
          expect(validity.isValid).toBeTruthy();
          expect(validity.errorMessage).toBe(undefined);
        });

        it('should fail when the baseline is missing', function() {
          var problemWithMissingBaseline = _.cloneDeep(exampleRelativeProblem());
          delete problemWithMissingBaseline.performanceTable[0].performance.distribution.parameters.baseline;
          var validity = workspaceService.validateWorkspace(problemWithMissingBaseline);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Missing baseline for criterion: "crit1"');
        });

        it('should fail when the mu refers to a nonexistent alternative', function() {
          var problemWithNonsenseMu = _.cloneDeep(exampleRelativeProblem());
          var mu = problemWithNonsenseMu.performanceTable[0].performance.distribution.parameters.relative.mu;
          delete mu['4939'];
          mu.nonsense = 3;
          var validity = workspaceService.validateWorkspace(problemWithNonsenseMu);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('The mu of the performance of criterion: "crit1" refers to nonexistent alternative: "nonsense"');
        });

        it('should fail when the cov rownames or colnames refer to a nonexistent alternative', function() {
          var problemWithNonsenseRowName = _.cloneDeep(exampleRelativeProblem());
          var cov = problemWithNonsenseRowName.performanceTable[0].performance.distribution.parameters.relative.cov;
          cov.rownames[0] = 'nonsense';
          var validity = workspaceService.validateWorkspace(problemWithNonsenseRowName);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('The covariance matrix of criterion: "crit1" refers to nonexistent alternative: "nonsense"');
          var problemWithNonsenseColName = _.cloneDeep(exampleRelativeProblem());
          cov = problemWithNonsenseColName.performanceTable[0].performance.distribution.parameters.relative.cov;
          cov.colnames[0] = 'nonsense';
          validity = workspaceService.validateWorkspace(problemWithNonsenseColName);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('The covariance matrix of criterion: "crit1" refers to nonexistent alternative: "nonsense"');
        });
      });

      describe('regarding preferences', function() {
        it('should fail if a preference refers to a nonexistent criterion', function() {
          var exampleWithBadPreference = _.cloneDeep(exampleProblem());
          exampleWithBadPreference.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Prox DVT', 'nonsense']
          }];
          var validity = workspaceService.validateWorkspace(exampleWithBadPreference);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Preferences contain data for nonexistent criterion: "nonsense"');
        });

        it('should fail if there are mixed preferences', function() {
          var preferencesMixed = _.cloneDeep(exampleProblem());
          preferencesMixed.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'exact swing',
            criteria: ['Prox DVT', 'Dist DVT'],
            ratio: 1.5
          }];
          var validity = workspaceService.validateWorkspace(preferencesMixed);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Preferences should all be the same type');
        });

        it('should not fail if ordinal preferences are fine', function() {
          var consistentOrdinal = _.cloneDeep(exampleProblem());
          consistentOrdinal.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Prox DVT', 'Dist DVT']
          }, {
            type: 'ordinal',
            criteria: ['Dist DVT', 'Bleed2']
          }, {
            type: 'ordinal',
            criteria: ['Bleed2', 'Bleed3']
          }, {
            type: 'ordinal',
            criteria: ['Bleed3', 'null2Infinity']
          }];
          var validity = workspaceService.validateWorkspace(consistentOrdinal);
          expect(validity.isValid).toBeTruthy();
          expect(validity.errorMessage).toBe(undefined);
        });

        it('should fail if ordinal preferences are inconsistent because one is compared to multiple', function() {
          var inconsistentOrdinalWithTree = _.cloneDeep(exampleProblem());
          inconsistentOrdinalWithTree.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Bleed', 'Dist DVT']
          }, {
            type: 'ordinal',
            criteria: ['Dist DVT', 'Bleed2']
          }, {
            type: 'ordinal',
            criteria: ['Bleed2', 'Bleed3']
          }, {
            type: 'ordinal',
            criteria: ['Bleed3', 'null2Infinity']
          }];
          var validity = workspaceService.validateWorkspace(inconsistentOrdinalWithTree);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent ordinal preferences');
        });

        it('should fail if ordinal preferences are inconsistent', function() {
          var inconsistentOrdinalCycle = _.cloneDeep(exampleProblem());
          inconsistentOrdinalCycle.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Prox DVT', 'Dist DVT']
          }, {
            type: 'ordinal',
            criteria: ['Dist DVT', 'Bleed2']
          }, {
            type: 'ordinal',
            criteria: ['Bleed2', 'Bleed3']
          }, {
            type: 'ordinal',
            criteria: ['Bleed3', 'null2Infinity']
          }, {
            type: 'ordinal',
            criteria: ['null2Infinity', 'Bleed']
          }];
          var validity = workspaceService.validateWorkspace(inconsistentOrdinalCycle);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent ordinal preferences');
          var inconsistentOrdinalTooLong = _.cloneDeep(exampleProblem());
          inconsistentOrdinalTooLong.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Prox DVT', 'Bleed']
          }, {
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }];
          validity = workspaceService.validateWorkspace(inconsistentOrdinalTooLong);
          expect(validity.isValid).toBeFalsy();
          var inconsistentOrdinalTooShort = _.cloneDeep(exampleProblem());
          inconsistentOrdinalTooShort.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }];
          validity = workspaceService.validateWorkspace(inconsistentOrdinalTooShort);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent ordinal preferences');
          var inconsistentOrdinalSelfReference = _.cloneDeep(exampleProblem());
          inconsistentOrdinalSelfReference.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Bleed']
          }, {
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Prox DVT', 'Dist DVT']
          }, {
            type: 'ordinal',
            criteria: ['Dist DVT', 'Bleed2']
          }, {
            type: 'ordinal',
            criteria: ['Bleed2', 'Bleed3']
          }, {
            type: 'ordinal',
            criteria: ['Bleed3', 'null2Infinity']
          }];
          validity = workspaceService.validateWorkspace(inconsistentOrdinalSelfReference);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent ordinal preferences');
        });

        it('should succeed on consistent exact preferences', function() {
          var consistentExact = _.cloneDeep(exampleProblem());
          consistentExact.preferences = [{
            type: 'exact swing',
            criteria: ['Bleed', 'Prox DVT'],
            ratio: 1
          }, {
            type: 'exact swing',
            criteria: ['Bleed', 'Dist DVT'],
            ratio: 1
          }];
          var validity = workspaceService.validateWorkspace(consistentExact);
          expect(validity.isValid).toBeTruthy();
        });

        it('should fail on inconsistent exact preferences', function() {
          var inconsistentWrongRoot = _.cloneDeep(exampleProblem());
          inconsistentWrongRoot.preferences = [{
            type: 'exact swing',
            criteria: ['Bleed', 'Prox DVT'],
            ratio: 1
          }, {
            type: 'exact swing',
            criteria: ['Prox DVT', 'Dist DVT'],
            ratio: 1
          }];
          var validity = workspaceService.validateWorkspace(inconsistentWrongRoot);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent exact weighting preferences');
          var inconsistentBadRatio = _.cloneDeep(exampleProblem());
          inconsistentBadRatio.preferences = [{
            type: 'exact swing',
            criteria: ['Bleed', 'Prox DVT'],
            ratio: 1.5
          }, {
            type: 'exact swing',
            criteria: ['Bleed', 'Dist DVT'],
            ratio: 1
          }];
          validity = workspaceService.validateWorkspace(inconsistentBadRatio);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent exact weighting preferences');
          var inconsistentNegative = _.cloneDeep(exampleProblem());
          inconsistentNegative.preferences = [{
            type: 'exact swing',
            criteria: ['Bleed', 'Prox DVT'],
            ratio: -0
          }, {
            type: 'exact swing',
            criteria: ['Bleed', 'Dist DVT'],
            ratio: 1
          }];
          validity = workspaceService.validateWorkspace(inconsistentNegative);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent exact weighting preferences');
          var inconsistentSelfReference = _.cloneDeep(exampleProblem());
          inconsistentSelfReference.preferences = [{
            type: 'exact swing',
            criteria: ['Bleed', 'Bleed'],
            ratio: 1
          }, {
            type: 'exact swing',
            criteria: ['Prox DVT', 'Dist DVT'],
            ratio: 1
          }];
          validity = workspaceService.validateWorkspace(inconsistentSelfReference);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent exact weighting preferences');
        });
      });
    });

    describe('percentifyScales', function() {
      it('should convert proportions to percentages where possible, ignoring scales for excluded datasources', function() {
        var criteria = {
          crit1: {
            dataSources: [{
              id: 'ds1',
              unitOfMeasurement: {
                type: 'percentage',
                label: '%'
              },
              scale: [0, 1]
            }]
          },
          crit2: {
            dataSources: [{
              id: 'ds2',
              unitOfMeasurement: {
                type: 'custom',
                label: 'anything'
              },
              scale: [-Infinity, Infinity]
            }]
          }
        };
        var observedScales = {
          ds1: {
            alt1: {
              lowerBound: 0.2,
              median: 0.5,
              upperBound: 0.99,
              mode: 0.51
            }
          },
          ds2: {
            alt1: {
              lowerBound: 0.2,
              median: 0.5,
              upperBound: 0.99,
              mode: 0.51
            }
          },
          dsExcluded: {
            alt1: {}
          }
        };
        var result = workspaceService.percentifyScales(criteria, observedScales);
        var expectedResult = {
          ds1: {
            alt1: {
              lowerBound: 20,
              median: 50,
              upperBound: 99,
              mode: 51
            }
          },
          ds2: {
            alt1: {
              lowerBound: 0.2,
              median: 0.5,
              upperBound: 0.99,
              mode: 0.51
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('percentifyCriteria', function() {
      it('should convert datasource scales and pvf ranges to percentages where appropriate', function() {
        var state = {
          problem: {
            criteria: {
              crit1: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: 'Proportion',
                    type: 'decimal'
                  },
                  scale: [0, 1],
                  pvf: {
                    range: [15, 16]
                  }
                }, {
                  unitOfMeasurement: {
                    label: 'Proportion',
                    type: 'decimal'
                  },
                  scale: [0, 1]
                }]
              },
              crit2: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: 'Proportion',
                    type: 'decimal'
                  },
                  scale: [0, 1],
                  pvf: {}
                }, {
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  },
                  scale: [0, 100],
                  pvf: {
                    range: [0.3, 0.4]
                  }
                }]
              },
              crit3: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: 'keepUnit',
                    type: 'custom'
                  },
                  scale: [-Infinity, Infinity],
                  pvf: {
                    range: [10, 20]
                  }
                }]
              }
            }
          }
        };

        var result = workspaceService.percentifyCriteria(state);

        var expectedResult = {
          problem: {
            criteria: {
              crit1: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  },
                  scale: [0, 100],
                  pvf: {
                    range: [1500, 1600]
                  }
                }, {
                  scale: [0, 100],
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  },
                }]
              },
              crit2: {
                dataSources: [{
                  scale: [0, 100],
                  pvf: {},
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  },
                }, {
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  },
                  scale: [0, 100],
                  pvf: {
                    range: [30, 40]
                  }
                }]
              },
              crit3: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: 'keepUnit',
                    type: 'custom'
                  },
                  scale: [-Infinity, Infinity],
                  pvf: {
                    range: [10, 20]
                  }
                }]
              }
            }
          }
        };

        expect(result).toEqual(expectedResult);
      });
    });

    describe('dePercentifyCriteria', function() {
      it('should convert datasource scales and pvf ranges from percentages where appropriate', function() {
        var state = {
          problem: {
            criteria: {
              crit1: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: 'proportion',
                    type: 'custom'
                  },
                  scale: [10, 20],
                  pvf: {
                    range: [15, 16]
                  }
                }, {
                  scale: [0, 100],
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  }
                }]
              },
              crit2: {
                dataSources: [{
                  scale: [0, 100],
                  pvf: {},
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  }
                }, {
                  scale: [0, 100],
                  pvf: {
                    range: [0.3, 0.4]
                  },
                  unitOfMeasurement: {
                    label: '%',
                    type: 'percentage'
                  }
                }]
              },
              crit3: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: 'keepUnit',
                    type: 'custom'
                  },
                  scale: [-Infinity, Infinity],
                  pvf: {
                    range: [10, 20]
                  }
                }]
              }
            }
          }
        };

        var result = workspaceService.dePercentifyCriteria(state);

        var expectedResult = {
          problem: {
            criteria: {
              crit1: {
                dataSources: [{
                  unitOfMeasurement: {
                    type: 'custom',
                    label: 'proportion'
                  },
                  scale: [10, 20],
                  pvf: {
                    range: [15, 16]
                  }
                }, {
                  scale: [0, 1],
                  unitOfMeasurement: {
                    label: 'Proportion',
                    type: 'decimal'
                  }
                }]
              },
              crit2: {
                dataSources: [{
                  scale: [0, 1],
                  pvf: {},
                  unitOfMeasurement: {
                    label: 'Proportion',
                    type: 'decimal'
                  }
                }, {
                  scale: [0, 1],
                  pvf: {
                    range: [0.3, 0.4]
                  },
                  unitOfMeasurement: {
                    label: 'Proportion',
                    type: 'decimal'
                  }
                }]
              },
              crit3: {
                dataSources: [{
                  unitOfMeasurement: {
                    label: 'keepUnit',
                    type: 'custom'
                  }, scale: [-Infinity, Infinity],
                  pvf: {
                    range: [10, 20]
                  }
                }]
              }
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('checkForMissingValuesInPerformanceTable', function() {
      it('should return true is there is at least one missing value for both the effect and distribution of a table entry', function() {
        var performanceTable = [{
          performance: {
            effect: {
              type: 'empty'
            },
            distribution: {
              type: 'empty'
            }
          }
        }];
        var result = workspaceService.checkForMissingValuesInPerformanceTable(performanceTable);
        expect(result).toBeTruthy();
      });

      it('should return false if each entry has atleast one non-empty effect or distribution', function() {
        var performanceTable = [{
          performance: {
            effect: {
              type: 'empty'
            },
            distribution: {
              type: 'dbeta'
            }
          }
        }, {
          performance: {
            effect: {
              type: 'exact'
            },
            distribution: {
              type: 'empty'
            }
          }
        }];
        var result = workspaceService.checkForMissingValuesInPerformanceTable(performanceTable);
        expect(result).toBeFalsy();
      });
    });
  });
});
