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
        var subProblemState = {
          criterionInclusions: {
            headacheId: true,
            nauseaId: false
          },
          alternativeInclusions: {
            aspirine: true,
            paracetamol: false
          },
          dataSourceInclusions: {
            ds1: true,
            ds2: false
          },
          ranges: {
            ds1: {
              pvf: {
                range: [1, 2]
              }
            }
          }
        };
        var scales = {
          ds1: {
            from: 1,
            to: 2
          }
        };
        var result = subProblemService.createDefinition(subProblemState, scales);
        var expectedResult = {
          ranges: {
            ds1: {
              pvf: {
                range: [1, 2]
              }
            }
          },
          excludedCriteria: ['nauseaId'],
          excludedAlternatives: ['paracetamol'],
          excludedDataSources: ['ds2']
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
                name: 'placebo'
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

    describe('createCriterionInclusions', function() {
      it('should return the criterion inclusions based on the current subproblem', function() {
        var problem = {
          criteria: {
            crit1: {},
            crit2: {},
            crit3: {}
          }
        };
        var subProblem = {
          definition: {
            excludedCriteria: ['crit2']
          }
        };
        var expectedResult = {
          crit1: true,
          crit2: false,
          crit3: true
        };
        var result = subProblemService.createCriterionInclusions(problem, subProblem);
        expect(result).toEqual(expectedResult);
      });
    });
    describe('createAlternativeInclusions', function() {
      it('should return the alternative inclusions based on the current subproblem', function() {
        var problem = {
          alternatives: {
            alt1: {},
            alt2: {},
            alt3: {}
          }
        };
        var subProblem = {
          definition: {
            excludedAlternatives: ['alt2']
          }
        };
        var expectedResult = {
          alt1: true,
          alt2: false,
          alt3: true
        };
        var result = subProblemService.createAlternativeInclusions(problem, subProblem);
        expect(result).toEqual(expectedResult);
      });
    });
    describe('createDataSourceInclusions', function() {
      it('should return the data source inclusions based on the current subproblem', function() {
        var problem = {
          criteria: {
            crit1: {
              dataSources: [
                { id: 'ds1' }
              ]
            },
            crit2: {
              dataSources: [
                { id: 'ds2' },
                { id: 'ds3' }
              ]
            },
            crit3: {
              dataSources: [
                { id: 'ds4' }
              ]
            }
          }
        };
        var subProblem = {
          definition: {
            excludedDataSources: ['ds2']
          }
        };
        var expectedResult = {
          ds1: true,
          ds2: false,
          ds3: true,
          ds4: true
        };
        var result = subProblemService.createDataSourceInclusions(problem, subProblem);
        expect(result).toEqual(expectedResult);
      });
    });
    describe('checkScaleRanges', function() {
      it('should check wether there are no missing scale ranges', function() {
        var criteria1 = {
          crit1: {}
        };
        var criteria2 = {
          crit2: {
            pvf: {}
          }
        };
        var criteria3 = {
          crit3: {
            pvf: {
              range: []
            }
          }
        };
        var criteria4 = {
          crit4: {
            pvf: {
              range: [1]
            }
          }
        };
        var criteria5 = {
          crit5: {
            pvf: {
              range: [1, 0]
            }
          }
        };
        expect(subProblemService.checkScaleRanges(criteria1)).toBeFalsy();
        expect(subProblemService.checkScaleRanges(criteria2)).toBeFalsy();
        expect(subProblemService.checkScaleRanges(criteria3)).toBeFalsy();
        expect(subProblemService.checkScaleRanges(criteria4)).toBeFalsy();
        expect(subProblemService.checkScaleRanges(criteria5)).toBeTruthy();
      });
    });

    describe('excludeDataSourcesForExcludedCriteria', function() {
      it('should exclude data sources when their criterion is excluded', function() {
        var criteria = {
          crit1: {
            dataSources: [
              { id: 'ds1' },
            ]
          },
          crit2: {
            dataSources: [
              { id: 'ds2' }
            ]
          },
          crit3: {
            dataSources: [
              { id: 'ds3'},
              { id: 'ds4'}
            ]
          }
        };
        var subProblemState = {
          criterionInclusions: {
            crit1: true,
            crit2: false,
            crit3: true
          },
          dataSourceInclusions: {
            ds1: true,
            ds2: true,
            ds3: false,
            ds4: false
          }
        };
        var result = subProblemService.excludeDataSourcesForExcludedCriteria(criteria, subProblemState);
        var expectedResult = {
          ds1: true,
          ds2: false,
          ds3: true,
          ds4: true
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
