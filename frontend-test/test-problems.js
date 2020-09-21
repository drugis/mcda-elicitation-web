'use strict';
function exampleProblem() {
  return {
    title: 'Thrombolytics Example',
    criteria: {
      'Prox DVT': {
        title: 'Proximal DVT',
        dataSources: [
          {
            id: 'proxDvtDS',
            unitOfMeasurement: {
              type: 'custom',
              label: 'mg/h'
            },
            pvf: {
              range: [0.0, 0.25],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 1]
          }
        ]
      },
      'Dist DVT': {
        title: 'Distal DVT',
        dataSources: [
          {
            id: 'distDvtDS',
            unitOfMeasurement: {
              type: 'decimal',
              label: ''
            },
            pvf: {
              range: [0.15, 0.4],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 1]
          }
        ]
      },
      Bleed: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            unitOfMeasurement: {
              type: 'percentage',
              label: '%'
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 100]
          }
        ]
      },
      Bleed2: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [-Infinity, Infinity]
          }
        ]
      },
      Bleed3: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [-Infinity, Infinity]
          }
        ]
      },
      null2Infinity: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'null2Infinity',
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [null, null]
          }
        ]
      }
    },
    alternatives: {
      Hep: {
        title: 'Heparin'
      },
      Enox: {
        title: 'Enoxaparin'
      }
    },
    performanceTable: [
      {
        alternative: 'Hep',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 20, beta: 116}
          }
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 40, beta: 96}
          }
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 1, beta: 135}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 8, beta: 121}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 32, beta: 97}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 5, beta: 124}
          }
        }
      }
    ],
    schemaVersion: '1.4.4'
  };
}

function exampleProblem134() {
  return {
    title: '1.3.4 problem',
    criteria: {
      c1: {
        title: 'c1',
        dataSources: [
          {
            id: 'd1',
            unitOfMeasurement: '%',
            scale: [0, 100]
          }
        ]
      },
      c2: {
        title: 'c2',
        dataSources: [
          {
            id: 'd2',
            unitOfMeasurement: 'Proportion',
            scale: [0, 1]
          }
        ]
      }
    },
    alternatives: {
      a1: {
        title: 'a1'
      },
      a2: {
        title: 'a2'
      }
    },
    performanceTable: [
      {
        alternative: 'a1',
        criterion: 'c1',
        dataSource: 'd1',
        performance: {
          distribution: {
            type: 'exact',
            value: 50
          }
        }
      },
      {
        alternative: 'a2',
        criterion: 'c1',
        dataSource: 'd1',
        performance: {
          distribution: {
            type: 'exact',
            value: 0.5,
            input: {
              scale: 'percentage',
              value: 50
            }
          }
        }
      },
      {
        alternative: 'a1',
        criterion: 'c2',
        dataSource: 'd2',
        performance: {
          distribution: {
            type: 'exact',
            value: 0.5
          }
        }
      },
      {
        alternative: 'a2',
        criterion: 'c2',
        dataSource: 'd2',
        performance: {
          distribution: {
            type: 'exact',
            value: 0.5
          }
        }
      }
    ],
    schemaVersion: '1.3.4'
  };
}

function ordinalTestProblem() {
  return {
    title: 'Thrombolytics Example',
    criteria: {
      'Prox DVT': {
        title: 'Proximal DVT',
        dataSources: [
          {
            id: 'proxDvtDS',
            unitOfMeasurement: {
              type: 'custom',
              label: 'mg/h'
            },
            pvf: {
              range: [0.0, 0.25],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 1]
          }
        ]
      },
      'Dist DVT': {
        title: 'Distal DVT',
        dataSources: [
          {
            id: 'distDvtDS',
            unitOfMeasurement: {
              type: 'decimal',
              label: ''
            },
            pvf: {
              range: [0.15, 0.4],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 1]
          }
        ]
      },
      Bleed: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            unitOfMeasurement: {
              type: 'percentage',
              label: '%'
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 100]
          }
        ]
      },
      Bleed2: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [-Infinity, Infinity]
          }
        ]
      },
      Bleed3: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [-Infinity, Infinity]
          }
        ]
      },
      null2Infinity: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'null2Infinity',
            unitOfMeasurement: {
              type: 'custom',
              label: ''
            },
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [null, null]
          }
        ]
      }
    },
    alternatives: {
      Hep: {
        title: 'Heparin'
      },
      Enox: {
        title: 'Enoxaparin'
      }
    },
    performanceTable: [
      {
        alternative: 'Hep',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 20, beta: 116}
          }
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 40, beta: 96}
          }
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 1, beta: 135}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 8, beta: 121}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 32, beta: 97}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 5, beta: 124}
          }
        }
      }
    ],
    schemaVersion: '1.4.4'
  };
}

