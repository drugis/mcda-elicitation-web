'use strict';
define(['angular', 'angular-mocks', 'mcda/workspace/workspace'], function() {
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
            'crit1': {},
            'crit2': {
              scale: [
                10,
                20
              ]
            }
          }
        };
        var result = WorkspaceService.buildTheoreticalScales(problem);
        expect(result.crit1[0]).toBe(-Infinity);
        expect(result.crit1[1]).toBe(Infinity);
        expect(result.crit2[0]).toBe(problem.criteria.crit2.scale[0]);
        expect(result.crit2[1]).toBe(problem.criteria.crit2.scale[1]);
      }));
    });

    describe('getObservedScales', function() {
      it('should call the pataviService', function() {
        workspaceService.getObservedScales({
          scopething: 'bla'
        }, {
          problemthing: 'alb'
        });
        expect(scalesServiceMock.getObservedScales).toHaveBeenCalledWith({
          scopething: 'bla'
        }, {
          problemthing: 'alb'
        });
      });

    });

    describe('mergeBaseAndSubProblem', function() {
      it('should create a new problem from the original problem with the sub problem merged into it', function() {
        var problem = {
          criteria: {
            critId1: {
              pvf: {
                range: [4, 5]
              }
            },
            critId2: {},
            critId4: {}
          },
          performanceTable: [{
            criterion: 'critId1',
            performance: {
              type: 'exact'
            }
          }, {
            criterion: 'critId2',
            performance: {
              type: 'exact'
            }
          }, {
            criterion: 'critId4',
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
            critId2: {
              pvf: {
                range: [2, 3]
              }
            },
            critId4: {
              pvf: {
                range: [6, 7]
              }
            }
          },
          excludedCriteria: ['critId1'],
          excludedAlternatives: ['alt1']
        };
        var result = workspaceService.mergeBaseAndSubProblem(problem, subProblemDefinition);
        var expectedResult = {
          criteria: {
            critId2: {
              pvf: {
                range: [2, 3]
              }
            },
            critId4: {
              pvf: {
                range: [6, 7]
              }
            }
          },
          alternatives: {
            alt2: 'altId2',
            alt3: 'altId3'
          },
          performanceTable: [{
            criterion: 'critId2',
            performance: {
              type: 'exact'
            }
          }, {
            criterion: 'critId4',
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
              pvf: {
                range: [4, 5]
              }
            },
            critId2: {},
            critId4: {}
          },
          performanceTable: [{
            criterion: 'critId1'
          }, {
            criterion: 'critId2'
          }, {
            criterion: 'critId4'
          }]
        };
        var subProblem = {
          definition: {
            ranges: {
              critId2: {
                pvf: {
                  range: [2, 3]
                }
              },
              critId4: {
                pvf: {
                  range: [6, 7]
                }
              }
            },
            excludedCriteria: ['critId1']
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
                pvf: {
                  range: [2, 3]
                }
              },
              critId4: {
                id: 'critId4',
                w: 'w_{2}',
                pvf: {
                  range: [6, 7]
                }
              }
            },
            performanceTable: [{
              criterion: 'critId2'
            }, {
              criterion: 'critId4'
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
            crit1: {
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
            crit2: {
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
            crit1: {},
            crit2: {}
          }
        };

        var result = workspaceService.setDefaultObservedScales(problem, scales.observed);

        var expectedProblem = {
          criteria: {
            crit1: {
              pvf: {
                range: [1, 6]
              }
            },
            crit2: {
              pvf: {
                range: [7, 12]
              }
            }
          }
        };
        expect(result).toEqual(expectedProblem);
      });
      it('should not override already-configured scale ranges on the problem or subproblem', function() {
        var scales = {
          observed: {
            crit1: {
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
            crit2: {
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
              pvf: {
                range: [3, 5]
              }
            },
            crit2: {}
          }
        };

        var result = workspaceService.setDefaultObservedScales(problem, scales.observed);

        var expectedProblem = {
          criteria: {
            crit1: {
              pvf: {
                range: [3,
                  5
                ]
              }
            },
            crit2: {
              pvf: {
                range: [7, 12]
              }
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
            crit1: { },
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
            pvf: {
              range: [1, 2],
              direction: 'decreasing'
            }
          },
          crit2: {},
          crit3: {}
        },
        performanceTable: [{
          criterion: 'crit1'
        }, {
          criterion: 'crit2'
        }]
      };
      var subProblem = {
        definition: {
          ranges: {
            crit1: {
              pvf: {
                range: [1, 2]
              }
            },
            crit2: {
              pvf: {
                range: [4, 5]
              }
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
                  pvf: {
                    range: [4, 5],
                    direction: 'increasing'
                  }
                },
                crit3: {
                  pvf: {
                    range: [5, 6],
                    direction: 'increasing'
                  }
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
                  pvf: {
                    range: [4, 5],
                    direction: 'increasing'
                  }
                },
                crit3: {
                  pvf: {
                    range: [5, 6],
                    direction: 'increasing'
                  }
                }
              }
            }
          }
        }];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});