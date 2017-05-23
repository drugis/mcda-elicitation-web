'use strict';
define(['angular-mocks', 'mcda/subProblem/subProblem'], function() {
  describe('The SubProblemService', function() {
    var subProblemService;
    beforeEach(module('elicit.subProblem'));
    beforeEach(inject(function(SubProblemService) {
      subProblemService = SubProblemService;
    }));

    describe('createDefaultScenarioState', function() {
      it('should create a default scenario state based on the subproblem`s criterion selections and scales', function() {
        var problem = {
          criteria: {
            headacheId: {},
            nauseaId: {}
          },
          preferences: {
            headacheId: {},
            nauseaId: {}
          }
        };
        var subProblemState = {
          criterionInclusions: {
            headacheId: true,
            nauseaId: false
          }
        };
        var result = subProblemService.createDefaultScenarioState(problem, subProblemState);
        var expectedResult = {
          prefs: {
            headacheId: {}
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
    describe('createDefinition', function() {
      it('should create the definition for the subproblem', function() {
        var problem = {
          criteria: {
            headacheId: {
              id: 'headacheId'
            },
            nauseaId: {
              id: 'nauseaId'
            }
          },
          preferences: {
            headacheId: {},
            nauseaId: {}
          }
        };
        var subProblemState = {
          criterionInclusions: {
            headacheId: true,
            nauseaId: false
          },
          ranges: {
            headacheId: {
              pvf: {
                range: [1, 2]
              }
            }
          }
        };
        var result = subProblemService.createDefinition(problem, subProblemState);
        var expectedResult = {
          ranges: {
            headacheId: {
              pvf: {
                range: [1, 2]
              }
            }
          },
          excludedCriteria: ['nauseaId']
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
