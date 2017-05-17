'use strict';
define(['angular', 'angular-mocks', 'mcda/services/workspaceService'], function() {


  describe('The WorkspaceService, ', function() {
    var workspaceService;
    var scalesServiceMock = jasmine.createSpyObj('ScalesService', ['getObservedScales']);

    beforeEach(module('elicit.workspaceService', function($provide) {
      $provide.value('ScalesService', scalesServiceMock);
    }));

    beforeEach(inject(function(WorkspaceService) {
      workspaceService = WorkspaceService;

    }));


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
        console.log(JSON.stringify(result));
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
            criterionUri: 'critId1'
          }, {
            criterionUri: 'critId2'
          }, {
            criterionUri: 'critId4'
          }]
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
          excludedCriteria: ['critId1']
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
          performanceTable: [{
            criterionUri: 'critId2'
          }, {
            criterionUri: 'critId4'
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });


    describe('buildAggregateProblem', function() {
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
            criterionUri: 'critId1'
          }, {
            criterionUri: 'critId2'
          }, {
            criterionUri: 'critId4'
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
            criteria: {
              
            }
          }
        };
        var result = workspaceService.buildAggregateProblem(problem, subProblem, scenario);
        var expectedResult = {
          criteria: {
            critId1: {
              pvf: {
                range: [0, 1]
              }
            },
            critId2: {
              pvf: {
                range: [2, 3]
              }
            }
          },
          performanceTable: {}
        };
        expect(result).toEqual(expectedResult);
      });

    });

  });
});
