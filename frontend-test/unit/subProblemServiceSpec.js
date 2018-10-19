'use strict';
define(['angular', 'angular-mocks', 'mcda/subProblem/subProblem'], function(angular) {
  describe('The SubProblemService', function() {
    var subProblemService;
    beforeEach(angular.mock.module('elicit.subProblem'));
    beforeEach(inject(function(SubProblemService) {
      subProblemService = SubProblemService;
    }));

    describe('createSubProblemCommand', function() {
      it('should create a command ready for the backend to store', function() {
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
          title: 'subProblemTitle',
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
        var choices = {
          ds1: {
            from: 1,
            to: 2
          }
        };
        var result = subProblemService.createSubProblemCommand(subProblemState, choices, problem);
        var expectedResult = {
          definition: {
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
          },
          title: 'subProblemTitle',
          scenarioState: {
            prefs: {
              headacheId: {}
            }
          }
        }; expect(result).toEqual(expectedResult);
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

    describe('checkScaleRanges', function() {
      it('should check wether there are no missing scale ranges', function() {
        var criteria1 = {
          crit1: {
            dataSources: [{

            }]
          }
        };
        var criteria2 = {
          crit2: {
            dataSources: [{
              pvf: {}
            }]
          }
        };
        var criteria3 = {
          crit3: {
            dataSources: [{
              pvf: {
                range: []
              }
            }]
          }
        };
        var criteria4 = {
          crit4: {
            dataSources: [{
              pvf: {
                range: [1]
              }
            }]
          }
        };
        var criteria5 = {
          crit5: {
            dataSources: [{
              pvf: {
                range: [1, 0]
              }
            }]
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
              { id: 'ds3' },
              { id: 'ds4' }
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

    describe('areValuesMissingInEffectsTable', function() {
      var subProblemState = {
        dataSourceInclusions: { 'ds1': true },
        alternativeInclusions: { 'alt1': true }
      };

      it('should return truthy if there is a missing scale for the included datasources+alternatives', function() {
        var scales = {
          ds1: {
            alt1: {}
          }
        };
        var result = subProblemService.areValuesMissingInEffectsTable(subProblemState, scales);
        expect(result).toBeTruthy();
      });

      it('should return truthy if there is a NaN scale for the included datasources+alternatives', function() {
        var scales = {
          ds1: {
            alt1: { '50%': NaN }
          }
        };
        var result = subProblemService.areValuesMissingInEffectsTable(subProblemState, scales);
        expect(result).toBeTruthy();
      });

      it('should return truthy if there is a null scale for the included datasources+alternatives', function() {
        var scales = {
          ds1: {
            alt1: { '50%': null }
          }
        };
        var result = subProblemService.areValuesMissingInEffectsTable(subProblemState, scales);
        expect(result).toBeTruthy();
      });
      it('should return falsy if there no missing or invalid values', function() {
        var scales = {
          ds1: {
            alt1: { '50%': 5 }
          }
        };
        var result = subProblemService.areValuesMissingInEffectsTable(subProblemState, scales);
        expect(result).toBeFalsy();
      });
    });

    describe('hasInvalidSlider', function() {
      it('should return truthy if any value at an invalid location', function() {
        var scalesDataSources = ['ds1'];
        var choices = {
          ds1: {
            from: 1,
            to: 2
          }
        };
        var scalesState = {
          ds1: {
            sliderOptions: {
              restrictedRange: {
                from: 2,
                to: 3
              }
            }
          }
        };
        var result = subProblemService.hasInvalidSlider(scalesDataSources, choices, scalesState);
        expect(result).toBeTruthy();
      });

      it('should return falsy if all values are within their correct ranges', function() {
        var scalesDataSources = ['ds1'];
        var choices = {
          ds1: {
            from: 1,
            to: 4
          }
        };
        var scalesState = {
          ds1: {
            sliderOptions: {
              restrictedRange: {
                from: 2,
                to: 3
              }
            }
          }
        };
        var result = subProblemService.hasInvalidSlider(scalesDataSources, choices, scalesState);
        expect(result).toBeFalsy();
      });
    });

    describe('getNumberOfDataSourcesPerCriterion', function() {
      it('should return the number of included datasources per criteria', function() {
        var criteria = {
          crit1: {
            dataSources: [
              { id: 'ds1' },
              { id: 'ds2' },
              { id: 'notIncluded' }
            ]
          },
          crit2: {
            dataSources: [{ id: 'ds3' }]
          }
        };
        var dataSourceInclusions = {
          ds1: true,
          ds2: true,
          ds3: true
        };
        var result = subProblemService.getNumberOfDataSourcesPerCriterion(criteria, dataSourceInclusions);
        var expectedResult = {
          crit1: 2,
          crit2: 1
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('areTooManyDataSourcesSelected', function() {
      it('return truthy if there is atleast one criterion with multiple selected datasources', function() {
        var numberOfDataSourcesPerCriterion = {
          crit1: 0,
          crit2: 1,
          crit3: 2
        };
        var result = subProblemService.areTooManyDataSourcesSelected(numberOfDataSourcesPerCriterion);
        expect(result).toBeTruthy();
      });
      it('should return falsy if there is no criterion with multiple datasources selected', function() {
        var numberOfDataSourcesPerCriterion = {
          crit1: 0,
          crit2: 1,
          crit3: 1
        };
        var result = subProblemService.areTooManyDataSourcesSelected(numberOfDataSourcesPerCriterion);
        expect(result).toBeFalsy();
      });
    });

    describe('getCriteriaByDataSource', function() {
      it('should return the criterion ids keyed by their datasource ids', function() {
        var criteria = [{
          id: 'crit1',
          dataSources: [{ id: 'ds1.1' }, { id: 'ds1.2' }]
        }, {
          id: 'crit2',
          dataSources: [{ id: 'ds2' }]
        }];
        var result = subProblemService.getCriteriaByDataSource(criteria);
        var expectedResult = {
          'ds1.1': 'crit1',
          'ds1.2': 'crit1',
          ds2: 'crit2'
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createSubProblemState', function() {
      it('should return a sub problem state', function() {
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
          },
          alternatives: {
            alt1: {},
            alt2: {},
            alt3: {}
          }
        };
        var subProblem = {
          definition: {
            excludedCriteria: ['crit2'],
            excludedAlternatives: ['alt2'],
            excludedDataSources: ['ds2'],
            ranges: {
              crit1: [0, 1],
              crit2: [0, 1],
              crit3: [0, 1]
            }
          }
        };
        var criteria = [{
          id: 'crit1'
        }, {
          id: 'crit2'
        }, {
          id: 'crit3'
        }];
        var result = subProblemService.createSubProblemState(problem, subProblem, criteria);
        var expectedResult = {
          criterionInclusions: {
            crit1: true,
            crit2: false,
            crit3: true
          },
          alternativeInclusions: {
            alt1: true,
            alt2: false,
            alt3: true
          },
          dataSourceInclusions: {
            ds1: true,
            ds2: false,
            ds3: true,
            ds4: true
          },
          ranges: {
            crit1: [0, 1],
            crit2: [0, 1],
            crit3: [0, 1]
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