function exampleProblem122() {
  return {
    title: 'Thrombolytics Example',
    criteria: {
      'Prox DVT': {
        title: 'Proximal DVT',
        unitOfMeasurement: 'mg/h',
        dataSources: [
          {
            id: 'proxDvtDS',
            pvf: {
              range: [0.0, 0.25],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 1]
          }
        ]
      },
      'Dist DVT': {
        title: 'Distal DVT',
        dataSources: [
          {
            id: 'distDvtDS',
            unitOfMeasurement: 'Proportion',
            pvf: {
              range: [0.15, 0.4],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 1]
          }
        ]
      },
      Bleed: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            unitOfMeasurement: '%',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [0, 100]
          }
        ]
      },
      Bleed2: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ]
      },
      Bleed3: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ]
      },
      null2Infinity: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'null2Infinity',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            },
            scale: [null, null]
          }
        ]
      }
    },
    alternatives: {
      Hep: {
        title: 'Heparin'
      },
      Enox: {
        title: 'Enoxaparin'
      }
    },
    performanceTable: [
      {
        alternative: 'Hep',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 20, beta: 116}
          }
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 40, beta: 96}
          }
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 1, beta: 135}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 8, beta: 121}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 32, beta: 97}
          }
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          distribution: {
            type: 'dbeta',
            parameters: {alpha: 5, beta: 124}
          }
        }
      }
    ],
    schemaVersion: '1.2.2'
  };
}

function exampleProblem110() {
  return {
    title: 'Thrombolytics Example',
    criteria: {
      'Prox DVT': {
        title: 'Proximal DVT',
        unitOfMeasurement: 'mg/h',
        dataSources: [
          {
            id: 'proxDvtDS',
            oldId: 'proxDvtDSOld',
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
            pvf: {
              range: [0.0, 0.25],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ],
        scale: [0, 1]
      },
      'Dist DVT': {
        title: 'Distal DVT',
        unitOfMeasurement: 'Proportion',
        dataSources: [
          {
            id: 'distDvtDS',
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
            pvf: {
              range: [0.15, 0.4],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ],
        scale: [0, 1]
      },
      Bleed: {
        title: 'Major bleeding',
        unitOfMeasurement: '%',
        dataSources: [
          {
            id: 'bleedDS',
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ],
        scale: [0, 100]
      },
      Bleed2: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ],
        scale: undefined
      },
      Bleed3: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'bleedDS',
            inputType: 'distribution',
            inputMethod: 'manualDistribution',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ],
        scale: null
      },
      null2Infinity: {
        title: 'Major bleeding',
        dataSources: [
          {
            id: 'null2Infinity',
            pvf: {
              range: [0.0, 0.1],
              type: 'linear',
              direction: 'decreasing'
            }
          }
        ],
        scale: [null, null]
      }
    },
    alternatives: {
      Hep: {
        title: 'Heparin'
      },
      Enox: {
        title: 'Enoxaparin'
      }
    },
    performanceTable: [
      {
        alternative: 'Hep',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          type: 'dbeta',
          parameters: {alpha: 20, beta: 116}
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          type: 'dbeta',
          parameters: {alpha: 40, beta: 96}
        }
      },
      {
        alternative: 'Hep',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          type: 'dbeta',
          parameters: {alpha: 1, beta: 135}
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Prox DVT',
        dataSource: 'proxDvtDS',
        performance: {
          type: 'dbeta',
          parameters: {alpha: 8, beta: 121}
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Dist DVT',
        dataSource: 'distDvtDS',
        performance: {
          type: 'dbeta',
          parameters: {alpha: 32, beta: 97}
        }
      },
      {
        alternative: 'Enox',
        criterion: 'Bleed',
        dataSource: 'bleedDS',
        performance: {
          type: 'dbeta',
          parameters: {alpha: 5, beta: 124}
        }
      }
    ],
    schemaVersion: '1.1.0'
  };
}

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
