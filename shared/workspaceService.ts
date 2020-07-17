import _ from 'lodash';
import significantDigits from '../app/ts/ManualInput/Util/significantDigits';
import IAlternative from './interface/IAlternative';
import ICriterion from './interface/ICriterion';
import IDataSource from './interface/IDataSource';
import { Distribution } from './interface/IDistribution';
import { Effect } from './interface/IEffect';
import IEmptyEffect from './interface/IEmptyEffect';
import IOldWorkspace from './interface/IOldWorkspace';
import IRangeEffect from './interface/IRangeEffect';
import ITextEffect from './interface/ITextEffect';
import IValueCIEffect from './interface/IValueCIEffect';
import IValueEffect from './interface/IValueEffect';
import IWorkspace from './interface/IWorkspace';
import IWorkspaceProperties from './interface/IWorkspaceProperties';
import { DistributionPerformance } from './interface/Problem/IDistributionPerformance';
import IEmptyPerformance from './interface/Problem/IEmptyPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance
} from './interface/Problem/IPerformance';
import { IPerformanceTableEntry } from './interface/Problem/IPerformanceTableEntry';
import IProblemCriterion from './interface/Problem/IProblemCriterion';
import IProblemDataSource from './interface/Problem/IProblemDataSource';
import IRangeEffectPerformance from './interface/Problem/IRangeEffectPerformance';
import ITextPerformance from './interface/Problem/ITextPerformance';
import IValueCIPerformance from './interface/Problem/IValueCIPerformance';
import IValuePerformance from './interface/Problem/IValuePerformance';
import { generateUuid } from './util';

export function buildWorkspace(workspace: IOldWorkspace): IWorkspace {
  const idMapper = _.identity;
  const title = workspace.problem.title;
  return buildNewStyleCopy(workspace, idMapper, title);
}

export function buildInProgressCopy(workspace: IOldWorkspace): IWorkspace {
  const idMapper = buildInProgressIdMapper(workspace);
  const title = `Copy of ${workspace.problem.title}`;
  return buildNewStyleCopy(workspace, idMapper, title);
}

export function buildInProgressIdMapper(
  workspace: IOldWorkspace
): (id: string) => string {
  const idMap = buildIdMap(
    workspace.problem.criteria,
    workspace.problem.alternatives
  );
  return (id: string): string => {
    const newId = idMap[id];
    if (!newId) {
      throw `Id: ${id} not found`;
    } else {
      return idMap[id];
    }
  };
}

export function buildNewStyleCopy<T>(
  workspace: IOldWorkspace,
  idMapper: (id: string) => string,
  title: string
): IWorkspace {
  const isPercentageMap = buildPercentageMap(workspace.problem.criteria);

  return {
    properties: buildWorkspaceProperties(workspace, title),
    criteria: buildWorkspaceCriteria(workspace.problem.criteria, idMapper),
    alternatives: buildWorkspaceAlternatives(
      workspace.problem.alternatives,
      idMapper
    ),
    effects: buildWorkspaceEffects(
      workspace.problem.performanceTable,
      idMapper,
      isPercentageMap
    ),
    distributions: buildWorkspaceDistributions(
      workspace.problem.performanceTable,
      idMapper,
      isPercentageMap
    )
  };
}

export function buildPercentageMap(
  criteria: Record<string, IProblemCriterion>
): Record<string, boolean> {
  const values = _.flatMap(criteria, (criterion: IProblemCriterion): [
    string,
    boolean
  ][] => {
    return _.map(criterion.dataSources, (dataSource: IProblemDataSource): [
      string,
      boolean
    ] => {
      return [
        dataSource.id,
        dataSource.unitOfMeasurement.type === 'percentage'
      ];
    });
  });
  return _.fromPairs(values);
}

export function buildIdMap(
  criteria: Record<string, IProblemCriterion>,
  alternatives: Record<string, {title: string}>
): Record<string, string> {
  const criteriaIdMap = buildGenericIdMap(criteria);
  const dataSourcesIdMap = buildDataSourcesIdMap(criteria);
  const alternativesIdMap = buildGenericIdMap(alternatives);
  return {...criteriaIdMap, ...dataSourcesIdMap, ...alternativesIdMap};
}

