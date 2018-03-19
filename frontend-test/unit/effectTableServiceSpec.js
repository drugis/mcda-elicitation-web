'use strict';
define(['angular-mocks',
  'mcda/evidence/evidence'
], function() {
  describe('EffectsTableService', function() {
    var effectTableService;

    beforeEach(module('elicit.evidence'));

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
          var result = effectTableService.buildEffectsTable(problem, criteria);
          var expectedResult = [{
              isHeaderRow: true,
              headerText: 'Favorable effects'
            },
            'crit2',
            'crit3',
            {
              isHeaderRow: true,
              headerText: 'Unfavorable effects'
            },
            'crit1'
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
              value: 1
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
                  label: 1,
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