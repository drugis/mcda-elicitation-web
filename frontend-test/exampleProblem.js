'use strict';
function exampleProblem() {
  return {
    title: 'Thrombolytics Example',
    criteria: {
      'Prox DVT': {
        id: 'Prox DVT',
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
        id: 'Dist DVT',
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
        id: 'Bleed',
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
        id: 'Bleed2',
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
        id: 'Bleed3',
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
        id: 'null2Infinity',
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
        id: 'Hep',
        title: 'Heparin'
      },
      Enox: {
        id: 'Enox',
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
    schemaVersion: '1.4.7'
  };
}
