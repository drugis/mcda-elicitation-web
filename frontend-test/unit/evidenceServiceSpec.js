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
  });
});