function buildGenericIdMap<T>(
  items: Record<string, T>
): Record<string, string> {
  const values = _.map(items, (item: any, oldId: string): [string, string] => {
    return [oldId, generateUuid()];
  });
  return _.fromPairs(values);
}

function buildDataSourcesIdMap(
  criteria: Record<string, IProblemCriterion>
): Record<string, string> {
  const values = _.flatMap(criteria, (criterion: IProblemCriterion): [
    string,
    string
  ][] => {
    return _.map(criterion.dataSources, (dataSource: IProblemDataSource): [
      string,
      string
    ] => {
      return [dataSource.id, generateUuid()];
    });
  });
  return _.fromPairs(values);
}

export function buildWorkspaceProperties(
  workspace: IOldWorkspace,
  title: string
): IWorkspaceProperties {
  return {
    title: title,
    therapeuticContext: workspace.problem.description,
    useFavourability: _.some(
      workspace.problem.criteria,
      (criterion: IProblemCriterion): boolean => {
        return criterion.hasOwnProperty('isFavorable');
      }
    )
  };
}

export function buildWorkspaceCriteria(
  criteria: Record<string, IProblemCriterion>,
  idMapper: (id: string) => string
): ICriterion[] {
  return _.map(
    criteria,
    (criterion: IProblemCriterion, oldId: string): ICriterion => {
      return {
        id: idMapper(oldId),
        title: criterion.title,
        description: criterion.description,
        isFavourable: !!criterion.isFavorable,
        dataSources: buildWorkspaceDataSources(
          criterion,
          idMapper(oldId),
          idMapper
        )
      };
    }
  );
}

export function buildWorkspaceDataSources(
  criterion: IProblemCriterion,
  criterionId: string,
  idMapper: (id: string) => string
): IDataSource[] {
  return _.map(
    criterion.dataSources,
    (dataSource: IProblemDataSource): IDataSource => {
      return {
        id: idMapper(dataSource.id),
        reference: dataSource.source,
        unitOfMeasurement: {
          label: dataSource.unitOfMeasurement.label,
          type: dataSource.unitOfMeasurement.type,
          lowerBound: dataSource.scale[0],
          upperBound: dataSource.scale[1]
        },
        uncertainty: dataSource.uncertainties,
        strengthOfEvidence: dataSource.strengthOfEvidence,
        criterionId: criterionId
      };
    }
  );
}

export function buildWorkspaceAlternatives(
  alternatives: Record<string, {title: string}>,
  idMapper: (id: string) => string
): IAlternative[] {
  return _.map(
    alternatives,
    (alternative: {title: string}, oldId: string): IAlternative => {
      return {
        id: idMapper(oldId),
        title: alternative.title
      };
    }
  );
}

export function buildWorkspaceEffects(
  performanceTable: IPerformanceTableEntry[],
  idMapper: (id: string) => string,
  isPercentageMap: Record<string, boolean>
): Effect[] {
  return _(performanceTable)
    .filter((entry: IPerformanceTableEntry): boolean => {
      return isNotNMAEntry(entry) && 'effect' in entry.performance;
    })
    .map(_.partial(buildEffect, idMapper, isPercentageMap))
    .value();
}

export function isNotNMAEntry(entry: IPerformanceTableEntry) {
  return 'alternative' in entry;
}

export function buildEffect(
  idMapper: (id: string) => string,
  isPercentageMap: Record<string, boolean>,
  entry: IPerformanceTableEntry
): Effect {
  const performance = entry.performance as IEffectPerformance;
  const effectPerformance = performance.effect;
  const modifier = isPercentageMap[entry.dataSource] ? 100 : 1;
  const effectBase = {
    alternativeId: idMapper(entry.alternative),
    dataSourceId: idMapper(entry.dataSource),
    criterionId: idMapper(entry.criterion)
  };
  if (effectPerformance.type === 'empty') {
    return createEmptyOrTextEffect(effectPerformance, effectBase);
  } else if (effectPerformance.type === 'exact') {
    return createExactEffect(effectPerformance, effectBase, modifier);
  } else {
    throw 'unknown effect type';
  }
}

