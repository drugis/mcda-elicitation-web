'use strict';
define(['angular', 'angular-mocks', 'mcda/subProblem/subProblem'], function (
  angular
) {
  describe('The SubProblemService', () => {
    var subProblemService;
    var getDataSourcesByIdMock = jasmine.createSpy();

    beforeEach(
      angular.mock.module('elicit.subProblem', function ($provide) {
        $provide.value('getDataSourcesById', getDataSourcesByIdMock);
      })
    );

    beforeEach(inject(function (SubProblemService) {
      subProblemService = SubProblemService;
    }));

    describe('createSubProblemCommand', () => {
      it('should create a command ready for the backend to store', () => {
        const dataSourcesById = {
          ds1: {
            unitOfMeasurement: {
              type: 'custom'
            }
          }
        };
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);
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
        var result = subProblemService.createSubProblemCommand(
          subProblemState,
          choices,
          problem
        );
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
            problem: {criteria: {}},
            prefs: []
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should the scale ranges which are percentage to decimals', function () {
        const dataSourcesById = {
          ds1: {
            id: 'ds1',
            unitOfMeasurement: {
              type: 'percentage'
            }
          },
          ds2: {
            id: 'ds2',
            unitOfMeasurement: {
              type: 'percentage'
            }
          },
          ds3: {
            id: 'ds3',
            unitOfMeasurement: {
              type: 'decimal'
            }
          }
        };
        getDataSourcesByIdMock.and.returnValue(dataSourcesById);
        var problem = {
          criteria: {
            headacheId: {
              dataSources: [
                dataSourcesById.ds1,
                dataSourcesById.ds2,
                dataSourcesById.ds3
              ]
            }
          },
          preferences: {
            headacheId: {}
          }
        };
        var subProblemState = {
          title: 'subProblemTitle',
          criterionInclusions: {
            headacheId: true
          },
          alternativeInclusions: {
            aspirine: true
          },
          dataSourceInclusions: {
            ds1: true,
            ds2: true,
            ds3: true
          },
          ranges: {
            ds1: {
              pvf: {
                range: [1, 2]
              }
            },
            ds2: {
              pvf: {
                range: [1, 2]
              }
            },
            ds3: {
              pvf: {
                range: [0.01, 0.02]
              }
            }
          }
        };

        var choices = {
          ds1: {
            from: 1,
            to: 2
          },
          ds2: {
            from: 1,
            to: 2
          },
          ds3: {
            from: 0.01,
            to: 0.02
          }
        };

        var result = subProblemService.createSubProblemCommand(
          subProblemState,
          choices,
          problem
        );

        var expectedResult = {
          definition: {
            ranges: {
              ds1: {
                pvf: {
                  range: [0.01, 0.02]
                }
              },
              ds2: {
                pvf: {
                  range: [0.01, 0.02]
                }
              },
              ds3: {
                pvf: {
                  range: [0.01, 0.02]
                }
              }
            },
            excludedCriteria: [],
            excludedAlternatives: [],
            excludedDataSources: []
          },
          title: 'subProblemTitle',
          scenarioState: {
            problem: {criteria: {}},
            prefs: []
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('determineBaseline', () => {
      it('should determine the baseline alternative', () => {
        var performanceTable = [
          {
            performance: {
              parameters: {
                baseline: {
                  name: 'placebo'
                }
              }
            }
          }
        ];
        var alternatives = {
          placebo: {title: 'Placebo'},
          fluox: {title: 'Fluoxitine'},
          parox: {title: 'Paroxitine'}
        };
        var expectedResult = {
          placebo: true
        };
        var result = subProblemService.determineBaseline(
          performanceTable,
          alternatives
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe('excludeDataSourcesForExcludedCriteria', () => {
      it('should exclude data sources when their criterion is excluded', () => {
        var criteria = {
          crit1: {
            dataSources: [{id: 'ds1'}]
          },
          crit2: {
            dataSources: [{id: 'ds2'}]
          },
          crit3: {
            dataSources: [{id: 'ds3'}, {id: 'ds4'}]
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
        var result = subProblemService.excludeDataSourcesForExcludedCriteria(
          criteria,
          subProblemState
        );
        var expectedResult = {
          ds1: true,
          ds2: false,
          ds3: true,
          ds4: true
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getMissingValueWarnings', function () {
      var subProblemState = {
        dataSourceInclusions: {ds1: true},
        alternativeInclusions: {alt1: true}
      };
      var noSMAAWarning =
        'Some cell(s) are missing SMAA values. Deterministic values will be used for these cell(s).';
      var noDeterministicWarning =
        'Some cell(s) are missing deterministic values. SMAA values will be used for these cell(s).';

      it('should return no warnings if all values are present', function () {
        var scales = {
          ds1: {
            alt1: {'50%': 10}
          }
        };
        var performanceTable = [
          {
            alternative: 'alt1',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'value',
                value: 10
              }
            }
          }
        ];
        var warnings = subProblemService.getMissingValueWarnings(
          subProblemState,
          scales,
          performanceTable
        );

        var expectedWarnings = [];
        expect(warnings).toEqual(expectedWarnings);
      });

      it('should warn about missing SMAA values when Deterministic values are present', function () {
        var scales = {
          ds1: {
            alt1: {'50%': null}
          }
        };
        var performanceTable = [
          {
            alternative: 'alt1',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'value',
                value: 10
              }
            }
          }
        ];
        var warnings = subProblemService.getMissingValueWarnings(
          subProblemState,
          scales,
          performanceTable
        );

        var expectedWarnings = [noSMAAWarning];
        expect(warnings).toEqual(expectedWarnings);
      });

      it('should warn about missing deterministic values when SMAA values are present', function () {
        var scales = {
          ds1: {
            alt1: {'50%': 10}
          }
        };
        var performanceTable = [
          {
            alternative: 'alt1',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'empty'
              }
            }
          }
        ];
        var warnings = subProblemService.getMissingValueWarnings(
          subProblemState,
          scales,
          performanceTable
        );

        var expectedWarnings = [noDeterministicWarning];
        expect(warnings).toEqual(expectedWarnings);
      });

      it('should warn about missing deterministic and SMAA values', function () {
        var subProblemStateExtended = {
          dataSourceInclusions: {
            ds1: true
          },
          alternativeInclusions: {
            alt1: true,
            alt2: true
          }
        };
        var scales = {
          ds1: {
            alt1: {'50%': 10},
            alt2: {'50%': null}
          }
        };
        var performanceTable = [
          {
            alternative: 'alt1',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'empty'
              }
            }
          },
          {
            alternative: 'alt2',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'value',
                value: 10
              }
            }
          }
        ];
        var warnings = subProblemService.getMissingValueWarnings(
          subProblemStateExtended,
          scales,
          performanceTable
        );

        var expectedWarnings = [noDeterministicWarning, noSMAAWarning];
        expect(warnings).toEqual(expectedWarnings);
      });
    });

    describe('hasInvalidSlider', () => {
      it('should return truthy if any value at an invalid location', () => {
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
        var result = subProblemService.hasInvalidSlider(
          scalesDataSources,
          choices,
          scalesState
        );
        expect(result).toBeTruthy();
      });
      it('should return truthy if if both choices are the same', () => {
        var scalesDataSources = ['ds1'];
        var choices = {
          ds1: {
            from: 2,
            to: 2
          }
        };
        var scalesState = {
          ds1: {
            sliderOptions: {
              restrictedRange: {
                from: 2,
                to: 2
              }
            }
          }
        };
        var result = subProblemService.hasInvalidSlider(
          scalesDataSources,
          choices,
          scalesState
        );
        expect(result).toBeTruthy();
      });
      it('should return falsy if all values are within their correct ranges', () => {
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
        var result = subProblemService.hasInvalidSlider(
          scalesDataSources,
          choices,
          scalesState
        );
        expect(result).toBeFalsy();
      });
    });

    describe('getNumberOfDataSourcesPerCriterion', () => {
      it('should return the number of included datasources per criteria', () => {
        var criteria = {
          crit1: {
            dataSources: [{id: 'ds1'}, {id: 'ds2'}, {id: 'notIncluded'}]
          },
          crit2: {
            dataSources: [{id: 'ds3'}]
          }
        };
        var dataSourceInclusions = {
          ds1: true,
          ds2: true,
          ds3: true
        };
        var result = subProblemService.getNumberOfDataSourcesPerCriterion(
          criteria,
          dataSourceInclusions
        );
        var expectedResult = {
          crit1: 2,
          crit2: 1
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getCriteriaByDataSource', () => {
      it('should return the criterion ids keyed by their datasource ids', () => {
        var criteria = [
          {
            id: 'crit1',
            dataSources: [{id: 'ds1.1'}, {id: 'ds1.2'}]
          },
          {
            id: 'crit2',
            dataSources: [{id: 'ds2'}]
          }
        ];
        var result = subProblemService.getCriteriaByDataSource(criteria);
        var expectedResult = {
          'ds1.1': criteria[0],
          'ds1.2': criteria[0],
          ds2: criteria[1]
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createSubProblemState', () => {
      it('should return a sub problem state', () => {
        var problem = {
          criteria: {
            crit1: {
              dataSources: [{id: 'ds1'}]
            },
            crit2: {
              dataSources: [{id: 'ds2'}, {id: 'ds3'}]
            },
            crit3: {
              dataSources: [{id: 'ds4'}]
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
        var criteria = [
          {
            id: 'crit1'
          },
          {
            id: 'crit2'
          },
          {
            id: 'crit3'
          }
        ];
        var result = subProblemService.createSubProblemState(
          problem,
          subProblem,
          criteria
        );
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

    describe('excludeDeselectedAlternatives', function () {
      it('should return a performance table without the deselected alternatives', function () {
        var alternativeInclusions = {
          a1: true,
          a2: false
        };
        var performanceTable = [
          {
            alternative: 'a1'
          },
          {
            alternative: 'a2'
          }
        ];

        var result = subProblemService.excludeDeselectedAlternatives(
          performanceTable,
          alternativeInclusions
        );

        var expectedResult = [
          {
            alternative: 'a1'
          }
        ];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('areTooManyDataSourcesIncluded', () => {
      it('return truthy if there is atleast one criterion with multiple selected datasources', () => {
        var criteria = [
          {
            dataSources: [{}, {}]
          }
        ];
        var result = subProblemService.areTooManyDataSourcesIncluded(criteria);
        expect(result).toBeTruthy();
      });

      it('should return falsy if there is no criterion with multiple dataSources selected', () => {
        var criteria = [
          {
            dataSources: [{}]
          }
        ];
        var result = subProblemService.areTooManyDataSourcesIncluded(criteria);
        expect(result).toBeFalsy();
      });
    });

    describe('findRowWithoutValues', function () {
      it('should return false if there is no row without valid values', function () {
        var effectsTableInfo = {
          ds1: {
            alt1: {
              isAbsolute: false
            }
          },
          ds2: {
            alt1: {
              isAbsolute: true,
              effectValue: 5
            }
          },
          ds3: {
            alt1: {
              isAbsolute: true,
              effectValue: ''
            }
          }
        };
        var scales = {
          observed: {
            ds3: {
              alt1: {
                '50%': 123
              }
            }
          }
        };
        var result = subProblemService.findRowWithoutValues(
          effectsTableInfo,
          scales
        );
        expect(result).toBeFalsy();
      });

      it('should return true if there is at least one row without valid values', function () {
        var effectsTableInfo = {
          ds1: {
            alt1: {
              isAbsolute: false
            }
          }
        };
        var scales = {};
        var result = subProblemService.findRowWithoutValues(
          effectsTableInfo,
          scales
        );
        expect(result).toBeFalsy();
      });
    });

    describe('getScaleBlockingWarnings', function () {
      var subProblemState;
      var missingValuesWarning = 'Effects table contains missing values';

      beforeEach(function () {
        subProblemState = {
          dataSourceInclusions: {ds1: true},
          alternativeInclusions: {alt1: true},
          numberOfDataSourcesPerCriterion: {
            crit1: 0,
            crit2: 1,
            crit3: 1
          }
        };
      });

      it('should return a warning if there is a missing scale for the included datasources+alternatives', () => {
        var scales = {
          ds1: {
            alt1: {}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales
        );
        var expectedResult = [missingValuesWarning];
        expect(result).toEqual(expectedResult);
      });

      it('should return a warning if there is a NaN scale for the included datasources+alternatives', () => {
        var scales = {
          ds1: {
            alt1: {'50%': NaN}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales
        );
        var expectedResult = [missingValuesWarning];
        expect(result).toEqual(expectedResult);
      });

      it('should return a warning if there is a null scale for the included datasources+alternatives', () => {
        var scales = {
          ds1: {
            alt1: {'50%': null}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales
        );
        var expectedResult = [missingValuesWarning];
        expect(result).toEqual(expectedResult);
      });

      it('should return no warnings if there are no missing or invalid values', () => {
        var scales = {
          ds1: {
            alt1: {'50%': 5}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales
        );
        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return no warnings if the distribution is missing, but there is an effect value', function () {
        var performanceTable = [
          {
            alternative: 'alt1',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'value',
                value: 10
              }
            }
          }
        ];
        var scales = {
          ds1: {
            alt1: {'50%': null}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales,
          performanceTable
        );
        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return no warnings if the effect is missing, but there is an distribution value', function () {
        var performanceTable = [
          {
            alternative: 'alt1',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'empty'
              }
            }
          }
        ];
        var scales = {
          ds1: {
            alt1: {'50%': 5}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales,
          performanceTable
        );
        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });

      it('should return a warning if both the distribution and effect value are missing', function () {
        var performanceTable = [
          {
            alternative: 'alt1',
            dataSource: 'ds1',
            performance: {
              effect: {
                type: 'empty'
              }
            }
          }
        ];
        var scales = {
          ds1: {
            alt1: {'50%': null}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales,
          performanceTable
        );
        var expectedResult = [missingValuesWarning];
        expect(result).toEqual(expectedResult);
      });

      it('return a warning if there is atleast one criterion with multiple selected datasources', function () {
        var scales = {
          ds1: {
            alt1: {'50%': 5}
          }
        };
        subProblemState.numberOfDataSourcesPerCriterion.crit1 = 3;
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales
        );
        var expectedResult = [
          'Effects table contains multiple data sources per criterion'
        ];
        expect(result).toEqual(expectedResult);
      });

      it('should return no warnings if there is no criterion with multiple datasources selected', function () {
        var scales = {
          ds1: {
            alt1: {'50%': 5}
          }
        };
        var result = subProblemService.getScaleBlockingWarnings(
          subProblemState,
          scales
        );
        var expectedResult = [];
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
