'use strict';
function exampleProblem145() {
  return {
    schemaVersion: '1.4.5',
    title: 'all the things',
    description: '',
    criteria: {
      percentageCriterion: {
        id: 'percentageCriterion',
        title: 'percentages',
        description: 'description',
        dataSources: [
          {
            id: 'ds1Id',
            source: 'ref',
            sourceLink: 'www.ref.com',
            uncertainties: 'uncertainty',
            strengthOfEvidence: 'strength',
            unitOfMeasurement: {
              type: 'percentage',
              label: '%'
            },
            scale: [0, 100]
          }
        ]
      },
      decimalCriterion: {
        id: 'decimalCriterion',
        title: 'decimals',
        description: 'description',
        dataSources: [
          {
            id: 'ds2Id',
            source: 'ref',
            sourceLink: 'www.ref.com',
            uncertainties: 'uncertainty',
            strengthOfEvidence: 'strength',
            unitOfMeasurement: {
              type: 'decimal',
              label: ''
            },
            scale: [0, 1]
          }
        ]
      }
    },
    alternatives: {
      alt1Id: {
        id: 'alt1Id',
        title: 'alt1'
      },
      alt2Id: {
        id: 'alt2Id',
        title: 'alt2'
      },
      alt3Id: {
        id: 'alt3Id',
        title: 'alt3'
      },
      alt4Id: {
        id: 'alt4Id',
        title: 'alt4'
      }
    },
    performanceTable: [
      {
        alternative: 'alt1Id',
        criterion: 'percentageCriterion',
        dataSource: 'ds1Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.01
          }
        }
      },
      {
        alternative: 'alt2Id',
        criterion: 'percentageCriterion',
        dataSource: 'ds1Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.01,
            input: {
              value: 1,
              lowerBound: 0,
              upperBound: 2
            }
          }
        }
      },
      {
        alternative: 'alt3Id',
        criterion: 'percentageCriterion',
        dataSource: 'ds1Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.455,
            input: {
              lowerBound: 1,
              upperBound: 90
            }
          }
        }
      },
      {
        alternative: 'alt4Id',
        criterion: 'percentageCriterion',
        dataSource: 'ds1Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.19,
            input: {
              value: 19,
              sampleSize: 922
            }
          }
        }
      },
      {
        alternative: 'alt1Id',
        criterion: 'decimalCriterion',
        dataSource: 'ds2Id',
        performance: {
          effect: {
            type: 'exact',
            value: 1
          }
        }
      },
      {
        alternative: 'alt2Id',
        criterion: 'decimalCriterion',
        dataSource: 'ds2Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.2,
            input: {
              value: 0.2,
              lowerBound: 0.1,
              upperBound: 0.5
            }
          }
        }
      },
      {
        alternative: 'alt3Id',
        criterion: 'decimalCriterion',
        dataSource: 'ds2Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.45,
            input: {
              lowerBound: 0,
              upperBound: 0.9
            }
          }
        }
      },
      {
        alternative: 'alt4Id',
        criterion: 'decimalCriterion',
        dataSource: 'ds2Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.19,
            input: {
              value: 19,
              sampleSize: 922
            }
          }
        }
      }
    ]
  };
}
