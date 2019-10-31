'use strict';
define([
  'angular',
  'angular-mocks',
  'mcda/results/results',
  'angular-patavi-client',
  'angularjs-slider'
], function(angular) {
  describe('The SmaaResultsService', function() {
    var resultsService;
    var pataviServiceMock = jasmine.createSpyObj('PataviServiceMock', ['somefunction']);

    const root = 'root';

    beforeEach(function() {
      angular.mock.module('patavi', function() { });
      angular.mock.module('elicit.results', function($provide) {
        $provide.value('PataviService', pataviServiceMock);
      });
    });

    beforeEach(inject(function(SmaaResultsService) {
      resultsService = SmaaResultsService;
    }));

    describe('addSmaaResults', function() {
      it('should return a state with alternatives per rank, ranks per alternatives, and the central weights', function() {
        var state = {
          results: {
            ranks: {
              data: {
                altKey1: [0.2, 0.8],
                altKey2: [0.8, 0.2]
              }
            },
            cw: {
              data: {
                altKey1: {
                  cf: 0.123,
                  w: {
                    critKey1: 0.5,
                    critKey2: 0.5
                  }

                }
              }
            }
          },
          problem: {
            alternatives: {
              altKey1: {
                title: 'alternative1'
              },
              altKey2: {
                title: 'alternative2'
              }
            },
            criteria: {
              critKey1: {
                title: 'criterion1'
              },
              critKey2: {
                title: 'criterion2'
              }
            }
          }
        };
        var result = resultsService.addSmaaResults(state);
        var expectedResult = {
          results: {
            ranks: {
              data: {
                altKey1: [0.2, 0.8],
                altKey2: [0.8, 0.2]
              }
            },
            cw: {
              data: {
                altKey1: {
                  cf: 0.123,
                  w: {
                    critKey1: 0.5,
                    critKey2: 0.5
                  }

                }
              }
            }
          },
          problem: {
            alternatives: {
              altKey1: {
                title: 'alternative1'
              },
              altKey2: {
                title: 'alternative2'
              }
            },
            criteria: {
              critKey1: {
                title: 'criterion1'
              },
              critKey2: {
                title: 'criterion2'
              }
            }
          },
          alternativesByRank: [
            [{
              key: 'Alternatives for rank 1',
              values: [{
                label: 'alternative1',
                value: 0.2
              }, {
                label: 'alternative2',
                value: 0.8
              }]
            }],
            [{
              key: 'Alternatives for rank 2',
              values: [{
                label: 'alternative1',
                value: 0.8
              }, {
                label: 'alternative2',
                value: 0.2
              }]
            }]
          ],
          centralWeights: [{
            key: 'alternative1',
            labels: ['criterion1', 'criterion2'],
            values: [{
              x: 0,
              label: 'critKey1',
              y: 0.5
            }, {
              x: 1,
              label: 'critKey2',
              y: 0.5
            }]
          }],
          ranksByAlternatives: {
            altKey1: [{
              key: 'alternative1',
              values: [{
                label: 'Rank 1',
                value: [0.2]
              }, {
                label: 'Rank 2',
                value: [0.8]
              },]
            }],
            altKey2: [{
              key: 'alternative2',
              values: [{
                label: 'Rank 1',
                value: [0.8]
              }, {
                label: 'Rank 2',
                value: [0.2]
              },]
            }]
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('replaceAlternativeNames', function() {
      it('should replace all titles with their legend/label', function() {
        var state = {
          problem: {
            alternatives: {
              alt1: {
                title: 'alt1 old title'
              },
              alt2: {
                title: 'alt2 old title'
              }
            }
          }
        };
        var legend = {
          alt1: {
            newTitle: 'new alt1 title'
          },
          alt2: {
            newTitle: 'new alt2 title'
          }
        };
        var expectedResult = {
          problem: {
            alternatives: {
              alt1: {
                title: 'new alt1 title'
              },
              alt2: {
                title: 'new alt2 title'
              }
            }
          }
        };
        var result = resultsService.replaceAlternativeNames(legend, state);

        expect(result).toEqual(expectedResult);
      });

      it('should do nothing if there is no legend', function() {
        var state = {
          a: 'b'
        };
        var result = resultsService.replaceAlternativeNames(undefined, state);
        expect(result).toEqual(state);
      });
    });

    describe('getBarChartSettings', function() {
      it('should return the settings for a bar chart', function() {
        const results = [{
          values: [{
            value: 1,
            label: 'label 1'
          }, {
            value: 2,
            label: 'label 2'
          }]
        }];

        var result = resultsService.getBarChartSettings(results, root);
        delete result.axis.y.tick.format;

        const values = [
          ['x', 'label 1', 'label 2'],
          ['Rank', 1, 2]
        ];
        const expectedResult = {
          bindto: root,
          data: {
            x: 'x',
            columns: values,
            type: 'bar'
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
                count: 5,
              },
              padding: {
                top: 0,
                bottom: 0
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
          legend: {
            show: false
          },
          tooltip: {
            show: false
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getCentralWeightsPlotSettings', function() {
      it('should return the settings for the central weights plot', function() {
        const results = [{
          labels: ['label 1', 'label 2'],
          key: 'key 1',
          values: [
            { y: 1 },
            { y: 2 }
          ]
        }];
        var result = resultsService.getCentralWeightsPlotSettings(results, root);
        delete result.axis.y.tick.format;

        const values = [
          ['x', 'label 1', 'label 2'],
          ['key 1', 1, 2]
        ];
        const expectedResult = {
          bindto: root,
          data: {
            x: 'x',
            columns: values,
            type: 'bar'
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
                count: 5,
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
            position: 'bottom'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getRankPlotSettings', function() {
      const results = {
        alt1: [1,2],
        alt2: [3,4]
      };
      const alternatives = [{
        id: 'alt1',
        title: 'alt1'
      }, {
        id: 'alt2',
        title: 'alt2'
      }];

      it('should return the settings for the rank plot', function() {
        var legend;
        var result = resultsService.getRankPlotSettings(results, alternatives, legend, root);
        delete result.axis.y.tick.format;

        const values = [
          ['x', 'alt1', 'alt2'],
          ['Rank 1', 1, 3],
          ['Rank 2', 2, 4]
        ];
        const expectedResult = {
          bindto: root,
          data: {
            x: 'x',
            columns: values,
            type: 'bar',
            groups: [['Rank 1', 'Rank 2']]
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
                count: 5,
              },
              min: 0,
              max: 1,
              padding: {
                top: 0,
                bottom: 0
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
          legend: {
            position: 'bottom'
          }
        };
        expect(result).toEqual(expectedResult);
      });

      it('should return the settings for the rank plot using alternative legend', function() {
        var legend = {
          alt1: {
            newTitle: 'newalt1'
          },
          alt2: {
            newTitle: 'newalt2'
          }
        };
        var result = resultsService.getRankPlotSettings(results, alternatives, legend, root);
        delete result.axis.y.tick.format;

        const values = [
          ['x', 'newalt1', 'newalt2'],
          ['Rank 1', 1, 3],
          ['Rank 2', 2, 4]
        ];
        const expectedResult = {
          bindto: root,
          data: {
            x: 'x',
            columns: values,
            type: 'bar',
            groups: [['Rank 1', 'Rank 2']]
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
                count: 5,
              },
              min: 0,
              max: 1,
              padding: {
                top: 0,
                bottom: 0
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
          legend: {
            position: 'bottom'
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
