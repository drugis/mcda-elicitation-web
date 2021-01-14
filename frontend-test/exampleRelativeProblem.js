'use strict';
function exampleRelativeProblem() {
  return {
    criteria: {
      crit1: {
        criterion: 'crit1',
        title: 'SAE',
        dataSources: [
          {
            id: 'ds1',
            scale: [0, 1],
            pvf: null,
            unitOfMeasurement: 'proportion',
            source: 'meta analysis',
            sourceLink: '/#/users/12/projects/639/nma/1560/models/1850'
          }
        ]
      },
      crit2: {
        criterion: 'crit2',
        title: 'HbA1c change',
        dataSources: [
          {
            id: 'ds2',
            scale: null,
            pvf: null,
            unitOfMeasurement: null,
            source: 'meta analysis',
            sourceLink: '/#/users/12/projects/639/nma/1559/models/1849'
          }
        ]
      }
    },
    alternatives: {
      4939: {
        alternative: 4939,
        title: 'Cana 100 + met'
      },
      4940: {
        alternative: 4940,
        title: 'Cana 300 + met'
      },
      4942: {
        alternative: 4942,
        title: 'Plac + met'
      },
      4945: {
        alternative: 4945,
        title: 'Pio 45 + met'
      }
    },
    performanceTable: [
      {
        criterion: 'crit1',
        performance: {
          distribution: {
            type: 'relative-logit-normal',
            parameters: {
              baseline: {
                scale: 'log odds',
                name: 'Cana 100 + met',
                alpha: 13,
                beta: 357,
                type: 'dbeta-logit'
              },
              relative: {
                type: 'dmnorm',
                mu: {
                  4939: 0,
                  4940: -0.18746,
                  4942: -0.29679,
                  4945: 0.20526
                },
                cov: {
                  rownames: ['4939', '4940', '4942', '4945'],
                  colnames: ['4939', '4940', '4942', '4945'],
                  data: [
                    [0, 0, 0, 0],
                    [0, 1.2578, 0.61888, 0.61399],
                    [0, 0.61888, 1.0689, 0.92508],
                    [0, 0.61399, 0.92508, 2.4975]
                  ]
                }
              }
            }
          }
        }
      },
      {
        criterion: 'crit2',
        performance: {
          distribution: {
            type: 'relative-normal',
            parameters: {
              baseline: {
                scale: 'mean',
                name: 'Cana 100 + met',
                mu: -0.79,
                sigma: 0.044,
                type: 'dnorm'
              },
              relative: {
                type: 'dmnorm',
                mu: {
                  4939: 0,
                  4940: -0.14618,
                  4942: 0.65544,
                  4945: -0.36159
                },
                cov: {
                  rownames: ['4939', '4940', '4942', '4945'],
                  colnames: ['4939', '4940', '4942', '4945'],
                  data: [
                    [0, 0, 0, 0],
                    [0, 0.059437, 0.030152, 0.03198],
                    [0, 0.030152, 0.048151, 0.042064],
                    [0, 0.03198, 0.042064, 0.12156]
                  ]
                }
              }
            }
          }
        }
      }
    ],
    title: 'eenvoudige br',
    schemaVersion: '1.3.4'
  };
}
