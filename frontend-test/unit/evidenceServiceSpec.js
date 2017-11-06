'use strict';
define(['angular', 'angular-mocks', 'mcda/evidence/evidence'], function(angular) {
  describe('The evidenceService', function() {
    var evidenceService;
    beforeEach(module('elicit.evidence'));
    beforeEach(inject(function(EvidenceService) {
      evidenceService = EvidenceService;
    }));

    describe('editCriterion', function() {
      it('should simply replace the criterion if the title is unchanged', function() {
        var problem = {
          criteria: {
            oldCrit: {
              title: 'oldCrit',
              description: 'oldDesc'
            }
          },
          performanceTable: [{
            criterion: 'oldCrit',
            alternative: 'altX',
            performance: {
              type: 'exact',
              value: 10
            }
          }]
        };
        var newCriterion = {
          title: 'oldCrit',
          description: 'newDesc'
        };
        var result = evidenceService.editCriterion(problem.criteria.oldCrit, newCriterion, problem);
        var expectedResult = angular.copy(problem);
        expectedResult.criteria.oldCrit.description = newCriterion.description;
        expect(result).toEqual(expectedResult);
      });
      it('should update the performance table as well, if the title of the criterion has changed', function() {
        var problem = {
          criteria: {
            oldCrit: {
              title: 'oldCrit',
              description: 'oldDesc'
            }
          },
          performanceTable: [{
            criterion: 'oldCrit',
            alternative: 'altX',
            performance: {
              type: 'exact',
              value: 10
            }
          }]
        };
        var newCriterion = {
          title: 'newCrit',
          description: 'newDesc'
        };
        var result = evidenceService.editCriterion(problem.criteria.oldCrit, newCriterion, problem);
        var expectedResult = {
          criteria: {
            newCrit: {
              title: 'newCrit',
              description: 'newDesc'
            }
          },
          performanceTable: [{
            criterion: 'newCrit',
            alternative: 'altX',
            performance: {
              type: 'exact',
              value: 10
            }
          }]
        };
        expect(result).toEqual(expectedResult);
      });
    });
    describe('renameCriterionInSubProblems', function() {
      it('should change all references to the old name into the new name of the criterion in all subproblems', function() {
        var subProblems = [{
          id: 1,
          definition: {
            excludedCriteria: ['oldCrit'],
            ranges: {}
          }
        }, {
          id: 2,
          definition: {
            excludedCriteria: [],
            ranges: {
              oldCrit: [0, 1]
            }
          }
        }];
        var oldCriterion = {
          title: 'oldCrit'
        };
        var newCriterion = {
          title: 'newCrit'
        };
        var result = evidenceService.renameCriterionInSubProblems(oldCriterion, newCriterion, subProblems);
        var expectedResult = [{
          id: 1,
          definition: {
            excludedCriteria: ['newCrit'],
            ranges: {}
          }
        }, {
          id: 2,
          definition: {
            excludedCriteria: [],
            ranges: {
              newCrit: [0, 1]
            }
          }
        }];
        expect(result).toEqual(expectedResult);
      });
    });
    describe('renameCriterionInScenarios', function() {
      it('shouldhould change all references to the old name into the new name of the criterion in all scenarios', function() {
        var scenarios = [{
          state: {
            problem: {
              criteria: {
                oldCrit: {
                  title: 'oldCrit'
                }, 
                otherOldCrit: {
                	title: 'otherOldCrit'
                }
              }
            },
            prefs: [{ 
              criteria: ['oldCrit', 'otherOldCrit'],
              type: 'ordinal'
            },{ 
              criteria: ['otherOldCrit', 'oldCrit'],
              type: 'ordinal'
            }]
          }
        }];
        var oldCriterion = {
          title: 'oldCrit'
        };
        var newCriterion = {
          title: 'newCrit'
        };
        var result = evidenceService.renameCriterionInScenarios(oldCriterion, newCriterion, scenarios);
        var expectedResult = [{
          state: {
            problem: {
              criteria: {
                newCrit: {
                  title: 'newCrit'
                }, 
                otherOldCrit: {
                	title: 'otherOldCrit'
                }
              }
            },
            prefs: [{ 
              criteria: ['newCrit', 'otherOldCrit'],
              type: 'ordinal'
            },{ 
              criteria: ['otherOldCrit', 'newCrit'],
              type: 'ordinal'
            }]
          }
        }];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});