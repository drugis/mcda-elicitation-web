'use strict';
define(['angular-mocks', 'mcda/results/results', 'angular-patavi-client', 'angularjs-slider'], function() {
  describe('The MCDAResultsService', function() {
    var resultsService;
    var pataviServiceMock = jasmine.createSpyObj('PataviServiceMock', ['somefunction']);

    beforeEach(function() {
      module('patavi', function() {});
      module('elicit.results', function($provide) {
        $provide.value('PataviService', pataviServiceMock);
      });
    });

    beforeEach(inject(function(MCDAResultsService) {
      resultsService = MCDAResultsService;
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
              }, ]
            }],
            altKey2: [{
              key: 'alternative2',
              values: [{
                label: 'Rank 1',
                value: [0.8]
              }, {
                label: 'Rank 2',
                value: [0.2]
              }, ]
            }]
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('replaceAlternativeNames', function() {
      it('should replace the names of the of the alternatives with the new labels from the legend', function() {
        var legend = {
          altKey1: {
            baseTitle: 'alternative1',
            newTitle: 'alt1'
          },
          altKey2: {
            baseTitle: 'alternative2',
            newTitle: 'alt2'
          }
        };
        var state = {
          problem: {
            alternatives: {
              altKey1: {
                title: 'alternative1'
              },
              altKey2: {
                title: 'alternative2'
              }
            }
          }
        };
        var result = resultsService.replaceAlternativeNames(legend, state);
        var expectedResult = {
          problem: {
            alternatives: {
              altKey1: {
                title: 'alt1'
              },
              altKey2: {
                title: 'alt2'
              }
            }
          }
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });
});