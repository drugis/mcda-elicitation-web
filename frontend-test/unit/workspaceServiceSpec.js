'use strict';
define(['lodash', 'angular', 'angular-mocks', 'mcda/workspace/workspace', 'mcda/misc'], function(_) {
  describe('The WorkspaceService, ', function() {
    var workspaceService;
    beforeEach(module('elicit.workspace', function($provide) {
      $provide.value('ScalesService', scalesServiceMock);
    }));

    beforeEach(inject(function(WorkspaceService) {
      workspaceService = WorkspaceService;
    }));

    var scalesServiceMock = jasmine.createSpyObj('ScalesService', ['getObservedScales']);

    describe('buildValueTree', function() {
      it('should build the value tree from the problem criteria',
        inject(function(WorkspaceService) {
          var problem = {
            criteria: {
              'crit 1': 'val1',
              'crit 2': 'val2',
            }
          };
          var result = WorkspaceService.buildValueTree(problem);
          expect(result.title).toEqual('Overall value');
          expect(result.criteria).toEqual(['crit 1', 'crit 2']);
        }));

      it('should pass back the old valueTree if the problem already has a valueTree',
        inject(function(WorkspaceService) {
          var valueTree = {
            title: 'old tree'
          };
          var problem = {
            criteria: {
              'crit 1': 'val1',
              'crit 2': 'val2',
            },
            valueTree: valueTree
          };
          var result = WorkspaceService.buildValueTree(problem);
          expect(result).toEqual(valueTree);
        }));
    });

    describe('buildTheoreticalScales', function() {
      it('should build theoretical scales', inject(function(WorkspaceService) {
        var problem = {
          criteria: {
            'crit1': {
              dataSources: [{
                id: 'ds1'
              }]
            },
            'crit2': {
              dataSources:[{
                id: 'ds2',
                scale: [
                  10,
                  20
                ]
              }]
            }
          }
        };
        var result = WorkspaceService.buildTheoreticalScales(problem);
        expect(result.ds1[0]).toBe(-Infinity);
        expect(result.ds1[1]).toBe(Infinity);
        expect(result.ds2[0]).toBe(problem.criteria.crit2.dataSources[0].scale[0]);
        expect(result.ds2[1]).toBe(problem.criteria.crit2.dataSources[0].scale[1]);
      }));
    });

    describe('getObservedScales', function() {
      it('should call the pataviService', function() {
        workspaceService.getObservedScales({
          scopething: 'bla'
        }, {
            criteria: {
              crit1: {
                dataSources: [{ id: 'ds1' }]
              }
            }, performanceTable: [
              {
                criterion: 'crit1',
                dataSource: 'ds1'
              }
            ]
          });
        expect(scalesServiceMock.getObservedScales).toHaveBeenCalledWith({
          scopething: 'bla'
        }, {
            criteria: {
              ds1: {
                id: 'ds1'
              }
            }, performanceTable: [
              {
                criterion: 'ds1',
                dataSource: 'ds1'
              }
            ]
          });
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
            dataSource: 'ds1',
            performance: {
              type: 'exact'
            }
          }, {
            criterion: 'critId2',
            dataSource: 'ds2',
            performance: {
              type: 'exact'
            }
          }, {
            criterion: 'critId2',
            dataSource: 'ds3',
            performance: {
              type: 'exact'
            }
          }, {
            criterion: 'critId4',
            dataSource: 'ds4',
            performance: {
              type: 'dbeta',
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
            criterion: 'critId2',
            dataSource: 'ds2',
            performance: {
              type: 'exact'
            }
          }, {
            criterion: 'critId4',
            dataSource: 'ds4',
            performance: {
              type: 'dbeta',
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
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildAggregateState', function() {
      it('should aggregate the problem with the subproblem and the scenario', function() {
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
                id: 'critId2',
                w: 'w_{1}',
                dataSources: [{
                  id: 'ds2',
                  pvf: {
                    range: [2, 3]
                  }
                }]
              },
              critId4: {
                id: 'critId4',
                w: 'w_{2}',
                dataSources: [{
                  id: 'ds4',
                  pvf: {
                    range: [6, 7]
                  }
                }]
              }
            },
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
            crit1: { dataSources: [{id: 'ds1'}] },
            crit2: { dataSources: [{id: 'ds2'}] }
          }
        };

        var result = workspaceService.setDefaultObservedScales(problem, scales.observed);

        var expectedProblem = {
          criteria: {
            crit1: {
              dataSources: [{
                id:'ds1',
                pvf: {
                  range: [1, 6]
                }
              }]
            },
            crit2: {
              dataSources: [{
                id:'ds2',
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
                id:'ds1',
                pvf: {
                  range: [3, 5]
                }
              }]
            },
            crit2: {
              dataSources: [{
                id:'ds2',
              }]
            }
          }
        };

        var result = workspaceService.setDefaultObservedScales(problem, scales.observed);

        var expectedProblem = {
          criteria: {
            crit1: {
              dataSources: [{
                id:'ds1',
                pvf: {
                  range: [3, 5]
                }
              }]
            },
            crit2: {
              dataSources: [{
                id:'ds2',
                pvf: {
                  range: [7, 12]
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
          expect(validityWithoutTitle.errorMessage).toBe("Missing workspace property: title");
          var withoutCriteriaAndAlternatives = _.omit(example, ['criteria', 'alternatives']);
          var validitywithoutCriteriaAndAlternatives = workspaceService.validateWorkspace(withoutCriteriaAndAlternatives);
          expect(validitywithoutCriteriaAndAlternatives.isValid).toBeFalsy();
          expect(validitywithoutCriteriaAndAlternatives.errorMessage).toBe("Missing workspace properties: criteria, alternatives");
        });
        it('should fail if there are fewer than 2 criteria', function() {
          var example = exampleProblem();
          var exampleWithOneCriterion = _.cloneDeep(example);
          delete exampleWithOneCriterion.criteria.Bleed;
          delete exampleWithOneCriterion.criteria['Prox DVT'];
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
              type: 'dbeta',
              parameters: { alpha: 5, beta: 124 }
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
              type: 'dbeta',
              parameters: { alpha: 5, beta: 124 }
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
          delete problemWithMissingBaseline.performanceTable[0].performance.parameters.baseline;
          var validity = workspaceService.validateWorkspace(problemWithMissingBaseline);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Missing baseline for criterion: "crit1"');
        });
        it('should fail when the mu refers to a nonexistent alternative', function() {
          var problemWithNonsenseMu = _.cloneDeep(exampleRelativeProblem());
          var mu = problemWithNonsenseMu.performanceTable[0].performance.parameters.relative.mu;
          delete mu['4939'];
          mu.nonsense = 3;
          var validity = workspaceService.validateWorkspace(problemWithNonsenseMu);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('The mu of the performance of criterion: "crit1" refers to nonexistent alternative: "nonsense"');
        });
        it('should fail when the cov rownames or colnames refer to a nonexistent alternative', function() {
          var problemWithNonsenseRowName = _.cloneDeep(exampleRelativeProblem());
          var cov = problemWithNonsenseRowName.performanceTable[0].performance.parameters.relative.cov;
          cov.rownames[0] = 'nonsense';
          var validity = workspaceService.validateWorkspace(problemWithNonsenseRowName);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('The covariance matrix of criterion: "crit1" refers to nonexistent alternative: "nonsense"');
          var problemWithNonsenseColName = _.cloneDeep(exampleRelativeProblem());
          cov = problemWithNonsenseColName.performanceTable[0].performance.parameters.relative.cov;
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
          }];
          var validity = workspaceService.validateWorkspace(consistentOrdinal);
          expect(validity.isValid).toBeTruthy();
          expect(validity.errorMessage).toBe(undefined);
        });
        it('should fail if ordinal preferences are inconsistent', function() {
          var inconsistentOrdinalWithTree = _.cloneDeep(exampleProblem());
          inconsistentOrdinalWithTree.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Bleed', 'Dist DVT']
          }];
          var validity = workspaceService.validateWorkspace(inconsistentOrdinalWithTree);
          expect(validity.isValid).toBeFalsy();
          expect(validity.errorMessage).toBe('Inconsistent ordinal preferences');
          var inconsistentOrdinalCycle = _.cloneDeep(exampleProblem());
          inconsistentOrdinalCycle.preferences = [{
            type: 'ordinal',
            criteria: ['Bleed', 'Prox DVT']
          }, {
            type: 'ordinal',
            criteria: ['Prox DVT', 'Bleed']
          }];
          validity = workspaceService.validateWorkspace(inconsistentOrdinalCycle);
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
  });
});