export function createEmptyOrTextEffect(
  effectPerformance: IEmptyPerformance | ITextPerformance,
  effectBase: any
): ITextEffect | IEmptyEffect {
  if ('value' in effectPerformance) {
    return {...effectBase, type: 'text', text: effectPerformance.value};
  } else {
    return {...effectBase, type: 'empty'};
  }
}

export function createExactEffect(
  performance:
    | IValuePerformance
    | IValueCIPerformance
    | IRangeEffectPerformance,
  effectBase: any,
  modifier: number
): IValueEffect | IValueCIEffect | IRangeEffect {
  if ('input' in performance && 'lowerBound' in performance.input) {
    const input = performance.input;
    return createBoundEffect(input, effectBase);
  } else {
    return {
      ...effectBase,
      type: 'value',
      value: significantDigits(performance.value * modifier)
    };
  }
}

export function createBoundEffect(
  input: {
    value?: number;
    lowerBound: number | 'NE';
    upperBound: number | 'NE';
  },
  effectBase: any
): IValueCIEffect | IRangeEffect {
  const lowerBound = input.lowerBound;
  const upperBound = input.upperBound;
  if ('value' in input) {
    return {
      ...effectBase,
      type: 'valueCI',
      value: input.value,
      lowerBound: lowerBound !== 'NE' ? lowerBound : undefined,
      upperBound: upperBound !== 'NE' ? upperBound : undefined,
      isNotEstimableUpperBound: lowerBound === 'NE',
      isNotEstimableLowerBound: upperBound === 'NE'
    };
  } else {
    return {
      ...effectBase,
      type: 'range',
      lowerBound: lowerBound,
      upperBound: upperBound
    };
  }
}

export function buildWorkspaceDistributions(
  performanceTable: IPerformanceTableEntry[],
  idMapper: (id: string) => string,
  isPercentageMap: Record<string, boolean>
): Distribution[] {
  return _(performanceTable)
    .filter((entry: IPerformanceTableEntry): boolean => {
      return isNotNMAEntry(entry) && 'distribution' in entry.performance;
    })
    .map(_.partial(buildDistribution, idMapper, isPercentageMap))
    .value();
}

export function buildDistribution(
  idMapper: (id: string) => string,
  isPercentageMap: Record<string, boolean>,
  entry: IPerformanceTableEntry
): Distribution {
  const performance = entry.performance as IDistributionPerformance;
  const modifier = isPercentageMap[entry.dataSource] ? 100 : 1;
  const distributionBase = {
    alternativeId: idMapper(entry.alternative),
    dataSourceId: idMapper(entry.dataSource),
    criterionId: idMapper(entry.criterion)
  };
  return finishDistributionCreation(
    performance.distribution,
    distributionBase,
    modifier
  );
}

export function finishDistributionCreation(
  performance: DistributionPerformance,
  distributionBase: any,
  modifier: number
): Distribution {
  switch (performance.type) {
    case 'exact':
      return {...distributionBase, type: 'value', value: performance.value};
    case 'dbeta':
      return {
        ...distributionBase,
        type: 'beta',
        alpha: performance.parameters.alpha,
        beta: performance.parameters.beta
      };
    case 'dgamma':
      return {
        ...distributionBase,
        type: 'gamma',
        alpha: performance.parameters.alpha,
        beta: performance.parameters.beta
      };
    case 'dnorm':
      return {
        ...distributionBase,
        type: 'normal',
        mean: significantDigits(performance.parameters.mu * modifier),
        standardError: significantDigits(
          performance.parameters.sigma * modifier
        )
      };
    case 'range':
      return {
        ...distributionBase,
        type: 'range',
        lowerBound: significantDigits(
          performance.parameters.lowerBound * modifier
        ),
        upperBound: significantDigits(
          performance.parameters.upperBound * modifier
        )
      };
    case 'empty':
      return createEmptyOrTextEffect(performance, distributionBase);
  }
}
