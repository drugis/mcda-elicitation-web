'use strict';
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
