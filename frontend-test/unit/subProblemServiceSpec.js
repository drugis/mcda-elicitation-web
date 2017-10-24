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
          alternativeInclusions: {
            aspirine: true,
            paracetamol: false
          },
          ranges: {
            headacheId: {
              pvf: {
                range: [1, 2]
              }
            }
          }
        };
        var scales = {
          headacheId: {
            from: 1,
            to: 2
          }
        };
        var result = subProblemService.createDefinition(problem, subProblemState, scales);
        var expectedResult = {
          ranges: {
            headacheId: {
              pvf: {
                range: [1, 2]
              }
            }
          },
          excludedCriteria: ['nauseaId'],
          excludedAlternatives: ['paracetamol']
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('determineBaseline', function() {
      it('should determine the baseline alternative', function() {
        var performanceTable = [{
          performance: {
            parameters: {
              baseline: {
                name: 'Placebo'
              }
            }
          }
        }];
        var alternatives = {
          placebo: { title: 'Placebo' },
          fluox: { title: 'Fluoxitine' },
          parox: { title: 'Paroxitine' }
        };
        var expectedResult = {
          placebo: true
        };
        var result = subProblemService.determineBaseline(performanceTable, alternatives);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});