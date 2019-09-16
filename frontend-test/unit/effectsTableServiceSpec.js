'use strict';
define([
  'angular',
  'angular-mocks',
  'mcda/effectsTable/effectsTable'
], function(angular) {
  describe('EffectsTableService', function() {
    var effectsTableService;
    var significantDigitsMock = function(value) {
      return value;
    };
    var workspaceSettingsServiceMock = jasmine.createSpyObj('WorkspaceSettingsService', ['getWorkspaceSettings']);

    beforeEach(angular.mock.module('elicit.effectsTable', function($provide) {
      $provide.value('significantDigits', significantDigitsMock);
      $provide.value('WorkspaceSettingsService', workspaceSettingsServiceMock);
    }));

    beforeEach(inject(function(EffectsTableService) {
      effectsTableService = EffectsTableService;
    }));

    describe('EffectsTableService', function() {
      describe('buildEffectsTable', function() {
        it('should return the order of the criterion in the effectstable including the favorability headers if needed', function() {
          var criteria = [{
            id: 'crit1',
            isFavorable: false,
            dataSources: [{
              id: 'ds1id',
              unitOfMeasurement: {
                label: 'label',
                type: 'custom'
              },
              scale: [0, 1]
            }]
          }, {
            id: 'crit2',
            isFavorable: true,
            dataSources: [{
              id: 'ds2id',
              unitOfMeasurement: {
                label: 'label',
                type: 'custom'
              },
              scale: [0, 1]
            }]
          }, {
            id: 'crit3',
            isFavorable: true,
            dataSources: [{
              id: 'ds3id',
              unitOfMeasurement: {
                label: 'label',
                type: 'custom'
              },
              scale: [0, 1]
            }]
          }];
          var result = effectsTableService.buildEffectsTable(criteria);
          var expectedResult = [{
            isHeaderRow: true,
            headerText: 'Favorable effects'
          }, {
            criterion: {
              id: 'crit2',
              numberOfDataSources: 1,
              isFavorable: true,
            },
            dataSource: {
              id: 'ds2id',
              unitOfMeasurement: {
                label: 'label',
                type: 'custom'
              },
              scale: [0, 1]
            },
            isFirstRow: true,
          }, {
            criterion: {
              id: 'crit3',
              numberOfDataSources: 1,
              isFavorable: true,
            },
            dataSource: {
              id: 'ds3id',
              unitOfMeasurement: {
                label: 'label',
                type: 'custom'
              },
              scale: [0, 1]
            },
            isFirstRow: true,
          },
          {
            isHeaderRow: true,
            headerText: 'Unfavorable effects'
          }, {
            criterion: {
              id: 'crit1',
              numberOfDataSources: 1,
              isFavorable: false,
            },
            dataSource: {
              id: 'ds1id',
              unitOfMeasurement: {
                label: 'label',
                type: 'custom'
              },
              scale: [0, 1]
            },
            isFirstRow: true,
          }
          ];
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: 1,
                  effectValue: 1,
                  distributionLabel: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '1 (0.5)',
                  effectValue: 1,
                  distributionLabel: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '1 (0.5; 2)',
                  effectValue: 1,
                  distributionLabel: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '1 / 10',
                  effectValue: 2,
                  distributionLabel: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId2: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId2: {
                  effectLabel: '10 / 100',
                  effectValue: 1,
                  distributionLabel: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId3: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId3: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: 'Student\'s t(5, 1, 10)',
                  hasUncertainty: true
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a non percentage normal distribution', function() {
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId4: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId4: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: 'Normal(6, 2)',
                  hasUncertainty: true
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a percentage normal distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId4',
            alternative: 'alternativeId4',
            dataSource: 'dsId4',
            performance: {
              distribution: {
                type: 'dnorm',
                parameters: {
                  mu: 0.06,
                  sigma: 0.02
                },
                input:{
                  mu: 6,
                  sigma: 2,
                  scale: 'percentage'
                }
              }
            }
          }];
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId4: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId4: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: 'Normal(6%, 2%)',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId5: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  effectLabel: '',
                  effectValue: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId5: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  effectLabel: '',
                  effectValue: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId5: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId5: {
                  effectLabel: 42,
                  effectValue: '',
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: '',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an empty distribution with a value', function() {
          var performanceTable = [{
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              distribution: {
                type: 'empty',
                value: 'text'
              }
            }
          }];
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: 'text',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a non-percentage range effect', function() {
          var performanceTable = [{
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              effect: {
                type: 'exact',
                value: 15,
                input: {
                  lowerBound: 10,
                  upperBound: 20
                }
              }
            }
          }];
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: '[10, 20]',
                  effectValue: 15,
                  distributionLabel: '',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a percentage range effect', function() {
          var performanceTable = [{
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              effect: {
                type: 'exact',
                value: 0.15,
                input: {
                  scale: 'percentage',
                  lowerBound: 10,
                  upperBound: 20
                }
              }
            }
          }];
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: '[10%, 20%]',
                  effectValue: 0.15,
                  distributionLabel: '',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for a range distribution', function() {
          var performanceTable = [{
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              distribution: {
                type: 'range',
                parameters: {
                  lowerBound: 10,
                  upperBound: 20
                }
              }
            }
          }];
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: '[10, 20]',
                  hasUncertainty: true
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
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: '',
                  effectValue: '',
                  distributionLabel: '',
                  hasUncertainty: false
                }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should make a label for an empty effect with a value', function() {
          var performanceTable = [{
            criterion: 'criterionId8',
            alternative: 'alternativeId8',
            dataSource: 'dsId8',
            performance: {
              effect: {
                type: 'empty',
                value: 'text'
              }
            }
          }];
          var result = effectsTableService.createEffectsTableInfo(performanceTable);
          var expectedResult = {
            dsId8: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alternativeId8: {
                  effectLabel: 'text',
                  effectValue: '',
                  distributionLabel: '',
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
          var result = effectsTableService.isStudyDataAvailable(effectsTableInfo);
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
          var result = effectsTableService.isStudyDataAvailable(effectsTableInfo);
          expect(result).toBeFalsy();

        });
      });

      describe('buildTableRows', function() {
        it('should create one row for each dataSource of each criterion ', function() {
          var criteria = [{
            id: 'crit1',
            isFavorable: true,
            dataSources: [{
              foo: 'bar',
              unitOfMeasurement: {
                label: 'not perc',
                type: 'custom'
              },
              scale: [0, 100]
            }]
          }, {
            id: 'crit2',
            isFavorable: false,
            dataSources: [{
              foo: 'qux',
              unitOfMeasurement: {
                label: 'not Proportion',
                type: 'custom'
              },
              scale: [0, 1]
            }, {
              zoq: 'fot',
              unitOfMeasurement: {
                label: 'not Proportion',
                type: 'custom'
              },
              scale: [0, 1]
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
              foo: 'bar',
              unitOfMeasurement: {
                label: 'not perc',
                type: 'custom'
              },
              scale: [0, 100]
            }
          }, {
            isFirstRow: true,
            criterion: {
              id: 'crit2',
              isFavorable: false,
              numberOfDataSources: 2
            },
            dataSource: {
              foo: 'qux',
              unitOfMeasurement: {
                label: 'not Proportion',
                type: 'custom'
              },
              scale: [0, 1]
            }
          }, {
            isFirstRow: false,
            criterion: {
              id: 'crit2',
              isFavorable: false,
              numberOfDataSources: 2
            },
            dataSource: {
              zoq: 'fot',
              unitOfMeasurement: {
                label: 'not Proportion',
                type: 'custom'
              },
              scale: [0, 1]
            }
          }];

          var result = effectsTableService.buildTableRows(criteria);
          expect(result).toEqual(expectedResult);
        });

        it('should substiute null scales to -/+ infinity', function() {
          var criteria = [{
            id: 'crit1',
            isFavorable: true,
            dataSources: [{
              foo: 'bar',
              unitOfMeasurement: {
                label: 'not perc',
                type: 'custom'
              },
              scale: [null, null]
            }]
          }, {
            id: 'crit2',
            isFavorable: false,
            dataSources: [{
              foo: 'qux',
              unitOfMeasurement: {
                label: 'not Proportion',
                type: 'custom'
              },
              scale: [0, null]
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
              foo: 'bar',
              unitOfMeasurement: {
                label: 'not perc',
                type: 'custom'
              },
              scale: [-Infinity, Infinity]
            }
          }, {
            isFirstRow: true,
            criterion: {
              id: 'crit2',
              isFavorable: false,
              numberOfDataSources: 1
            },
            dataSource: {
              foo: 'qux',
              unitOfMeasurement: {
                label: 'not Proportion',
                type: 'custom'
              },
              scale: [0, Infinity]
            }
          }];

          var result = effectsTableService.buildTableRows(criteria);
          expect(result).toEqual(expectedResult);
        });
      });

      describe('createIsCellAnalysisViable', function() {
        it('should set cells with a value label to true', function() {
          var rows = [{
            dataSource: {
              id: 'ds1'
            }
          }];
          var alternatives = [{
            id: 'alt1'
          }];
          var effectsTableInfo = {
            ds1: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alt1: {
                  effectValue: 'an effect value label '
                }
              }
            }
          };
          var scales;
          var result = effectsTableService.createIsCellAnalysisViable(rows, alternatives, effectsTableInfo, scales);
          var expectedResult = {
            ds1: {
              alt1: true
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should ignore headerRows', function() {
          var scales;
          var effectsTableInfo = {};
          var alternatives = [];
          var rows = [{
            isHeaderRow: true
          }];
          var result = effectsTableService.createIsCellAnalysisViable(rows, alternatives, effectsTableInfo, scales);
          var expectedResult = {};
          expect(result).toEqual(expectedResult);
        });

        it('should set relative cells to true', function() {
          var rows = [{
            dataSource: {
              id: 'ds1'
            }
          }];
          var scales;
          var effectsTableInfo = {
            ds1: {
              isAbsolute: false
            }
          };
          var alternatives = [{
            id: 'alt1'
          }];
          var result = effectsTableService.createIsCellAnalysisViable(rows, alternatives, effectsTableInfo, scales);
          var expectedResult = {
            ds1: {
              alt1: true
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should set cells without a value label to false', function() {
          var rows = [{
            dataSource: {
              id: 'ds1'
            }
          }];
          var alternatives = [{
            id: 'alt1'
          }];
          var effectsTableInfo = {
            ds1: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alt1: {
                  effectValue: ''
                }
              }
            }
          };
          var scales;
          var result = effectsTableService.createIsCellAnalysisViable(rows, alternatives, effectsTableInfo, scales);
          var expectedResult = {
            ds1: {
              alt1: false
            }
          };
          expect(result).toEqual(expectedResult);
        });

        it('should set cells without a value label, but with scale values to true', function() {
          var rows = [{
            dataSource: {
              id: 'ds1'
            }
          }];
          var alternatives = [{
            id: 'alt1'
          }];
          var effectsTableInfo = {
            ds1: {
              isAbsolute: true,
              studyDataLabelsAndUncertainty: {
                alt1: {
                  effectValue: ''
                }
              }
            }
          };
          var scales = {
            ds1: {
              alt1: {
                '50%': 0
              }
            }
          };
          var result = effectsTableService.createIsCellAnalysisViable(rows, alternatives, effectsTableInfo, scales);
          var expectedResult = {
            ds1: {
              alt1: true
            }
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('getRoundedValue', function() {
        it('should return  the input value rounded on 3 digits for values', function() {
          var value = 0.4567890;
          var result = effectsTableService.getRoundedValue(value);
          var expectedResult = '0.457';
          expect(result).toEqual(expectedResult);
        });

        it('should return null if the value is null', function() {
          var value = null;
          var result = effectsTableService.getRoundedValue(value);
          expect(result).toBeNull();
        });
      });

      describe('getRoundedScales', function() {
        it('should return rounded scales', function() {
          var scales = {
            dataSourceId: {
              alternativeId: {
                '2.5%': 0.045,
                '50%': 0.045,
                '97.5%': 0.045
              }
            }
          };

          var result = effectsTableService.getRoundedScales(scales);

          var expectedResult = {
            dataSourceId: {
              alternativeId: {
                '2.5%': '0.045',
                '50%': '0.045',
                '97.5%': '0.045'
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('getMedian', function() {
        beforeEach(function() {
          workspaceSettingsServiceMock.getWorkspaceSettings.calls.reset();
          workspaceSettingsServiceMock.getWorkspaceSettings.and.returnValue({ calculationMethod: 'median' });
        });

        it('should return the median value', function() {
          var scales = {
            '50%': 0.4
          };
          var result = effectsTableService.getMedian(scales);
          var expectedResult = '0.4';
          expect(result).toEqual(expectedResult);
        });

        it('should return the mode', function() {
          workspaceSettingsServiceMock.getWorkspaceSettings.and.returnValue({ calculationMethod: 'mode' });
          var scales = {
            mode: 0.05
          };
          var result = effectsTableService.getMedian(scales);
          var expectedResult = '0.05';
          expect(result).toEqual(expectedResult);
        });

        it('should return \'NA\' if the mode is NULL', function() {
          workspaceSettingsServiceMock.getWorkspaceSettings.and.returnValue({ calculationMethod: 'mode' });
          var scales = {
            mode: null
          };
          var result = effectsTableService.getMedian(scales);
          var expectedResult = 'NA';
          expect(result).toEqual(expectedResult);
        });

        it('should return \'NA\' if the mode is UNDEFINED', function() {
          workspaceSettingsServiceMock.getWorkspaceSettings.and.returnValue({ calculationMethod: 'mode' });
          var scales = {
            mode: undefined
          };
          var result = effectsTableService.getMedian(scales);
          var expectedResult = 'NA';
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
});
