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

    var alternatives = [{
      id: 'Fluox',
      title: 'Fluoxetine'
    }, {
      id: 'Parox',
      title: 'Paroxetine'
    }];

    var legend = {
      Fluox: {
        newTitle: 'newfluox'
      },
      Parox: {
        newTitle: 'newparox'
      }
    };

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

    describe('pataviResultToLineValues', function() {
      const pataviResult = {
        total: {
          data: {
            Fluox: {
              0: 1,
              1: 3,
              2: 6
            },
            Parox: {
              0: 4,
              1: 7,
              2: 5
            }
          }
        }
      };

      it('should transform a measurements or preferences patavi result to linevalues for the plot', function() {
        var result = resultsService.pataviResultToLineValues(pataviResult, alternatives);
        var expectedResult = [
          ['x', '0', '1', '2'],
          ['Fluoxetine', 1, 3, 6],
          ['Paroxetine', 4, 7, 5]
        ];
        expect(result).toEqual(expectedResult);
      });

      it('should transform a measurements or preferences patavi result to linevalues for the plot and uses the alternative legend', function() {
        var result = resultsService.pataviResultToLineValues(pataviResult, alternatives, legend);
        var expectedResult = [
          ['x', '0', '1', '2'],
          ['newfluox', 1, 3, 6],
          ['newparox', 4, 7, 5]
        ];
        expect(result).toEqual(expectedResult);
      });
    });

    describe('percentifySensitivityResult', function() {
      it('should return the values of given coordinate multiplied by 100', function() {
        var values = [['x', 0.6, 0.8]];
        var result = resultsService.percentifySensitivityResult(values);
        var expectedResult = [['x', 60, 80]];
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

    describe('getValueProfilePlotSettings', function() {
      const pataviResult = {
        value: {
          data: {
            Fluox: {
              crit1: 1,
              crit2: 2
            },
            Parox: {
              crit1: 1,
              crit2: 2
            }
          }
        }
      };

      const criteria = [{
        id: 'crit1',
        title: 'Crit1'
      }, {
        id: 'crit2',
        title: 'Crit2'
      }];

      it('should return the settings for a value profile plot', function() {
        var undefinedLegend;
        const root = {};

        var settings = resultsService.getValueProfilePlotSettings(pataviResult, criteria, alternatives, undefinedLegend, root);

        delete settings.axis.y.tick.format;

        var plotValues = [
          ['x', alternatives[0].title, alternatives[1].title],
          [criteria[0].title, 1, 1],
          [criteria[1].title, 2, 2]
        ];
        var expectedSettings = {
          bindto: root,
          data: {
            x: 'x',
            columns: plotValues,
            type: 'bar',
            groups: [[criteria[0].title, criteria[1].title]]
          },
          axis: {
            x: {
              type: 'category',
              tick: {
                centered: true
              }
            },
            y: {
              tick: {
                count: 5
              },
            }
          },
          grid: {
            x: {
              show: false
            },
            y: {
              show: true
            }
          },
          legend: {
            position: 'inset'
          }
        };
        expect(settings).toEqual(expectedSettings);
      });

      it('should return the settings for a value profile plot using alternative legend', function() {
        const root = 'root';

        var settings = resultsService.getValueProfilePlotSettings(pataviResult, criteria, alternatives, legend, root);

        delete settings.axis.y.tick.format;

        var plotValues = [
          ['x', legend[alternatives[0].id].newTitle, legend[alternatives[1].id].newTitle],
          [criteria[0].title, 1, 1],
          [criteria[1].title, 2, 2]
        ];
        var expectedSettings = {
          bindto: root,
          data: {
            x: 'x',
            columns: plotValues,
            type: 'bar',
            groups: [[criteria[0].title, criteria[1].title]]
          },
          axis: {
            x: {
              type: 'category',
              tick: {
                centered: true
              }
            },
            y: {
              tick: {
                count: 5
              },
            }
          },
          grid: {
            x: {
              show: false
            },
            y: {
              show: true
            }
          },
          legend: {
            position: 'inset'
          }
        };
        expect(settings).toEqual(expectedSettings);
      });
    });

    describe('getSensitivityLineChartSettings', function() {
      it('should return the settings for a sensitivity line chart', function() {
        const root = 'root';
        const values = [['x', 0, 1]];
        const options = {
          useTooltip: false,
          labelXAxis: 'xlabel',
          labelYAxis: 'ylabel'
        };

        var settings = resultsService.getSensitivityLineChartSettings(root, values, options);

        delete settings.axis.x.tick.format;

        var expectedSettings = {
          bindto: root,
          data: {
            x: 'x',
            columns: values
          },
          axis: {
            x: {
              label: {
                text: options.labelXAxis,
                position: 'outer-center'
              },
              min: 0,
              max: 1,
              padding: {
                left: 0,
                right: 0
              },
              tick: {
                count: 5,
              }
            },
            y: {
              label: {
                text: options.labelYAxis,
                position: 'outer-middle'
              }
            }
          },
          grid: {
            x: {
              show: false
            },
            y: {
              show: true
            }
          },
          point: {
            show: false
          },
          tooltip: {
            show: options.useTooltip
          }
        };
        expect(settings).toEqual(expectedSettings);
      });
    });
  });
});
