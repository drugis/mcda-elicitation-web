import IAlternative from '@shared/interface/IAlternative';
import IAlternativeQueryResult from '@shared/interface/IAlternativeQueryResult';
import ICriterion from '@shared/interface/ICriterion';
import ICriterionQueryResult from '@shared/interface/ICriterionQueryResult';
import IDatabaseInputCell from '@shared/interface/IDatabaseInputCell';
import IDataSource from '@shared/interface/IDataSource';
import IDataSourceQueryResult from '@shared/interface/IDataSourceQueryResult';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IInProgressWorkspace from '@shared/interface/IInProgressWorkspace';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IOrdering from '@shared/interface/IOrdering';
import ITextEffect from '@shared/interface/ITextEffect';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceQueryResult from '@shared/interface/IWorkspaceQueryResult';
import {effectPerformanceType} from '@shared/interface/Problem/IEffectPerformance';
import IEmptyPerformance from '@shared/interface/Problem/IEmptyPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import ITextPerformance from '@shared/interface/Problem/ITextPerformance';
import IValueCIPerformance from '@shared/interface/Problem/IValueCIPerformance';
import IValuePerformance from '@shared/interface/Problem/IValuePerformance';
import {CURRENT_SCHEMA_VERSION} from 'app/ts/ManualInput/constants';
import _ from 'lodash';
import {
  buildDistribution,
  buildEffect,
  buildEmptyInProgress,
  buildInProgressAlternatives,
  buildInProgressCopy,
  buildInProgressCriteria,
  buildInProgressDataSources,
  buildInProgressDistributions,
  buildInProgressEffects,
  buildInProgressWorkspace,
  buildPercentageMap,
  createBoundEffect,
  createEmptyOrTextEffect,
  createExactEffect,
  createOrdering,
  createProblem,
  isNotNMAEntry,
  mapAlternatives,
  mapCellValues,
  mapCombinedResults,
  mapCriteria,
  mapDataSources,
  mapToCellCommands,
  mapWorkspace,
  finishDistributionCreation
} from '../node-backend/inProgressRepositoryService';
import IRangeDistributionPerformance from '@shared/interface/Problem/IRangeDistributionPerformance';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IBetaPerformance from '@shared/interface/Problem/IBetaPerformance';
import IBetaDistribution from '@shared/interface/IBetaDistribution';
import IGammaPerformance from '@shared/interface/Problem/IGammaPerformance';
import IGammaDistribution from '@shared/interface/IGammaDistribution';
import INormalPerformance from '@shared/interface/Problem/INormalPerformance';
import INormalDistribution from '@shared/interface/INormalDistribution';

const criterion1Id = 'crit1Id';
const dataSource1Id = 'ds1Id';
const alternative1Id = 'alt1Id';

const emptyEffect: IEmptyEffect = {
  type: 'empty',
  alternativeId: 'newAlt1',
  criterionId: 'newCrit1',
  dataSourceId: 'newDs1'
};

const effectBase = {
  alternativeId: 'newAlt1',
  criterionId: 'newCrit1',
  dataSourceId: 'newDs1'
};

const idMap: Record<string, string> = {
  crit1Id: 'newCrit1',
  alt1Id: 'newAlt1',
  ds1Id: 'newDs1'
};
const isPercentageMap: Record<string, boolean> = {ds1Id: true};

