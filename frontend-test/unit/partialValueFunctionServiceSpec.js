'use strict';
define(['angular',
  'angular-mocks',
  'mcda/util'
],
  function(angular) {
    describe('PartialValueFunctionService', function() {
      var partialValueFunctionService;
      var workspaceSettingsServiceMock = jasmine.createSpyObj('WorkspaceSettingsService', ['usePercentage']);

      beforeEach(angular.mock.module('elicit.preferences', function($provide) {
        $provide.value('WorkspaceSettingsService', workspaceSettingsServiceMock);
      }));

      beforeEach(inject(function(PartialValueFunctionService) {
        partialValueFunctionService = PartialValueFunctionService;
      }));

      describe('Create Linear Partial Value function', function() {
        var crit1 = {
          dataSources: [{
            pvf: {
              type: 'linear',
              direction: 'increasing',
              'range': [-0.15, 0.35]
            }
          }]
        };
        var crit2 = {
          dataSources: [{
            pvf: {
              type: 'linear',
              direction: 'decreasing',
              'range': [50, 100]
            }
          }]
        };

        it('determines worst values', function() {
          expect(partialValueFunctionService.worst(crit1.dataSources[0])).toEqual(-0.15);
          expect(partialValueFunctionService.worst(crit2.dataSources[0])).toEqual(100);
        });

        it('determines best values', function() {
          expect(partialValueFunctionService.best(crit1.dataSources[0])).toEqual(0.35);
          expect(partialValueFunctionService.best(crit2.dataSources[0])).toEqual(50);
        });

      });

      describe('Create Piecewise Partial Value function', function() {
        var crit1, crit2;

        crit1 = {
          dataSources: [{
            pvf: {
              type: 'piecewise-linear',
              direction: 'increasing',
              'range': [-0.15, 0.35],
              cutoffs: [0.0, 0.25],
              values: [0.1, 0.9]
            }
          }]
        };
        crit2 = {
          dataSources: [{
            pvf: {
              type: 'piecewise-linear',
              direction: 'decreasing',
              'range': [50, 100],
              cutoffs: [75, 90],
              values: [0.8, 0.5]
            }
          }]
        };

        it('determines worst values', function() {
          expect(partialValueFunctionService.worst(crit1.dataSources[0])).toEqual(-0.15);
          expect(partialValueFunctionService.worst(crit2.dataSources[0])).toEqual(100);
        });

        it('determines best values', function() {
          expect(partialValueFunctionService.best(crit1.dataSources[0])).toEqual(0.35);
          expect(partialValueFunctionService.best(crit2.dataSources[0])).toEqual(50);
        });
      });

      describe('standardizeDataSource', function() {
        it('should sort the cutoffs and values of an piecewise-linear pvf', function() {
          var dataSource = {
            pvf: {
              type: 'piecewise-linear',
              direction: 'increasing',
              cutoffs: [75, 7.5, 50],
              values: [0.25, 0.5, 0.75]
            },
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            }
          };
          var result = partialValueFunctionService.standardizeDataSource(dataSource);
          var expectedResult = {
            pvf: {
              type: 'piecewise-linear',
              direction: 'increasing',
              cutoffs: [7.5, 50, 75],
              values: [0.25, 0.5, 0.75]
            }
          };
          expect(result).toEqual(expectedResult);
        });
        it('should sort the cutoffs and reverse-sort the values of an  decreasing piecewise-linear pvf', function() {
          var dataSource = {
            pvf: {
              type: 'piecewise-linear',
              direction: 'decreasing',
              cutoffs: [75, 7.5, 50],
              values: [0.25, 0.5, 0.75]
            },
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            }
          };
          var result = partialValueFunctionService.standardizeDataSource(dataSource);
          var expectedResult = {
            pvf: {
              type: 'piecewise-linear',
              direction: 'decreasing',
              cutoffs: [7.5, 50, 75],
              values: [0.75, 0.5, 0.25]
            }
          };
          expect(result).toEqual(expectedResult);
        });
        it('should delete the cutoffs and values, if any, from a linear pvf', function() {
          var dataSource = {
            pvf: {
              type: 'linear',
              cutoffs: [75, 7.5, 50],
              values: [0.25, 0.5, 0.75]
            },
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            }
          };
          var result = partialValueFunctionService.standardizeDataSource(dataSource);
          var expectedResult = {
            pvf: {
              type: 'linear',
            }
          };
          expect(result).toEqual(expectedResult);
        });
        it('should normalise percentage values if appropriate', function() {
          workspaceSettingsServiceMock.usePercentage.and.returnValue(true);
          var dataSource = {
            pvf: {
              type: 'piecewise-linear',
              direction: 'decreasing',
              cutoffs: [75, 7.5, 50],
              values: [0.25, 0.5, 0.75]
            },
            scale: [0, 100],
            unitOfMeasurement: {
              type: 'percentage',
              label: '%'
            }
          };
          var result = partialValueFunctionService.standardizeDataSource(dataSource);
          var expectedResult = {
            pvf: {
              type: 'piecewise-linear',
              direction: 'decreasing',
              cutoffs: [0.075, 0.50, 0.75],
              values: [0.75, 0.5, 0.25]
            }
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe('getPvfCoordinates', function() {
        it('should calculate th-y coordinates for the pvf plots of all coordinates', function() {
          function xy(x, y) {
            return {
              x: x,
              y: y
            };
          }

          var criteria = {
            crit1: {
              dataSources: [{
                id: 'ds1',
                pvf: {
                  direction: 'increasing',
                  range: [0, 1]
                }
              }]
            },
            crit2: {
              dataSources: [{
                pvf: {
                  direction: 'decreasing',
                  range: [0, 1],
                  cutoffs: [
                    0.1782,
                    0.81,
                    0.943
                  ],
                  values: [
                    0.75,
                    0.5,
                    0.25
                  ]
                }
              }]
            }
          };

          var result = partialValueFunctionService.getPvfCoordinates(criteria);

          var expectedResult = {
            crit1: [{
              key: 'Partial value function',
              values: [xy(1, 1), xy(0, 0)]
            }],
            crit2: [{
              key: 'Partial value function',
              values: [xy(0, 1), xy(0.1782, 0.75), xy(0.81, 0.5), xy(0.943, 0.25), xy(1, 0)]
            }]
          };


          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
