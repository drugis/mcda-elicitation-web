const newId = 'unique_uuid';
const mockGenerateUuid = jest.fn().mockImplementation(() => {
  return newId;
});

jest.mock('../shared/util', () => {
  return {
    __esModule: true,
    generateUuid: mockGenerateUuid
  };
});
import IAlternative from '@shared/interface/IAlternative';
import IBetaDistribution from '@shared/interface/IBetaDistribution';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IEmptyEffect from '@shared/interface/IEmptyEffect';
import IGammaDistribution from '@shared/interface/IGammaDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IRangeEffect from '@shared/interface/IRangeEffect';
import ITextEffect from '@shared/interface/ITextEffect';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceProperties from '@shared/interface/IWorkspaceProperties';
import IBetaPerformance from '@shared/interface/Problem/IBetaPerformance';
import {effectPerformanceType} from '@shared/interface/Problem/IEffectPerformance';
import IEmptyPerformance from '@shared/interface/Problem/IEmptyPerformance';
import IGammaPerformance from '@shared/interface/Problem/IGammaPerformance';
import INormalPerformance from '@shared/interface/Problem/INormalPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IRangeDistributionPerformance from '@shared/interface/Problem/IRangeDistributionPerformance';
import ITextPerformance from '@shared/interface/Problem/ITextPerformance';
import IValueCIPerformance from '@shared/interface/Problem/IValueCIPerformance';
import IValuePerformance from '@shared/interface/Problem/IValuePerformance';
import {
  buildInProgressCopy,
  buildWorkspaceDataSources,
  buildWorkspaceCriteria,
  buildWorkspaceProperties,
  buildWorkspaceAlternatives,
  buildWorkspaceEffects,
  isNotNMAEntry,
  buildEffect,
  createEmptyOrTextEffect,
  createExactEffect,
  createBoundEffect,
  buildWorkspaceDistributions,
  buildDistribution,
  finishDistributionCreation,
  buildInProgressIdMapper,
  buildIdMap,
  buildPercentageMap
} from '@shared/workspaceService';
import _ from 'lodash';

const criterion1Id = 'crit1Id';
const dataSource1Id = 'ds1Id';
const alternative1Id = 'alt1Id';

const emptyEffect: IEmptyEffect = {
  type: 'empty',
  alternativeId: alternative1Id,
  criterionId: criterion1Id,
  dataSourceId: dataSource1Id
};

const effectBase = {
  alternativeId: alternative1Id,
  criterionId: criterion1Id,
  dataSourceId: dataSource1Id
};

const isPercentageMap: Record<string, boolean> = {ds1Id: true};
const idMapper: (id: string) => string = _.identity;

