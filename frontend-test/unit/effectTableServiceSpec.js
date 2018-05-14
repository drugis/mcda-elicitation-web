'use strict';
define(['angular-mocks',
  'mcda/effectsTable/effectsTable'
], function() {
  describe('EffectsTableService', function() {
    var effectTableService;

    beforeEach(module('elicit.effectsTable'));

    beforeEach(inject(function(EffectsTableService) {
      effectTableService = EffectsTableService;
    }));

    describe('EffectsTableService', function() {
      describe('buildEffectsTable', function() {
        it('should return the order of the criterion in the effectstable including the favorability headers if needed', function() {
          var problem = {
            valueTree: {
              children: [{
                criteria: ['crit3', 'crit2']
              }, {
                criteria: ['crit1']
              }]
            }
          };
          var criteria = [{
            id: 'crit1'
          }, {
            id: 'crit2'
          }, {
            id: 'crit3'
          }];
          var result = effectTableService.buildEffectsTable(problem.valueTree, criteria);
          var expectedResult = [{
            isHeaderRow: true,
            headerText: 'Favorable effects'
          },
          { id: 'crit2' },
          { id: 'crit3' },
          {
            isHeaderRow: true,
            headerText: 'Unfavorable effects'
          },
          { id: 'crit1' }
          ];
          expect(result).toEqual(expectedResult);
        });
      });

      describe('createEffectsTableInfo', function() {
        it('should build labels for each non-exact, non-relative entry', function() {
          var performanceTable = [{
            criterion: 'criterionId1',
            performance: {
              type: 'relative'
            }
          }, {
            criterion: 'criterionId2',
            alternative: 'alternativeId2',
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
            performance: {
              type: 'empty'
            }
          }];
          var result = effectTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            criterionId1: {
              distributionType: 'relative',
              hasStudyData: false
            },
            criterionId2: {
              distributionType: 'exact',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  label: 1 + ' (' + 0.5 + ')',
                  hasUncertainty: false
                }
              }
            },
            criterionId3: {
              distributionType: 'dt',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId3: {
                  label: '5 (1), 11',
                  hasUncertainty: true
                }
              }
            },
            criterionId4: {
              distributionType: 'dnorm',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId4: {
                  label: '6 (2)',
                  hasUncertainty: true
                }
              }
            },
            criterionId5: {
              distributionType: 'dbeta',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  label: '4 / 14',
                  hasUncertainty: true
                }
              }
            },
            criterionId6: {
              distributionType: 'dsurv',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId6: {
                  label: '10 / 12344321',
                  hasUncertainty: true
                }
              }
            },
            criterionId7: {
              distributionType: 'dnorm',
              hasStudyData: true,
              studyDataLabelsAndUncertainty: {
                alternativeId7: {
                  label: '42 (37; 69)',
                  hasUncertainty: true
                }
              }
            },
            criterionId8: {
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
        it('should return false if all entries are either exact or relative', function() {
          var effectsTableInfo = {
            criterionId1: {
              distributionType: 'exact'
            },
            criterionId2: {
              distributionType: 'relative'
            }
          };
          var result = effectTableService.isStudyDataAvailable(effectsTableInfo);
          expect(result).toBeFalsy();

        });
      });
    });

  });
});
