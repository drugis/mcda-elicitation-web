'use strict';
define([
  'angular',
  'angular-mocks',
  'mcda/effectsTable/effectsTable'
], function(angular) {
  describe('EffectsTableService', function() {
    var effectTableService;

    beforeEach(angular.mock.module('elicit.effectsTable'));

    beforeEach(inject(function(EffectsTableService) {
      effectTableService = EffectsTableService;
    }));

    describe('EffectsTableService', function() {
      describe('buildEffectsTable', function() {
        it('should return the order of the criterion in the effectstable including the favorability headers if needed', function() {
          var criteria = [{
            id: 'crit1',
            isFavorable: false,
            dataSources: [{
              id: 'ds1id'
            }]
          }, {
            id: 'crit2',
            isFavorable: true,
            dataSources: [{
              id: 'ds2id'
            }]
          }, {
            id: 'crit3',
            isFavorable: true,
            dataSources: [{
              id: 'ds3id'
            }]
          }];
          var result = effectTableService.buildEffectsTable(criteria);
          var expectedResult = [{
            isHeaderRow: true,
            headerText: 'Favorable effects'
          }, {
            criterion: {
              id: 'crit2',
              numberOfDataSources: 1,
              isFavorable: true
            },
            dataSource: {
              id: 'ds2id'
            },
            isFirstRow: true
          }, {
            criterion: {
              id: 'crit3',
              numberOfDataSources: 1,
              isFavorable: true
            },
            dataSource: {
              id: 'ds3id'
            },
            isFirstRow: true
          },
          {
            isHeaderRow: true,
            headerText: 'Unfavorable effects'
          }, {
            criterion: {
              id: 'crit1',
              numberOfDataSources: 1,
              isFavorable: false
            },
            dataSource: {
              id: 'ds1id'
            },
            isFirstRow: true
          }
          ];
          expect(result).toEqual(expectedResult);
        });
        it('should add wether the criterion can be percentage ', function() {
          var criteria = [{
            id: 'crit2',
            dataSources: [{
              id: 'ds2id',
              scale: [0,1]
            }]
          }, {
            id: 'crit3',
            dataSources: [{
              id: 'ds3id',
              scale: [-Infinity, Infinity]
            }]
          }];
          var result = effectTableService.buildEffectsTable(criteria);
          var expectedResult = [{
            criterion: {
              id: 'crit2',
              numberOfDataSources: 1,
              canBePercentage: true
            },
            dataSource: {
              id: 'ds2id',
              scale: [0,1]
            },
            isFirstRow: true
          }, {
            criterion: {
              id: 'crit3',
              numberOfDataSources: 1,
              canBePercentage: false
            },
            dataSource: {
              id: 'ds3id',
              scale: [-Infinity, Infinity]
            },
            isFirstRow: true
          }];
          expect(result).toEqual(expectedResult);
        });
      });

      describe('createEffectsTableInfo', function() {
        it('should build labels for each non-exact, non-relative entry', function() {
          var performanceTable = [{
            criterion: 'criterionId1',
            dataSource: 'dsId1',
            performance: {
              type: 'relative'
            }
          }, {
            criterion: 'criterionId2',
            alternative: 'alternativeId2',
            dataSource: 'dsId2',
            performance: {
              type: 'exact',
              exactType: 'exact',
              value: 1,
              input: {
                value: 1,
                stdErr: 0.5
              }
            }
          }, {
            criterion: 'criterionId3',
            alternative: 'alternativeId3',
            dataSource: 'dsId3',
            performance: {
              type: 'dt',
              parameters: {
                mu: 5,
                stdErr: 1,
                dof: 10
              }

            }
          }, {
            criterion: 'criterionId4',
            alternative: 'alternativeId4',
            dataSource: 'dsId4',
            performance: {
              type: 'dnorm',
              parameters: {
                mu: 6,
                sigma: 2
              }
            }
          }, {
            criterion: 'criterionId5',
            alternative: 'alternativeId5',
            dataSource: 'dsId5',
            performance: {
              type: 'dbeta',
              parameters: {
                alpha: 5,
                beta: 11
              }

            }
          }, {
            criterion: 'criterionId6',
            alternative: 'alternativeId6',
            dataSource: 'dsId6',
            performance: {
              type: 'dsurv',
              parameters: {
                alpha: 10.001,
                beta: 12344321.001
              }
            }
          }, {
            criterion: 'criterionId7',
            alternative: 'alternativeId7',
            dataSource: 'dsId7',
            performance: {
              type: 'dnorm',
              input: {
                value: 42,
                lowerBound: 37,
                upperBound: 69
              }
            }
          }, {
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              type: 'empty'
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId1: {
              distributionType: 'relative',
              hasStudyData: false
            },
            dsId2: {
              distributionType: 'exact',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  label: 1 + ' (' + 0.5 + ')',
                  hasUncertainty: false
                }
              }
            },
            dsId3: {
              distributionType: 'dt',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId3: {
                  label: '5 (1), 11',
                  hasUncertainty: true
                }
              }
            },
            dsId4: {
              distributionType: 'dnorm',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId4: {
                  label: '6 (2)',
                  hasUncertainty: true
                }
              }
            },
            dsId5: {
              distributionType: 'dbeta',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  label: '4 / 14',
                  hasUncertainty: true
                }
              }
            },
            dsId6: {
              distributionType: 'dsurv',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId6: {
                  label: '10 / 12344321',
                  hasUncertainty: true
                }
              }
            },
            dsId7: {
              distributionType: 'dnorm',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId7: {
                  label: '42 (37; 69)',
                  hasUncertainty: true
                }
              }
            },
            dsId8: {
              distributionType: 'empty',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  label: '',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('isStudyDataAvailable', function() {
        it('should return true if there is any entry in the effects table info which is not exact or relative', function() {
          var effectsTableInfo = {
            criterionId1: {
              distributionType: 'exact'
            },
            criterionId2: {
              distributionType: 'something else',
              studyDataLabelsAndUncertainty: {
                alternativeId6: { hasUncertainty: true }
              }
            }
          };
          var result = effectTableService.isStudyDataAvailable(effectsTableInfo);
          expect(result).toBeTruthy();
        });
        it('should return false if all entries arerelative', function() {
          var effectsTableInfo = {
            criterionId1: {
              distributionType: 'relative'
            },
            criterionId2: {
              distributionType: 'relative'
            }
          };
          var result = effectTableService.isStudyDataAvailable(effectsTableInfo);
          expect(result).toBeFalsy();

        });
      });

      describe('buildTableRows', function() {
        it('should create one row for each dataSource of each criterion ', function() {
          var criteria = [{
            id: 'crit1',
            isFavorable: true,
            dataSources: [{
              foo: 'bar'
            }]
          }, {
            id: 'crit2',
            isFavorable: false,
            dataSources: [{
              foo: 'qux'
            }, {
              zoq: 'fot'
            }]
          }];

          var expectedResult = [{
            isFirstRow: true,
            criterion: {
              id: 'crit1',
              isFavorable: true,
              numberOfDataSources: 1
            },
            dataSource: {
              foo: 'bar'
            }
          }, {
            isFirstRow: true,
            criterion: {
              id: 'crit2',
              isFavorable: false,
              numberOfDataSources: 2
            },
            dataSource: {
              foo: 'qux'
            }
          }, {
            isFirstRow: false,
            criterion: {
              id: 'crit2',
              isFavorable: false,
              numberOfDataSources: 2
            },
            dataSource: {
              zoq: 'fot'
            }
          }];

          var result = effectTableService.buildTableRows(criteria);
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
});
