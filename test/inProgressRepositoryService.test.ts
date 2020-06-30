import IAlternative from '@shared/interface/IAlternative';
import IAlternativeQueryResult from '@shared/interface/IAlternativeQueryResult';
import ICriterion from '@shared/interface/ICriterion';
import ICriterionQueryResult from '@shared/interface/ICriterionQueryResult';
import IDataSource from '@shared/interface/IDataSource';
import IDataSourceQueryResult from '@shared/interface/IDataSourceQueryResult';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IInProgressWorkspace from '@shared/interface/IInProgressWorkspace';
import IInputCellQueryResult from '@shared/interface/IInputCellQueryResult';
import IOrdering from '@shared/interface/IOrdering';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IWorkspaceQueryResult from '@shared/interface/IWorkspaceQueryResult';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {CURRENT_SCHEMA_VERSION} from 'app/ts/ManualInput/constants';
import {
  createOrdering,
  createProblem,
  mapAlternatives,
  mapCellValues,
  mapCombinedResults,
  mapCriteria,
  mapDataSources,
  mapWorkspace
} from '../node-backend/inProgressRepositoryService';

describe('mapWorkspace', () => {
  test('should map query results', () => {
    const inProgressWorkspace: IWorkspaceQueryResult = {
      id: 1,
      title: 'title',
      owner: 10,
      state: {},
      therapeuticcontext: 'context',
      usefavourability: false
    };
    const result = mapWorkspace(inProgressWorkspace);
    const expectedResult: IInProgressWorkspace = {
      id: inProgressWorkspace.id,
      title: inProgressWorkspace.title,
      therapeuticContext: inProgressWorkspace.therapeuticcontext,
      useFavourability: inProgressWorkspace.usefavourability
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('mapCriteria', () => {
  test('should map and order criteria', () => {
    const criteria: ICriterionQueryResult[] = [
      {
        id: 'crit1Id',
        title: 'criterion 1',
        inprogressworkspaceid: 1,
        description: 'description',
        isfavourable: true,
        orderindex: 2
      },
      {
        id: 'crit2Id',
        title: 'criterion 2',
        inprogressworkspaceid: 1,
        description: 'description',
        isfavourable: true,
        orderindex: 1
      }
    ];
    const result = mapCriteria(criteria);
    const expectedResult: ICriterion[] = [
      {
        id: criteria[1].id,
        description: criteria[1].description,
        title: criteria[1].title,
        dataSources: [],
        isFavourable: criteria[1].isfavourable
      },
      {
        id: criteria[0].id,
        description: criteria[0].description,
        title: criteria[0].title,
        dataSources: [],
        isFavourable: criteria[0].isfavourable
      }
    ];
    expect(result).toEqual(expectedResult);
  });
});

describe('mapAlternatives', () => {
  test('should map and order alternatives', () => {
    const alternatives: IAlternativeQueryResult[] = [
      {
        id: 'altId1',
        inprogressworkspaceid: 1,
        title: 'alternative 1',
        orderindex: 2
      },
      {
        id: 'altId2',
        inprogressworkspaceid: 1,
        title: 'alternative 2',
        orderindex: 1
      }
    ];
    const result = mapAlternatives(alternatives);
    const expectedResult: IAlternative[] = [
      {
        id: alternatives[1].id,
        title: alternatives[1].title
      },
      {
        id: alternatives[0].id,
        title: alternatives[0].title
      }
    ];
    expect(result).toEqual(expectedResult);
  });
});

describe('mapDataSources', () => {
  test('should map and order data sources', () => {
    const dataSources: IDataSourceQueryResult[] = [
      {
        id: 'dsId1',
        inprogressworkspaceid: 1,
        orderindex: 2,
        criterionid: 'critId1',
        reference: 'reference',
        strengthofevidence: 'strengths',
        uncertainty: 'uncertainties',
        unitlabel: '%',
        unitlowerbound: null,
        unitupperbound: null,
        unittype: UnitOfMeasurementType.percentage
      },
      {
        id: 'dsId2',
        inprogressworkspaceid: 1,
        orderindex: 1,
        criterionid: 'critId1',
        reference: 'reference',
        strengthofevidence: 'strengths',
        uncertainty: 'uncertainties',
        unitlabel: '',
        unitlowerbound: 0,
        unitupperbound: 1,
        unittype: UnitOfMeasurementType.custom
      }
    ];
    const result = mapDataSources(dataSources);
    const expectedResult: IDataSource[] = [
      {
        id: dataSources[1].id,
        criterionId: dataSources[1].criterionid,
        reference: dataSources[1].reference,
        strengthOfEvidence: dataSources[1].strengthofevidence,
        uncertainty: dataSources[1].uncertainty,
        unitOfMeasurement: {
          label: dataSources[1].unitlabel,
          lowerBound: dataSources[1].unitlowerbound,
          upperBound: dataSources[1].unitupperbound,
          type: dataSources[1].unittype
        }
      },
      {
        id: dataSources[0].id,
        criterionId: dataSources[0].criterionid,
        reference: dataSources[0].reference,
        strengthOfEvidence: dataSources[0].strengthofevidence,
        uncertainty: dataSources[0].uncertainty,
        unitOfMeasurement: {
          label: dataSources[0].unitlabel,
          lowerBound: undefined,
          upperBound: undefined,
          type: dataSources[0].unittype
        }
      }
    ];
    expect(result).toEqual(expectedResult);
  });
});

describe('mapCellValues', () => {
  test('should map effects and distributions', () => {
    const dataSourceId = 'dsId';
    const criterionId = 'critId';
    const basicProperties: IInputCellQueryResult = {
      alternativeid: 'altId',
      datasourceid: dataSourceId,
      criterionid: criterionId,
      inprogressworkspaceid: 1,
      val: null,
      lowerbound: null,
      upperbound: null,
      isnotestimablelowerbound: false,
      isnotestimableupperbound: false,
      txt: null,
      mean: null,
      standarderror: null,
      alpha: null,
      beta: null,
      celltype: 'effect',
      inputtype: 'value'
    };
    const effects: IInputCellQueryResult[] = [
      {
        ...basicProperties,
        alternativeid: 'alt1Id',
        val: 1,
        celltype: 'effect',
        inputtype: 'value'
      },
      {
        ...basicProperties,
        alternativeid: 'alt2Id',
        val: 1,
        lowerbound: 0,
        upperbound: 2,
        isnotestimablelowerbound: false,
        isnotestimableupperbound: false,
        celltype: 'effect',
        inputtype: 'valueCI'
      },
      {
        ...basicProperties,
        alternativeid: 'alt3Id',
        lowerbound: 0,
        upperbound: 2,
        celltype: 'effect',
        inputtype: 'range'
      },
      {
        ...basicProperties,
        alternativeid: 'alt4Id',
        celltype: 'effect',
        inputtype: 'empty'
      },
      {
        ...basicProperties,
        alternativeid: 'alt5Id',
        celltype: 'effect',
        inputtype: 'text',
        txt: 'foo'
      }
    ];
    const distributions: IInputCellQueryResult[] = [
      {
        ...basicProperties,
        alternativeid: 'alt1Id',
        val: 1,
        celltype: 'distribution',
        inputtype: 'value'
      },
      {
        ...basicProperties,
        alternativeid: 'alt2Id',
        lowerbound: 0,
        upperbound: 2,
        celltype: 'distribution',
        inputtype: 'range'
      },
      {
        ...basicProperties,
        alternativeid: 'alt3Id',
        celltype: 'distribution',
        inputtype: 'empty'
      },
      {
        ...basicProperties,
        alternativeid: 'alt4Id',
        celltype: 'distribution',
        inputtype: 'text',
        txt: 'foo'
      },
      {
        ...basicProperties,
        alternativeid: 'alt5Id',
        celltype: 'distribution',
        inputtype: 'normal',
        mean: 1,
        standarderror: 0.5
      },
      {
        ...basicProperties,
        alternativeid: 'alt6Id',
        celltype: 'distribution',
        inputtype: 'beta',
        alpha: 1,
        beta: 2
      },
      {
        ...basicProperties,
        alternativeid: 'alt7Id',
        celltype: 'distribution',
        inputtype: 'gamma',
        alpha: 1,
        beta: 2
      }
    ];
    const cellValues: IInputCellQueryResult[] = [...effects, ...distributions];
    const result = mapCellValues(cellValues);
    const sharedProperties = {
      dataSourceId: dataSourceId,
      criterionId: criterionId
    };
    const expectedEffects: Record<string, Record<string, Effect>> = {
      dsId: {
        alt1Id: {
          ...sharedProperties,
          alternativeId: effects[0].alternativeid,
          type: 'value',
          value: effects[0].val
        },
        alt2Id: {
          ...sharedProperties,
          alternativeId: effects[1].alternativeid,
          type: 'valueCI',
          value: effects[1].val,
          isNotEstimableLowerBound: effects[1].isnotestimablelowerbound,
          isNotEstimableUpperBound: effects[1].isnotestimableupperbound,
          lowerBound: effects[1].lowerbound,
          upperBound: effects[1].upperbound
        },
        alt3Id: {
          ...sharedProperties,
          alternativeId: effects[2].alternativeid,
          type: 'range',
          lowerBound: effects[2].lowerbound,
          upperBound: effects[2].upperbound
        },
        alt4Id: {
          ...sharedProperties,
          alternativeId: effects[3].alternativeid,
          type: 'empty'
        },
        alt5Id: {
          ...sharedProperties,
          alternativeId: effects[4].alternativeid,
          type: 'text',
          text: effects[4].txt
        }
      }
    };
    const expectedDistributions: Record<
      string,
      Record<string, Distribution>
    > = {
      dsId: {
        alt1Id: {
          ...sharedProperties,
          alternativeId: distributions[0].alternativeid,
          type: 'value',
          value: distributions[0].val
        },
        alt2Id: {
          ...sharedProperties,
          alternativeId: distributions[1].alternativeid,
          type: 'range',
          lowerBound: distributions[1].lowerbound,
          upperBound: distributions[1].upperbound
        },
        alt3Id: {
          ...sharedProperties,
          alternativeId: distributions[2].alternativeid,
          type: 'empty'
        },
        alt4Id: {
          ...sharedProperties,
          alternativeId: distributions[3].alternativeid,
          type: 'text',
          text: distributions[3].txt
        },
        alt5Id: {
          ...sharedProperties,
          alternativeId: distributions[4].alternativeid,
          type: 'normal',
          mean: distributions[4].mean,
          standardError: distributions[4].standarderror
        },
        alt6Id: {
          ...sharedProperties,
          alternativeId: distributions[5].alternativeid,
          type: 'beta',
          alpha: distributions[5].alpha,
          beta: distributions[5].beta
        },
        alt7Id: {
          ...sharedProperties,
          alternativeId: distributions[6].alternativeid,
          type: 'gamma',
          alpha: distributions[6].alpha,
          beta: distributions[6].beta
        }
      }
    };

    const expectedResult: [
      Record<string, Record<string, Effect>>,
      Record<string, Record<string, Distribution>>
    ] = [expectedEffects, expectedDistributions];

    expect(result).toEqual(expectedResult);
  });
});

describe('mapCombinedResults', () => {
  test('should build the workspace message and map datasources on criteria', () => {
    const criterionId = 'critId';
    const alternativeId = 'altId';
    const dataSourceId = 'dsId';
    const inProgressWorkspace: IInProgressWorkspace = {
      id: 1,
      title: 'title',
      therapeuticContext: 'context',
      useFavourability: false
    };
    const criteria: ICriterion[] = [
      {
        id: criterionId,
        description: 'description',
        title: 'criterion 1',
        dataSources: [],
        isFavourable: true
      }
    ];
    const alternatives: IAlternative[] = [
      {
        id: alternativeId,
        title: 'alternative 1'
      }
    ];
    const dataSources: IDataSource[] = [
      {
        id: dataSourceId,
        criterionId: criterionId,
        reference: 'reference',
        strengthOfEvidence: 'strengths',
        uncertainty: 'uncertainties',
        unitOfMeasurement: {
          label: '%',
          lowerBound: 0,
          upperBound: 100,
          type: UnitOfMeasurementType.percentage
        }
      }
    ];
    const sharedProperties = {
      criterionId: criterionId,
      dataSourceId: dataSourceId,
      alternativeId: alternativeId
    };
    const effects: Record<string, Record<string, Effect>> = {
      dsId: {
        altId: {
          ...sharedProperties,
          type: 'value',
          value: 1
        }
      }
    };
    const distributions: Record<string, Record<string, Distribution>> = {
      dsId: {
        altId: {
          ...sharedProperties,
          type: 'value',
          value: 1
        }
      }
    };
    const mapperResults: [
      IInProgressWorkspace,
      ICriterion[],
      IAlternative[],
      IDataSource[],
      [
        Record<string, Record<string, Effect>>,
        Record<string, Record<string, Distribution>>
      ]
    ] = [
      inProgressWorkspace,
      criteria,
      alternatives,
      dataSources,
      [effects, distributions]
    ];

    const result = mapCombinedResults(mapperResults);

    const expectedCriteria: ICriterion[] = [
      {
        ...criteria[0],
        dataSources: dataSources
      }
    ];
    const expectedResult: IInProgressMessage = {
      workspace: inProgressWorkspace,
      criteria: expectedCriteria,
      alternatives: alternatives,
      effects: effects,
      distributions: distributions
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('createProblem', () => {
  test('should create a problem from in-progress workspace', () => {
    const criterionId = 'critId';
    const dataSourceId = 'dsId';
    const inProgressWorkspace: IInProgressWorkspace = {
      id: 1,
      title: 'title',
      therapeuticContext: 'context',
      useFavourability: false
    };
    const criteria: ICriterion[] = [
      {
        id: criterionId,
        description: 'description',
        title: 'criterion 1',
        dataSources: [
          {
            id: dataSourceId,
            criterionId: criterionId,
            reference: 'reference',
            strengthOfEvidence: 'strengths',
            uncertainty: 'uncertainties',
            unitOfMeasurement: {
              label: '%',
              lowerBound: 0,
              upperBound: 100,
              type: UnitOfMeasurementType.percentage
            }
          }
        ],
        isFavourable: true
      }
    ];
    const alternatives: IAlternative[] = [
      {
        id: 'alt1Id',
        title: 'alternative 1'
      },
      {
        id: 'alt2Id',
        title: 'alternative 2'
      },
      {
        id: 'alt3Id',
        title: 'alternative 3'
      },
      {
        id: 'alt4Id',
        title: 'alternative 4'
      },
      {
        id: 'alt5Id',
        title: 'alternative 5'
      },
      {
        id: 'alt6Id',
        title: 'alternative 6'
      },
      {
        id: 'alt7Id',
        title: 'alternative 7'
      }
    ];
    const criterionAndDataSourceIds = {
      criterionId: criterionId,
      dataSourceId: dataSourceId
    };
    const effects: Record<string, Record<string, Effect>> = {
      dsId: {
        alt1Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt1Id',
          type: 'value',
          value: 1
        },
        alt2Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt2Id',
          type: 'empty'
        },
        alt3Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt3Id',
          type: 'valueCI',
          value: 1,
          lowerBound: 0,
          upperBound: 2,
          isNotEstimableLowerBound: false,
          isNotEstimableUpperBound: false
        },
        alt4Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt4Id',
          type: 'range',
          lowerBound: 0,
          upperBound: 2
        },
        alt5Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt5Id',
          type: 'text',
          text: 'foo'
        },
        alt6Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt6Id',
          type: 'empty'
        },
        alt7Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt7Id',
          type: 'empty'
        }
      }
    };
    const distributions: Record<string, Record<string, Distribution>> = {
      dsId: {
        alt1Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt1Id',
          type: 'value',
          value: 1
        },
        alt3Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt3Id',
          type: 'range',
          lowerBound: 0,
          upperBound: 2
        },
        alt4Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt4Id',
          type: 'normal',
          mean: 1,
          standardError: 0.5
        },
        alt5Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt5Id',
          type: 'beta',
          alpha: 1,
          beta: 2
        },
        alt6Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt6Id',
          type: 'gamma',
          alpha: 1,
          beta: 2
        },
        alt7Id: {
          ...criterionAndDataSourceIds,
          alternativeId: 'alt7Id',
          type: 'text',
          text: 'foo'
        }
      }
    };
    const inProgressMessage: IInProgressMessage = {
      workspace: inProgressWorkspace,
      criteria: criteria,
      alternatives: alternatives,
      effects: effects,
      distributions: distributions
    };

    const result = createProblem(inProgressMessage);

    const expectedCriteria: Record<string, IProblemCriterion> = {
      critId: {
        title: criteria[0].title,
        description: criteria[0].description,
        isFavorable: criteria[0].isFavourable,
        dataSources: [
          {
            id: dataSourceId,
            source: criteria[0].dataSources[0].reference,
            unitOfMeasurement: {
              type: criteria[0].dataSources[0].unitOfMeasurement.type,
              label: criteria[0].dataSources[0].unitOfMeasurement.label
            },
            strengthOfEvidence: criteria[0].dataSources[0].strengthOfEvidence,
            uncertainties: criteria[0].dataSources[0].uncertainty,
            scale: [
              criteria[0].dataSources[0].unitOfMeasurement.lowerBound,
              criteria[0].dataSources[0].unitOfMeasurement.upperBound
            ]
          }
        ]
      }
    };
    const expectedAlternatives: Record<string, {title: string}> = {
      alt1Id: {
        title: alternatives[0].title
      },
      alt2Id: {
        title: alternatives[1].title
      },
      alt3Id: {
        title: alternatives[2].title
      },
      alt4Id: {
        title: alternatives[3].title
      },
      alt5Id: {
        title: alternatives[4].title
      },
      alt6Id: {
        title: alternatives[5].title
      },
      alt7Id: {
        title: alternatives[6].title
      }
    };

    const criterionAndDataSource = {
      criterion: criterionId,
      dataSource: dataSourceId
    };
    const expectedPerformanceTable: IPerformanceTableEntry[] = [
      {
        ...criterionAndDataSource,
        alternative: 'alt1Id',
        performance: {
          effect: {
            type: 'exact',
            value: 1
          },
          distribution: {
            type: 'exact',
            value: 1
          }
        }
      },
      {
        ...criterionAndDataSource,
        alternative: 'alt2Id',
        performance: {
          effect: {
            type: 'empty'
          },
          distribution: {
            type: 'empty'
          }
        }
      },
      {
        ...criterionAndDataSource,
        alternative: 'alt3Id',
        performance: {
          effect: {
            type: 'exact',
            value: 1,
            input: {
              value: 1,
              lowerBound: 0,
              upperBound: 2
            }
          },
          distribution: {
            type: 'range',
            parameters: {
              lowerBound: 0,
              upperBound: 0.02
            }
          }
        }
      },
      {
        ...criterionAndDataSource,
        alternative: 'alt4Id',
        performance: {
          effect: {
            type: 'exact',
            value: 0.01,
            input: {
              lowerBound: 0,
              upperBound: 2
            }
          },
          distribution: {
            type: 'dnorm',
            parameters: {
              mu: 1,
              sigma: 0.5
            }
          }
        }
      },
      {
        ...criterionAndDataSource,
        alternative: 'alt5Id',
        performance: {
          effect: {
            type: 'empty',
            value: 'foo'
          },
          distribution: {
            type: 'dbeta',
            parameters: {
              alpha: 1,
              beta: 2
            }
          }
        }
      },
      {
        ...criterionAndDataSource,
        alternative: 'alt6Id',
        performance: {
          effect: {
            type: 'empty'
          },
          distribution: {
            type: 'dgamma',
            parameters: {
              alpha: 1,
              beta: 2
            }
          }
        }
      },
      {
        ...criterionAndDataSource,
        alternative: 'alt7Id',
        performance: {
          effect: {
            type: 'empty'
          },
          distribution: {
            type: 'empty',
            value: 'foo'
          }
        }
      }
    ];
    const expectedResult: IProblem = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      title: inProgressWorkspace.title,
      description: inProgressWorkspace.therapeuticContext,
      criteria: expectedCriteria,
      alternatives: expectedAlternatives,
      performanceTable: expectedPerformanceTable
    };

    expect(result).toEqual(expectedResult);
  });
});