describe('buildWorkspace', () => {
  // building of alternatives and criteria is tested further below
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
      properties: expectedWorkspace 
    };
    expect(result).toEqual(expectedResult);
  });

  describe('buildWorkspaceProperties', () => {
    it('should return the workspace properties and check for favourability', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          title: 'criterion 1',
          description: '',
          isFavorable: false,
          dataSources: []
        }
      };
      const title = `Copy of my workspace`;
      const result = buildWorkspaceProperties(
        {
          ...oldWorkspace,
          problem: {...oldWorkspace.problem, criteria: criteria}
        },
        title
      );
      const expectedWorkspace: IWorkspaceProperties = {
        title: 'Copy of my workspace',
        therapeuticContext: '',
        useFavourability: true
      };
      expect(result).toEqual(expectedWorkspace);
    });
  });

  describe('buildWorkspaceCriteria', () => {
    it('should return the transformed criteria', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          dataSources: [],
          isFavorable: true,
          description: 'hello',
          title: 'criterion 1'
        }
      };
      const result = buildWorkspaceCriteria(criteria, idMapper);
      const expectedCriterion: ICriterion[] = [
        {
          id: criterion1Id,
          title: 'criterion 1',
          isFavourable: true,
          dataSources: [] as any[],
          description: 'hello'
        }
      ];

      expect(result).toEqual(expectedCriterion);
    });
  });

  describe('buildWorkspaceDataSources', () => {
    it('should return all the transformed data sources', () => {
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
      const result = buildWorkspaceDataSources(
        criterion,
        idMapper(criterion1Id),
        idMapper
      );
      const expectedDataSource: IDataSource[] = [
        {
          id: dataSource1Id,
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
        }
      ];

      expect(result).toEqual(expectedDataSource);
    });
  });

  describe('buildWorkspaceAlternatives', () => {
    it('should return the transformed alternatives', () => {
      const alternatives: Record<string, {title: string}> = {
        alt1Id: {title: 'alternative 1'}
      };
      const result = buildWorkspaceAlternatives(alternatives, idMapper);
      const expectedAlternatives: IAlternative[] = [
        {id: alternative1Id, title: 'alternative 1'}
      ];
      expect(result).toEqual(expectedAlternatives);
    });
  });

  describe('buildWorkspaceEffects', () => {
    it('should filter out non effect entries', () => {
      const isPercentageMap: Record<string, boolean> = {};
      const performanceTable: IPerformanceTableEntry[] = [
        {
          alternative: alternative1Id,
          dataSource: dataSource1Id,
          criterion: criterion1Id,
          performance: {distribution: {type: 'empty'}}
        }
      ];
      const result = buildWorkspaceEffects(
        performanceTable,
        idMapper,
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
      const result = buildEffect(idMapper, isPercentageMap, entry);

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
      const result = buildEffect(idMapper, isPercentageMap, entry);
      const expectedResult: IValueEffect = {
        type: 'value',
        value: 3700,
        alternativeId: alternative1Id,
        criterionId: criterion1Id,
        dataSourceId: dataSource1Id
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
        buildEffect(idMapper, isPercentageMap, entry);
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
        alternativeId: alternative1Id,
        criterionId: criterion1Id,
        dataSourceId: dataSource1Id,
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

  describe('buildWorkspaceDistributions', () => {
    it('should filter out non distribution entries', () => {
      const isPercentageMap: Record<string, boolean> = {};
      const performanceTable: IPerformanceTableEntry[] = [
        {
          alternative: alternative1Id,
          dataSource: dataSource1Id,
          criterion: criterion1Id,
          performance: {effect: {type: 'empty'}}
        }
      ];
      const result = buildWorkspaceDistributions(
        performanceTable,
        idMapper,
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
      const result = buildDistribution(idMapper, isPercentageMap, entry);
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

  describe('buildInProgressIdMapper', () => {
    it('should create a mapper from old to new Ids', () => {
      let newOldWorkspace = _.cloneDeep(oldWorkspace);
      newOldWorkspace.problem.criteria = {crit1Id: {} as IProblemCriterion};
      const mapper = buildInProgressIdMapper(newOldWorkspace);
      expect(mapper(criterion1Id)).toEqual(newId);
    });

    it('should throw an error if the new id of an existing id is not found', () => {
      const mapper = buildInProgressIdMapper(oldWorkspace);
      try {
        mapper(criterion1Id);
      } catch (error) {
        expect(error).toEqual(`Id: ${criterion1Id} not found`);
      }
    });
  });

  describe('buildIdMap', () => {
    it('should return a map from old to new ids', () => {
      const criteria: Record<string, IProblemCriterion> = {
        crit1Id: {
          title: 'criterion 1',
          description: '',
          isFavorable: false,
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
        }
      };
      const alternatives: Record<string, {title: string}> = {
        alt1Id: {title: 'alternative 1'}
      };
      const result = buildIdMap(criteria, alternatives);
      const expectedResult: Record<string, string> = {
        crit1Id: 'unique_uuid',
        ds1Id: 'unique_uuid',
        alt1Id: 'unique_uuid'
      };
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
      const expectedResult: Record<string, boolean> = {
        ds1Id: true,
        ds2Id: false
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