describe('inProgressRepositoryService', () => {
  describe('mapWorkspace', () => {
    it('should map query results', () => {
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
    it('should map and order criteria', () => {
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
    it('should map and order alternatives', () => {
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
    it('should map and order data sources', () => {
      const dataSources: IDataSourceQueryResult[] = [
        {
          id: dataSource1Id,
          inprogressworkspaceid: 1,
          orderindex: 2,
          criterionid: criterion1Id,
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
          criterionid: criterion1Id,
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
    it('should map effects and distributions', () => {
      const basicProperties: IDatabaseInputCell = {
        alternativeid: alternative1Id,
        datasourceid: dataSource1Id,
        criterionid: criterion1Id,
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
      const effects: IDatabaseInputCell[] = [
        {
          ...basicProperties,
          alternativeid: alternative1Id,
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
      const distributions: IDatabaseInputCell[] = [
        {
          ...basicProperties,
          alternativeid: alternative1Id,
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
      const cellValues: IDatabaseInputCell[] = [...effects, ...distributions];
      const result = mapCellValues(cellValues);
      const sharedProperties = {
        dataSourceId: dataSource1Id,
        criterionId: criterion1Id
      };
      const expectedEffects: Record<string, Record<string, Effect>> = {
        ds1Id: {
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
        ds1Id: {
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
    it('should build the workspace message and map datasources on criteria', () => {
      const inProgressWorkspace: IInProgressWorkspace = {
        id: 1,
        title: 'title',
        therapeuticContext: 'context',
        useFavourability: false
      };
      const criteria: ICriterion[] = [
        {
          id: criterion1Id,
          description: 'description',
          title: 'criterion 1',
          dataSources: [],
          isFavourable: true
        }
      ];
      const alternatives: IAlternative[] = [
        {
          id: alternative1Id,
          title: 'alternative 1'
        }
      ];
      const dataSources: IDataSource[] = [
        {
          id: dataSource1Id,
          criterionId: criterion1Id,
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
        criterionId: criterion1Id,
        dataSourceId: dataSource1Id,
        alternativeId: alternative1Id
      };
      const effects: Record<string, Record<string, Effect>> = {
        ds1Id: {
          altId: {
            ...sharedProperties,
            type: 'value',
            value: 1
          }
        }
      };
      const distributions: Record<string, Record<string, Distribution>> = {
        ds1Id: {
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
    const inProgressWorkspace: IInProgressWorkspace = {
      id: 1,
      title: 'title',
      therapeuticContext: 'context',
      useFavourability: false
    };
    const criteria: ICriterion[] = [
      {
        id: criterion1Id,
        description: 'description',
        title: 'criterion 1',
        dataSources: [
          {
            id: dataSource1Id,
            criterionId: criterion1Id,
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
        id: alternative1Id,
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
      criterionId: criterion1Id,
      dataSourceId: dataSource1Id
    };
    const effects: Record<string, Record<string, Effect>> = {
      ds1Id: {
        alt1Id: {
          ...criterionAndDataSourceIds,
          alternativeId: alternative1Id,
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
      ds1Id: {
        alt1Id: {
          ...criterionAndDataSourceIds,
          alternativeId: alternative1Id,
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

    it('should create a problem from in-progress workspace', () => {
      const inProgressMessage: IInProgressMessage = {
        workspace: inProgressWorkspace,
        criteria: criteria,
        alternatives: alternatives,
        effects: effects,
        distributions: distributions
      };

      const result = createProblem(inProgressMessage);

      const expectedCriteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          title: criteria[0].title,
          description: criteria[0].description,
          dataSources: [
            {
              id: dataSource1Id,
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
        criterion: criterion1Id,
        dataSource: dataSource1Id
      };
      const expectedPerformanceTable: IPerformanceTableEntry[] = [
        {
          ...criterionAndDataSource,
          alternative: alternative1Id,
          performance: {
            effect: {
              type: 'exact',
              value: 0.01
            },
            distribution: {
              type: 'exact',
              value: 0.01
            }
          }
        },
        {
          ...criterionAndDataSource,
          alternative: 'alt2Id',
          performance: {
            effect: {
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
              value: 0.01,
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
                mu: 0.01,
                sigma: 0.005
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

    it('should throw an error if a cell has neither an effect or a distribution', () => {
      const inProgressMessage: IInProgressMessage = {
        workspace: inProgressWorkspace,
        criteria: criteria,
        alternatives: alternatives,
        effects: {
          ds1Id: {
            alt1Id: {} as Effect
          }
        },
        distributions: {
          ds1Id: {
            alt1Id: {} as Distribution
          }
        }
      };
      try {
        createProblem(inProgressMessage);
      } catch (error) {
        expect(error).toBe('Cell without effect and distribution found');
      }
    });
  });

  describe('createOrdering', () => {
    it('should create ordering', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          title: 'title',
          description: 'description',
          isFavorable: false,
          dataSources: [
            {
              id: dataSource1Id,
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
        alternatives: [alternative1Id],
        dataSources: [dataSource1Id, 'ds2Id']
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe('buildEmptyInProgress', () => {
    it('should return a new workspace ready to insert into the database', () => {
      const result = buildEmptyInProgress();
      const expectedWorkspace = {
        title: 'new workspace',
        therapeuticContext: '',
        useFavourability: true
      };
      expect(result.workspace).toEqual(expectedWorkspace);

      const expectedCriterion = {
        isFavourable: true,
        title: `criterion 1`,
        description: ''
      };
      expect(_.omit(result.criteria[0], ['id', 'dataSources'])).toEqual(
        expectedCriterion
      );

      const expectedDataSource = {
        reference: '',
        uncertainty: '',
        strengthOfEvidence: '',
        unitOfMeasurement: {
          label: '',
          type: UnitOfMeasurementType.custom
        }
      };
      expect(
        _.omit(result.criteria[0].dataSources[0], ['id', 'criterionId'])
      ).toEqual(expectedDataSource);

      expect(result.criteria[1].title).toEqual('criterion 2');
      expect(result.alternatives[0].title).toEqual('alternative 1');
      expect(result.alternatives[1].title).toEqual('alternative 2');
      expect(result.effects).toEqual([]);
      expect(result.distributions).toEqual([]);
    });
  });

  describe('buildInProgressCopy', () => {
    const problem: IProblem = {
      schemaVersion: 'some version',
      performanceTable: [],
      description: '',
      title: 'my workspace',
      alternatives: {},
      criteria: {}
    };
    const oldWorkspace: IOldWorkspace = {
      id: 37,
      owner: 1,
      problem: problem,
      defaultSubproblemId: 2,
      defaultScenarioId: 3
    };
    it('should be able to copy a workspace', () => {
      const result = buildInProgressCopy(oldWorkspace);
      const expectedWorkspace = {
        title: 'Copy of my workspace',
        therapeuticContext: '',
        useFavourability: false
      };
      const expectedResult: IWorkspace = {
        alternatives: [],
        criteria: [],
        distributions: [],
        effects: [],
        workspace: expectedWorkspace
      };
      expect(result).toEqual(expectedResult);
    });

    describe('buildInProgressWorkspace', () => {
      it('should return the workspace properties and check for favourability', () => {
        const criteria: Record<string, IProblemCriterion> = {
          crit1Id: {
            title: 'criterion 1',
            description: '',
            isFavorable: false,
            dataSources: []
          }
        };
        const result = buildInProgressWorkspace({
          ...oldWorkspace,
          problem: {...oldWorkspace.problem, criteria: criteria}
        });
        const expectedWorkspace = {
          title: 'Copy of my workspace',
          therapeuticContext: '',
          useFavourability: true
        };
        expect(result).toEqual(expectedWorkspace);
      });
    });

    describe('buildInProgressCriteria', () => {
      it('should return the transformed criteria and a map of the old to the new ids', () => {
        const criteria: Record<string, IProblemCriterion> = {
          crit1Id: {
            dataSources: [],
            isFavorable: true,
            description: 'hello',
            title: 'criterion 1'
          }
        };
        const result = buildInProgressCriteria(criteria);

        expect(_.keys(result.criteriaAndDataSourceIdMap).length).toBe(1);
        expect(result.criteriaAndDataSourceIdMap[criterion1Id]).toBeTruthy();

        const expectedCriterion = {
          title: 'criterion 1',
          isFavourable: true,
          dataSources: [] as any[],
          description: 'hello'
        };
        expect(_.omit(result.criteria[0], ['id'])).toEqual(expectedCriterion);
      });
    });

    describe('buildInProgressDataSources', () => {
      it('should return all the transformed data sources and a map of the old to the new ids', () => {
        const criterion: IProblemCriterion = {
          title: 'criterion 1',
          description: '',
          dataSources: [
            {
              id: dataSource1Id,
              scale: [0, 100],
              source: 'ref',
              strengthOfEvidence: 'str',
              uncertainties: 'unc',
              unitOfMeasurement: {
                label: '%',
                type: UnitOfMeasurementType.percentage
              }
            }
          ]
        };
        const result = buildInProgressDataSources(criterion, criterion1Id);

        expect(_.keys(result.dataSourcesIdMap).length).toBe(1);
        expect(result.dataSourcesIdMap[dataSource1Id]).toBeTruthy();

        const expectedDataSource = {
          reference: 'ref',
          strengthOfEvidence: 'str',
          uncertainty: 'unc',
          unitOfMeasurement: {
            label: '%',
            type: UnitOfMeasurementType.percentage,
            lowerBound: 0,
            upperBound: 100
          },
          criterionId: criterion1Id
        };
        expect(_.omit(result.dataSources[0], ['id'])).toEqual(
          expectedDataSource
        );
      });
    });

    describe('buildInProgressAlternatives', () => {
      it('should return the transformed alternatives and a map from the old to the new ids', () => {
        const alternatives: Record<string, {title: string}> = {
          alt1Id: {title: 'alternative 1'}
        };
        const result = buildInProgressAlternatives(alternatives);

        expect(_.keys(result.alternativesIdMap).length).toBe(1);
        expect(result.alternativesIdMap[alternative1Id]).toBeTruthy();

        const expectedAlternative = {title: 'alternative 1'};
        expect(_.omit(result.alternatives[0], ['id'])).toEqual(
          expectedAlternative
        );
      });
    });

    describe('buildInProgressEffects', () => {
      it('should filter out non effect entries', () => {
        const idMap: Record<string, string> = {};
        const isPercentageMap: Record<string, boolean> = {};
        const performanceTable: IPerformanceTableEntry[] = [
          {
            alternative: alternative1Id,
            dataSource: dataSource1Id,
            criterion: criterion1Id,
            performance: {distribution: {type: 'empty'}}
          }
        ];
        const result = buildInProgressEffects(
          performanceTable,
          idMap,
          isPercentageMap
        );
        expect(result.length).toBe(0);
      });
    });
    describe('isNotNMAEntry', () => {
      it('should return true if the entry has an alternative property', () => {
        const entry = {alternative: alternative1Id} as IPerformanceTableEntry;
        const result = isNotNMAEntry(entry);
        expect(result).toBe(true);
      });

      it('should return false if the entry has no alternative property', () => {
        const entry = {} as IPerformanceTableEntry;
        const result = isNotNMAEntry(entry);
        expect(result).toBe(false);
      });
    });

    describe('buildEffect', () => {
      it('should build an empty performance', () => {
        const entry: IPerformanceTableEntry = {
          alternative: alternative1Id,
          criterion: criterion1Id,
          dataSource: dataSource1Id,
          performance: {
            effect: {type: 'empty'}
          }
        };
        const result = buildEffect(idMap, isPercentageMap, entry);

        expect(result).toEqual(emptyEffect);
      });

      it('should build an effect value performance, considering percentage unit', () => {
        const entry: IPerformanceTableEntry = {
          alternative: alternative1Id,
          criterion: criterion1Id,
          dataSource: dataSource1Id,
          performance: {
            effect: {type: 'exact', value: 37}
          }
        };
        const result = buildEffect(idMap, isPercentageMap, entry);
        const expectedResult: IValueEffect = {
          type: 'value',
          value: 3700,
          alternativeId: 'newAlt1',
          criterionId: 'newCrit1',
          dataSourceId: 'newDs1'
        };
        expect(result).toEqual(expectedResult);
      });

      it('should throw an error for unknown effect types', () => {
        try {
          const unknown = 'unknown type' as effectPerformanceType;
          const entry = {
            alternative: alternative1Id,
            criterion: criterion1Id,
            dataSource: dataSource1Id,
            performance: {
              effect: {type: unknown}
            }
          } as IPerformanceTableEntry;
          buildEffect(idMap, isPercentageMap, entry);
        } catch (error) {
          expect(error).toBe('unknown effect type');
        }
      });
    });

    describe('createEmptyOrTextEffect', () => {
      it('should create an empty effect', () => {
        const performance: IEmptyPerformance = {type: 'empty'};
        const result = createEmptyOrTextEffect(performance, effectBase);
        expect(result).toEqual(emptyEffect);
      });

      it('should create an text effect', () => {
        const performance: ITextPerformance = {
          type: 'empty',
          value: 'some text'
        };
        const result = createEmptyOrTextEffect(performance, effectBase);
        const expectedResult: ITextEffect = {
          type: 'text',
          alternativeId: 'newAlt1',
          criterionId: 'newCrit1',
          dataSourceId: 'newDs1',
          text: 'some text'
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createExactEffect', () => {
      it('should build a value effect', () => {
        const performance: IValuePerformance = {
          type: 'exact',
          value: 37.0000001
        };
        const modifier = 1;
        const result = createExactEffect(performance, effectBase, modifier);
        const expectedResult: IValueEffect = {
          ...effectBase,
          type: 'value',
          value: 37
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a range or valueCI effect if there are bounds', () => {
        const performance: IValueCIPerformance = {
          type: 'exact',
          value: 37,
          input: {
            lowerBound: 20,
            upperBound: 40,
            value: 37
          }
        };
        const modifier = 1;
        const result = createExactEffect(performance, effectBase, modifier);
        const expectedResult: IValueCIEffect = {
          ...effectBase,
          type: 'valueCI',
          value: 37,
          isNotEstimableLowerBound: false,
          isNotEstimableUpperBound: false,
          lowerBound: 20,
          upperBound: 40
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a value effect if there are legacy inputs', () => {
        const performance = {
          type: 'exact',
          value: 37.0000001,
          input: {events: 20, samplesize: 201}
        } as IValuePerformance;
        const modifier = 1;
        const result = createExactEffect(performance, effectBase, modifier);
        const expectedResult: IValueEffect = {
          ...effectBase,
          type: 'value',
          value: 37
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createBoundEffect', () => {
      it('should build a value CI effect', () => {
        const input = {
          lowerBound: 20,
          upperBound: 40,
          value: 37
        };
        const result = createBoundEffect(input, effectBase);
        const expectedResult: IValueCIEffect = {
          ...effectBase,
          type: 'valueCI',
          value: 37,
          isNotEstimableLowerBound: false,
          isNotEstimableUpperBound: false,
          lowerBound: 20,
          upperBound: 40
        };
        expect(result).toEqual(expectedResult);
      });

      it('should build a value CI effect with NE bounds', () => {
        const input = {
          value: 37,
          lowerBound: 'NE' as 'NE' | number,
          upperBound: 'NE' as 'NE' | number
        };
        const result = createBoundEffect(input, effectBase);
        const expectedResult: IValueCIEffect = {
          ...effectBase,
          type: 'valueCI',
          value: 37,
          isNotEstimableLowerBound: true,
          isNotEstimableUpperBound: true,
          lowerBound: undefined,
          upperBound: undefined
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('buildInProgressDistributions', () => {
      it('should filter out non distribution entries', () => {
        const idMap: Record<string, string> = {};
        const isPercentageMap: Record<string, boolean> = {};
        const performanceTable: IPerformanceTableEntry[] = [
          {
            alternative: alternative1Id,
            dataSource: dataSource1Id,
            criterion: criterion1Id,
            performance: {effect: {type: 'empty'}}
          }
        ];
        const result = buildInProgressDistributions(
          performanceTable,
          idMap,
          isPercentageMap
        );
        expect(result.length).toBe(0);
      });
    });

    describe('buildDistribution', () => {
      it('should create the modifier and distributionbase and use them to finish the distribution', () => {
        const entry: IPerformanceTableEntry = {
          alternative: alternative1Id,
          criterion: criterion1Id,
          dataSource: dataSource1Id,
          performance: {distribution: {type: 'empty'}}
        };
        const result = buildDistribution(idMap, isPercentageMap, entry);
        expect(result).toEqual(emptyEffect);
      });
    });

    describe('finishDistributionCreation', () => {
      const modifier = 1;
      it('should create a value effect', () => {
        const performance: IValuePerformance = {type: 'exact', value: 37};
        const result = finishDistributionCreation(
          performance,
          effectBase,
          modifier
        );
        const expectedResult: IValueEffect = {
          ...effectBase,
          type: 'value',
          value: 37
        };
        expect(result).toEqual(expectedResult);
      });

      it('should create a beta distribution', () => {
        const performance: IBetaPerformance = {
          type: 'dbeta',
          parameters: {alpha: 37, beta: 42}
        };
        const result = finishDistributionCreation(
          performance,
          effectBase,
          modifier
        );
        const expectedResult: IBetaDistribution = {
          ...effectBase,
          type: 'beta',
          beta: 42,
          alpha: 37
        };
        expect(result).toEqual(expectedResult);
      });
      it('should create a gamma distribution', () => {
        const performance: IGammaPerformance = {
          type: 'dgamma',
          parameters: {alpha: 37, beta: 42}
        };
        const result = finishDistributionCreation(
          performance,
          effectBase,
          modifier
        );
        const expectedResult: IGammaDistribution = {
          ...effectBase,
          type: 'gamma',
          beta: 42,
          alpha: 37
        };
        expect(result).toEqual(expectedResult);
      });
      it('should create a normal distribution', () => {
        const performance: INormalPerformance = {
          type: 'dnorm',
          parameters: {mu: 37, sigma: 42}
        };
        const result = finishDistributionCreation(
          performance,
          effectBase,
          modifier
        );
        const expectedResult: INormalDistribution = {
          ...effectBase,
          type: 'normal',
          mean: 37,
          standardError: 42
        };
        expect(result).toEqual(expectedResult);
      });

      it('should create a range effect', () => {
        const performance: IRangeDistributionPerformance = {
          type: 'range',
          parameters: {lowerBound: 37, upperBound: 42}
        };
        const result = finishDistributionCreation(
          performance,
          effectBase,
          modifier
        );
        const expectedResult: IRangeEffect = {
          ...effectBase,
          type: 'range',
          upperBound: 42,
          lowerBound: 37
        };
        expect(result).toEqual(expectedResult);
      });

      it('should create an empty effect', () => {
        const performance: IEmptyPerformance = {type: 'empty'};
        const result = finishDistributionCreation(
          performance,
          effectBase,
          modifier
        );
        const expectedResult: IEmptyEffect = {
          ...effectBase,
          type: 'empty'
        };
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('mapToCellCommands', () => {
    it('should return an array of cell commands', () => {
      const tableCells: (Effect | Distribution)[] = [
        {
          alternativeId: 'alt1',
          criterionId: 'crit1',
          dataSourceId: 'ds1',
          type: 'value',
          value: 42
        }
      ];
      const inprogressId = 37;
      const cellType = 'distribution';
      const result = mapToCellCommands(tableCells, inprogressId, cellType);
      const expectedResult = [
        {
          alternativeId: 'alt1',
          criterionId: 'crit1',
          dataSourceId: 'ds1',
          type: 'value',
          value: 42,
          cellType: 'distribution',
          inProgressWorkspaceId: 37
        }
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('buildPercentageMap', () => {
    it('should return a map of data source ids to a boolean that indicates if it is a percentage', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          title: 'criterion 1',
          dataSources: [
            {
              id: 'ds1Id',
              scale: [0, 100],
              unitOfMeasurement: {
                label: '%',
                type: UnitOfMeasurementType.percentage
              },
              source: '',
              uncertainties: '',
              strengthOfEvidence: ''
            }
          ],
          description: ''
        },
        crit2Id: {
          title: 'criterion 2',
          description: '',
          dataSources: [
            {
              id: 'ds2Id',
              scale: [0, 1],
              unitOfMeasurement: {
                label: '',
                type: UnitOfMeasurementType.decimal
              },
              source: '',
              uncertainties: '',
              strengthOfEvidence: ''
            }
          ]
        }
      };
      const result = buildPercentageMap(criteria);
      const expectedResult = {ds1Id: true, ds2Id: false};
      expect(result).toEqual(expectedResult);
    });
  });
});