describe('createOrdering', () => {
  test('should create ordering', () => {
    const criteria: Record<string, IProblemCriterion> = {
      crit1Id: {
        title: 'title',
        description: 'description',
        isFavorable: false,
        dataSources: [
          {
            id: 'ds1Id',
            source: 'reference',
            unitOfMeasurement: {
              type: UnitOfMeasurementType.percentage,
              label: '%'
            },
            strengthOfEvidence: 'strengths',
            uncertainties: 'uncertainties',
            scale: [0, 100]
          }
        ]
      },
      crit2Id: {
        title: 'title',
        description: 'description',
        isFavorable: false,
        dataSources: [
          {
            id: 'ds2Id',
            source: 'reference',
            unitOfMeasurement: {
              type: UnitOfMeasurementType.percentage,
              label: '%'
            },
            strengthOfEvidence: 'strengths',
            uncertainties: 'uncertainties',
            scale: [0, 100]
          }
        ]
      }
    };
    const alternatives: Record<string, {title: string}> = {
      alt1Id: {
        title: 'alternative'
      }
    };

    const result = createOrdering(criteria, alternatives);

    const expectedResult: IOrdering = {
      criteria: ['crit1Id', 'crit2Id'],
      alternatives: ['alt1Id'],
      dataSources: ['ds1Id', 'ds2Id']
    };

    expect(result).toEqual(expectedResult);
  });
});
