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
