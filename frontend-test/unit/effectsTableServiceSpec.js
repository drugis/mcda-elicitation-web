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
              isFavorable: true,
              canBePercentage: false
            },
            dataSource: {
              id: 'ds2id'
            },
            isFirstRow: true
          }, {
            criterion: {
              id: 'crit3',
              numberOfDataSources: 1,
              isFavorable: true,
              canBePercentage: false
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
              isFavorable: false,
              canBePercentage: false,
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
              scale: [0, 1]
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
              scale: [0, 1]
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
        it('should build NA labels for relative entries', function() {
          var performanceTable = [{
            criterion: 'criterionId1',
            dataSource: 'dsId1',
            performance: {
              distribution: {
                type: 'relative'
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId1: {
              isAbsolute: false,
              hasUncertainty: true
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an effect without input data', function() {
          var performanceTable = [{
            criterion: 'criterionId2',
            alternative: 'alternativeId2',
            dataSource: 'dsId2',
            performance: {
              effect: {
                type: 'exact',
                value: 1
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: 1,
                  effectValue: 1,
                  distributionLabel: 'Not entered',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an effect with standard error input data', function() {
          var performanceTable = [{
            criterion: 'criterionId2',
            alternative: 'alternativeId2',
            dataSource: 'dsId2',
            performance: {
              effect: {
                type: 'exact',
                value: 1,
                input: {
                  value: 1,
                  stdErr: 0.5
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '1 (0.5)',
                  effectValue: 1,
                  distributionLabel: 'Not entered',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an effect with lower and upper bounds input data', function() {
          var performanceTable = [{
            criterion: 'criterionId2',
            alternative: 'alternativeId2',
            dataSource: 'dsId2',
            performance: {
              effect: {
                type: 'exact',
                value: 1,
                input: {
                  value: 1,
                  lowerBound: 0.5,
                  upperBound: 2
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '1 (0.5; 2)',
                  effectValue: 1,
                  distributionLabel: 'Not entered',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an effect with value and sample size input data', function() {
          var performanceTable = [{
            criterion: 'criterionId2',
            alternative: 'alternativeId2',
            dataSource: 'dsId2',
            performance: {
              effect: {
                type: 'exact',
                value: 2,
                input: {
                  value: 1,
                  sampleSize: 10
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '1 / 10',
                  effectValue: 2,
                  distributionLabel: 'Not entered',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an effect with events and sample size input data', function() {
          var performanceTable = [{
            criterion: 'criterionId2',
            alternative: 'alternativeId2',
            dataSource: 'dsId2',
            performance: {
              effect: {
                type: 'exact',
                value: 1,
                input: {
                  events: 10,
                  sampleSize: 100
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '10 / 100',
                  effectValue: 1,
                  distributionLabel: 'Not entered',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a students t distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId3',
            alternative: 'alternativeId3',
            dataSource: 'dsId3',
            performance: {
              distribution: {
                type: 'dt',
                parameters: {
                  mu: 5,
                  stdErr: 1,
                  dof: 10
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId3: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId3: {
                  effectLabel: 'Not entered',
                  effectValue: 'Not entered',
                  distributionLabel: 'Student\'s t(5, 1, 10)',
                  hasUncertainty: true
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a normal distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId4',
            alternative: 'alternativeId4',
            dataSource: 'dsId4',
            performance: {
              distribution: {
                type: 'dnorm',
                parameters: {
                  mu: 6,
                  sigma: 2
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId4: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId4: {
                  effectLabel: 'Not entered',
                  effectValue: 'Not entered',
                  distributionLabel: 'Normal(6, 2)',
                  hasUncertainty: true
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a beta distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId5',
            alternative: 'alternativeId5',
            dataSource: 'dsId5',
            performance: {
              distribution: {
                type: 'dbeta',
                parameters: {
                  alpha: 5,
                  beta: 11
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId5: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  effectLabel: 'Not entered',
                  effectValue: 'Not entered',
                  distributionLabel: 'Beta(5, 11)',
                  hasUncertainty: true
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a survival distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId5',
            alternative: 'alternativeId5',
            dataSource: 'dsId5',
            performance: {
              distribution: {
                type: 'dsurv',
                parameters: {
                  alpha: 10,
                  beta: 12344321
                }
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId5: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  effectLabel: 'Not entered',
                  effectValue: 'Not entered',
                  distributionLabel: 'Gamma(10, 12344321)',
                  hasUncertainty: true
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an exact distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId5',
            alternative: 'alternativeId5',
            dataSource: 'dsId5',
            performance: {
              distribution: {
                type: 'exact',
                value: 42
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId5: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  effectLabel: 42,
                  effectValue: 'Not entered',
                  distributionLabel: '42',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });


        it('should make a label for an empty distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              distribution: {
                type: 'empty'
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: 'Not entered',
                  effectValue: 'Not entered',
                  distributionLabel: '',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an empty effect', function() {
          var performanceTable = [{
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              effect: {
                type: 'empty'
              }
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: 'Not entered',
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
