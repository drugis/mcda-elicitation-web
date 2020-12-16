'use strict';
define([
  'angular',
  'angular-mocks',
  'mcda/results/results',
  'mcda/smaaResults/smaaResults',
  'angular-patavi-client',
  'angularjs-slider'
], function (angular) {
  describe('The SmaaResultsService', function () {
    var smaaResultsService;
    var pataviResultsServiceMock = jasmine.createSpyObj(
      'PataviResultsServiceMock',
      ['postAndHandleResults']
    );

    const root = 'root';

    beforeEach(function () {
      angular.mock.module('patavi', function () {});
      angular.mock.module('elicit.smaaResults', function ($provide) {
        $provide.value('PataviResultsService', pataviResultsServiceMock);
      });
    });

    beforeEach(inject(function (SmaaResultsService) {
      smaaResultsService = SmaaResultsService;
    }));

    describe('addSmaaResults', function () {
      it('should return a state with alternatives per rank, ranks per alternatives, and the central weights', function () {
        var state = {
          results: {
            ranks: {
              altKey1: [0.2, 0.8],
              altKey2: [0.8, 0.2]
            },
            cw: {
              altKey1: {
                cf: 0.123,
                w: {
                  critKey1: 0.5,
                  critKey2: 0.5
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
        var result = smaaResultsService.addSmaaResults(state);
        var expectedResult = {
          results: {
            ranks: {
              altKey1: [0.2, 0.8],
              altKey2: [0.8, 0.2]
            },
            cw: {
              altKey1: {
                cf: 0.123,
                w: {
                  critKey1: 0.5,
                  critKey2: 0.5
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
            [
              {
                key: 'Alternatives for rank 1',
                values: [
                  {
                    label: 'alternative1',
                    value: 0.2
                  },
                  {
                    label: 'alternative2',
                    value: 0.8
                  }
                ]
              }
            ],
            [
              {
                key: 'Alternatives for rank 2',
                values: [
                  {
                    label: 'alternative1',
                    value: 0.8
                  },
                  {
                    label: 'alternative2',
                    value: 0.2
                  }
                ]
              }
            ]
          ],
          centralWeights: [
            {
              key: 'alternative1',
              labels: ['criterion1', 'criterion2'],
              values: [
                {
                  x: 0,
                  label: 'critKey1',
                  y: 0.5
                },
                {
                  x: 1,
                  label: 'critKey2',
                  y: 0.5
                }
              ]
            }
          ],
          ranksByAlternatives: {
            altKey1: [
              {
                key: 'alternative1',
                values: [
                  {
                    label: 'Rank 1',
                    value: [0.2]
                  },
                  {
                    label: 'Rank 2',
                    value: [0.8]
                  }
                ]
              }
            ],
            altKey2: [
              {
                key: 'alternative2',
                values: [
                  {
                    label: 'Rank 1',
                    value: [0.8]
                  },
                  {
                    label: 'Rank 2',
                    value: [0.2]
                  }
                ]
              }
            ]
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getCentralWeightsPlotSettings', function () {
      it('should return the settings for the central weights plot', function () {
        const results = [
          {
            labels: ['label 1', 'label 2'],
            key: 'key 1',
            values: [{y: 1}, {y: 2}]
          }
        ];
        var result = smaaResultsService.getCentralWeightsPlotSettings(
          results,
          root
        );
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
                count: 5
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

    describe('getRankPlotSettings', function () {
      const results = {
        alt1: [1, 2],
        alt2: [3, 4]
      };
      const alternatives = [
        {
          id: 'alt1',
          title: 'alt1'
        },
        {
          id: 'alt2',
          title: 'alt2'
        }
      ];

      it('should return the settings for the rank plot', function () {
        var legend;
        var result = smaaResultsService.getRankPlotSettings(
          results,
          alternatives,
          legend,
          root
        );
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
                count: 5
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

      it('should return the settings for the rank plot using alternative legend', function () {
        var legend = {
          alt1: {
            newTitle: 'newalt1'
          },
          alt2: {
            newTitle: 'newalt2'
          }
        };
        var result = smaaResultsService.getRankPlotSettings(
          results,
          alternatives,
          legend,
          root
        );
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
                count: 5
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

    describe('hasNoStochasticMeasurements', function () {
      it('should return false if there is a performance that has a distribution that is not exact', function () {
        const aggregateState = {
          problem: {
            performanceTable: [
              {
                performance: {
                  distribution: {
                    type: 'not exact'
                  }
                }
              },
              {
                performance: {
                  distribution: {
                    type: 'exact'
                  }
                }
              }
            ]
          }
        };
        const result = smaaResultsService.hasNoStochasticMeasurements(
          aggregateState
        );
        expect(result).toBeFalsy();
      });

      it('should return true if there is no performance that has a distribution that is not exact', function () {
        const aggregateState = {
          problem: {
            performanceTable: [
              {
                performance: {
                  distribution: {
                    type: 'exact'
                  }
                }
              }
            ]
          }
        };
        const result = smaaResultsService.hasNoStochasticMeasurements(
          aggregateState
        );
        expect(result).toBeTruthy();
      });

      it('should return true if there is no performance that has a distribution', function () {
        const aggregateState = {
          problem: {
            performanceTable: [
              {
                performance: {}
              }
            ]
          }
        };
        const result = smaaResultsService.hasNoStochasticMeasurements(
          aggregateState
        );
        expect(result).toBeTruthy();
      });
      it('should return true if there are only empty distributions', function () {
        const aggregateState = {
          problem: {
            performanceTable: [
              {
                performance: {
                  distribution: {
                    type: 'empty'
                  },
                  effect: 'any effect'
                }
              }
            ]
          }
        };
        const result = smaaResultsService.hasNoStochasticMeasurements(
          aggregateState
        );
        expect(result).toBeTruthy();
      });
    });

    describe('hasNoStochasticWeights', function () {
      it('should return true if there are no weights that are stochastic', function () {
        const aggregateState = {
          prefs: [
            {
              type: 'exact swing'
            }
          ]
        };
        const result = smaaResultsService.hasNoStochasticWeights(
          aggregateState
        );
        expect(result).toBeTruthy();
      });

      it('should return false if there are any weights that are stochastic', function () {
        const aggregateState = {
          prefs: [
            {
              type: 'ordinal'
            }
          ]
        };
        const result = smaaResultsService.hasNoStochasticWeights(
          aggregateState
        );
        expect(result).toBeFalsy();
      });

      it('should return false if there are no weights', function () {
        const aggregateState = {
          prefs: []
        };
        const result = smaaResultsService.hasNoStochasticWeights(
          aggregateState
        );
        expect(result).toBeFalsy();
      });

      it('should return false for legacy empty initialisations of aggregateState', function () {
        const aggregateState = {
          prefs: {}
        };
        const result = smaaResultsService.hasNoStochasticWeights(
          aggregateState
        );
        expect(result).toBeFalsy();
      });

      it('should return false if there are no preferences', function () {
        const aggregateState = {};
        const result = smaaResultsService.hasNoStochasticWeights(
          aggregateState
        );
        expect(result).toBeFalsy();
      });
    });

    describe('getResults', function () {
      it('should call the PataviResultsService.postAndHandleResults with a patavi ready problem', function () {
        const uncertaintyOptions = {
          un: 'certain'
        };
        const state = {
          problem: {
            criteria: {
              criterion1: {
                dataSources: [
                  {
                    some: 'thing'
                  }
                ]
              }
            },
            alternatives: {
              alternative1: {}
            },
            performanceTable: [
              {
                performance: {
                  effect: 'effect 1'
                }
              },
              {
                performance: {
                  distribution: 'distribution'
                }
              },
              {
                performance: {
                  effect: 'effect 2',
                  distribution: {
                    type: 'empty'
                  }
                }
              }
            ]
          },
          prefs: {}
        };
        const expectedProblem = {
          preferences: state.prefs,
          method: 'smaa',
          uncertaintyOptions: uncertaintyOptions,
          performanceTable: [
            {
              performance: 'effect 1'
            },
            {
              performance: 'distribution'
            },
            {
              performance: 'effect 2'
            }
          ],
          criteria: {
            criterion1: {
              some: 'thing'
            }
          },
          alternatives: {
            alternative1: {}
          }
        };
        const result = smaaResultsService.getResults(uncertaintyOptions, state);
        expect(result.problem).toEqual(expectedProblem);
        expect(result.selectedAlternative).toEqual('alternative1');
        expect(result.selectedRank).toEqual('0');
      });
    });
  });
});
