'use strict';
define([
  'angular',
  'angular-mocks',
  'mcda/effectsTable/effectsTable'
], function (angular) {
  describe('EffectsTableService', function () {
    var effectsTableService;
    var significantDigitsMock = function (value) {
      return value;
    };
    var workspaceSettingsServiceMock = jasmine.createSpyObj(
      'WorkspaceSettingsService',
      ['setWorkspaceSettings']
    );

    beforeEach(
      angular.mock.module('elicit.effectsTable', function ($provide) {
        $provide.value('significantDigits', significantDigitsMock);
        $provide.value(
          'WorkspaceSettingsService',
          workspaceSettingsServiceMock
        );
      })
    );

    beforeEach(inject(function (EffectsTableService) {
      effectsTableService = EffectsTableService;
    }));

    describe('EffectsTableService', function () {
      describe('buildEffectsTable', function () {
        it('should return the order of the criterion in the effectstable including the favorability headers if needed', function () {
          var criteria = [
            {
              id: 'crit1',
              isFavorable: false,
              dataSources: [
                {
                  id: 'ds1id',
                  unitOfMeasurement: {
                    label: 'label',
                    type: 'custom'
                  },
                  scale: [0, 1]
                }
              ]
            },
            {
              id: 'crit2',
              isFavorable: true,
              dataSources: [
                {
                  id: 'ds2id',
                  unitOfMeasurement: {
                    label: 'label',
                    type: 'custom'
                  },
                  scale: [0, 1]
                }
              ]
            },
            {
              id: 'crit3',
              isFavorable: true,
              dataSources: [
                {
                  id: 'ds3id',
                  unitOfMeasurement: {
                    label: 'label',
                    type: 'custom'
                  },
                  scale: [0, 1]
                }
              ]
            }
          ];
          var result = effectsTableService.buildEffectsTable(criteria);
          var expectedResult = [
            {
              isHeaderRow: true,
              headerText: 'Favorable effects'
            },
            {
              criterion: {
                id: 'crit2',
                numberOfDataSources: 1,
                isFavorable: true
              },
              dataSource: {
                id: 'ds2id',
                unitOfMeasurement: {
                  label: 'label',
                  type: 'custom'
                },
                scale: [0, 1]
              },
              isFirstRow: true
            },
            {
              criterion: {
                id: 'crit3',
                numberOfDataSources: 1,
                isFavorable: true
              },
              dataSource: {
                id: 'ds3id',
                unitOfMeasurement: {
                  label: 'label',
                  type: 'custom'
                },
                scale: [0, 1]
              },
              isFirstRow: true
            },
            {
              isHeaderRow: true,
              headerText: 'Unfavorable effects'
            },
            {
              criterion: {
                id: 'crit1',
                numberOfDataSources: 1,
                isFavorable: false
              },
              dataSource: {
                id: 'ds1id',
                unitOfMeasurement: {
                  label: 'label',
                  type: 'custom'
                },
                scale: [0, 1]
              },
              isFirstRow: true
            }
          ];
          expect(result).toEqual(expectedResult);
        });
      });

      describe('buildTableRows', function () {
        it('should create one row for each dataSource of each criterion ', function () {
          var criteria = [
            {
              id: 'crit1',
              isFavorable: true,
              dataSources: [
                {
                  foo: 'bar',
                  unitOfMeasurement: {
                    label: 'not perc',
                    type: 'custom'
                  },
                  scale: [0, 100]
                }
              ]
            },
            {
              id: 'crit2',
              isFavorable: false,
              dataSources: [
                {
                  foo: 'qux',
                  unitOfMeasurement: {
                    label: 'not Proportion',
                    type: 'custom'
                  },
                  scale: [0, 1]
                },
                {
                  zoq: 'fot',
                  unitOfMeasurement: {
                    label: 'not Proportion',
                    type: 'custom'
                  },
                  scale: [0, 1]
                }
              ]
            }
          ];

          var expectedResult = [
            {
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
            },
            {
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
            },
            {
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
            }
          ];

          var result = effectsTableService.buildTableRows(criteria);
          expect(result).toEqual(expectedResult);
        });

        it('should substiute null scales to -/+ infinity', function () {
          var criteria = [
            {
              id: 'crit1',
              isFavorable: true,
              dataSources: [
                {
                  foo: 'bar',
                  unitOfMeasurement: {
                    label: 'not perc',
                    type: 'custom'
                  },
                  scale: [null, null]
                }
              ]
            },
            {
              id: 'crit2',
              isFavorable: false,
              dataSources: [
                {
                  foo: 'qux',
                  unitOfMeasurement: {
                    label: 'not Proportion',
                    type: 'custom'
                  },
                  scale: [0, null]
                }
              ]
            }
          ];

          var expectedResult = [
            {
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
            },
            {
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
            }
          ];

          var result = effectsTableService.buildTableRows(criteria);
          expect(result).toEqual(expectedResult);
        });
      });

      describe('getRoundedValue', function () {
        it('should return  the input value rounded on 3 digits for values', function () {
          var value = 0.456789;
          var result = effectsTableService.getRoundedValue(value);
          var expectedResult = '0.457';
          expect(result).toEqual(expectedResult);
        });

        it('should return null if the value is null', function () {
          var value = null;
          var result = effectsTableService.getRoundedValue(value);
          expect(result).toBeNull();
        });
      });

      describe('getRoundedScales', function () {
        it('should return rounded scales', function () {
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

      describe('getMedian', function () {
        beforeEach(function () {
          workspaceSettingsServiceMock.setWorkspaceSettings.calls.reset();
          workspaceSettingsServiceMock.setWorkspaceSettings.and.returnValue({
            calculationMethod: 'median'
          });
        });

        it('should return the median value', function () {
          var scales = {
            '50%': 0.4
          };
          var result = effectsTableService.getMedian(scales);
          var expectedResult = '0.4';
          expect(result).toEqual(expectedResult);
        });

        it('should return the mode', function () {
          workspaceSettingsServiceMock.setWorkspaceSettings.and.returnValue({
            calculationMethod: 'mode'
          });
          var scales = {
            mode: 0.05
          };
          var result = effectsTableService.getMedian(scales);
          var expectedResult = '0.05';
          expect(result).toEqual(expectedResult);
        });

        it("should return 'NA' if the mode is NULL", function () {
          workspaceSettingsServiceMock.setWorkspaceSettings.and.returnValue({
            calculationMethod: 'mode'
          });
          var scales = {
            mode: null
          };
          var result = effectsTableService.getMedian(scales);
          var expectedResult = 'NA';
          expect(result).toEqual(expectedResult);
        });

        it("should return 'NA' if the mode is UNDEFINED", function () {
          workspaceSettingsServiceMock.setWorkspaceSettings.and.returnValue({
            calculationMethod: 'mode'
          });
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
