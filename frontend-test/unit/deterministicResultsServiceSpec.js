'use strict';
define([
  'angular',
  'angular-mocks',
  'mcda/results/results',
  'angular-patavi-client',
  'angularjs-slider'
], function(angular) {
  describe('The DeterministicResultsService', function() {
    var resultsService;
    var pataviServiceMock = jasmine.createSpyObj('PataviServiceMock', ['somefunction']);

    beforeEach(function() {
      angular.mock.module('patavi', function() { });
      angular.mock.module('elicit.results', function($provide) {
        $provide.value('PataviService', pataviServiceMock);
      });
    });

    beforeEach(inject(function(DeterministicResultsService) {
      resultsService = DeterministicResultsService;
    }));

    describe('resetModifiableScales', function() {
      it('it should reset the scales to their original values', function() {
        var alternatives = {
          alt1: 'alt1Id',
          alt2: 'alt2Id'
        };
        var observed = {
          crit1: {
            alt1: {
              '50%': 0.5,
              '2.5%': 0.1,
              '97.5': 0.9
            },
            alt2: {
              '50%': 0.05,
              '2.5%': 0.01,
              '97.5': 0.09
            },
            alt3: {
              '50%': 0.005,
              '2.5%': 0.001,
              '97.5': 0.009
            }
          }
        };
        var result = resultsService.resetModifiableScales(observed, alternatives);
        var expectedResult = {
          crit1: {
            alt1: {
              '50%': 0.5,
              '2.5%': 0.1,
              '97.5': 0.9
            },
            alt2: {
              '50%': 0.05,
              '2.5%': 0.01,
              '97.5': 0.09
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('pataviResultToValueProfile', function() {
      it('should create valid input data for a nvd3 multibarchart', function() {
        var inData = {
          value: {
            data: {
              alt1: {
                OS: 1,
                severe: 2,
                moderate: 3
              },
              alt2: {
                OS: 4,
                severe: 5,
                moderate: 6
              }
            },
            description: 'Value profile',
            type: 'list'
          }
        };
        var criteria = [{
          id: 'OS',
          title: 'OS'
        }, {
          id: 'severe',
          title: 'severe'
        }, {
          id: 'moderate',
          title: 'moderate'
        }];

        var alternatives = [{
          id: 'alt1',
          title: 'alt1'
        }, {
          id: 'alt2',
          title: 'alt2'
        }];

        ///
        var result = resultsService.pataviResultToValueProfile(inData, criteria, alternatives);
        //

        var expectedResult = [{
          key: 'OS',
          values: [{
            x: 'alt1',
            y: 1
          }, {
            x: 'alt2',
            y: 4
          }]
        }, {
          key: 'severe',
          values: [{
            x: 'alt1',
            y: 2
          }, {
            x: 'alt2',
            y: 5
          }]
        }, {
          key: 'moderate',
          values: [{
            x: 'alt1',
            y: 3
          }, {
            x: 'alt2',
            y: 6
          }]
        }];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('pataviResultToLineValues', function() {
      it('should transform a measurements or preferences patavi result to linevalues for the plot', function() {
        var pataviResult = {
          total: {
            data: {
              Fluox: {
                0: 1,
                0.11: 3, // check sorting as well
                1: 6
              },
              Parox: {
                0: 4,
                2: 5
              }
            }
          }
        };
        var alternatives = [{
          id: 'Fluox',
          title: 'Fluoxetine'
        }, {
          id: 'Parox',
          title: 'Paroxetine'
        }];
        var result = resultsService.pataviResultToLineValues(pataviResult, alternatives);
        var expectedResult = [{
          key: 'Fluoxetine',
          values: [{
            x: 0,
            y: 1
          }, {
            x: 0.11,
            y: 3
          }, {
            x: 1,
            y: 6
          }]
        }, {
          key: 'Paroxetine',
          values: [{
            x: 0,
            y: 4
          }, {
            x: 2,
            y: 5
          }]
        }];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('percentifySensitivityResult', function() {
      it('should return the values of given coordinate multiplied by 100', function() {
        function xy(x, y) {
          return { x: x, y: y };
        }
        var values = [{
          values: [
            xy(1, 0),
            xy(2, 1),
            xy(3, 2)
          ]
        }];
        var coordinate = 'x';
        var result = resultsService.percentifySensitivityResult(values, coordinate);
        var expectedResult = [{
          values: [
            xy(100, 0),
            xy(200, 1),
            xy(300, 2)
          ]
        }];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createDeterministicScales', function() {
      var expectedResult = {
        ds1: {
          alt1: {
            '50%': 10
          }
        }
      };

      it('should create deterministic scales from the performance table', function() {
        var performanceTable = [{
          dataSource: 'ds1',
          performance: {
            effect: {
              value: 10
            }
          },
          alternative: 'alt1'
        }
        ];
        var smaaScales = {};
        var result = resultsService.createDeterministicScales(performanceTable, smaaScales);

        expect(result).toEqual(expectedResult);
      });

      it('should create deterministic scales from the smaa values if there are no deterministic values in the performance table', function() {
        var performanceTable = [{
          dataSource: 'ds1',
          performance: {},
          alternative: 'alt1'
        }
        ];
        var smaaScales = {
          ds1: {
            alt1: {
              '50%': 10
            }
          }
        };
        var result = resultsService.createDeterministicScales(performanceTable, smaaScales);
        expect(result).toEqual(expectedResult);
      });

      it('should work for relative data', function() {
        var performanceTable = [{
          dataSource: 'ds1',
          performance: {
            distribution: {}
          }
        }
        ];
        var smaaScales = {
          ds1: {
            alt1: {
              '50%': 10
            }
          }
        };
        var result = resultsService.createDeterministicScales(performanceTable, smaaScales);
        expect(result).toEqual(expectedResult);

      });
    });
  });
});
