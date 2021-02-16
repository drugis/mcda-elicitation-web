import _ from 'lodash';
import IAlternative from './interface/IAlternative';
import ICriterion from './interface/ICriterion';
import IDataSource from './interface/IDataSource';
import IDistribution, {Distribution} from './interface/IDistribution';
import IEffect, {Effect} from './interface/IEffect';
import IEmptyEffect from './interface/IEmptyEffect';
import IOldWorkspace from './interface/IOldWorkspace';
import IOrdering from './interface/IOrdering';
import IRangeEffect from './interface/IRangeEffect';
import IRelativePerformance from './interface/IRelativePerformance';
import ITextEffect from './interface/ITextEffect';
import {UnitOfMeasurementType} from './interface/IUnitOfMeasurement';
import IValueCIEffect from './interface/IValueCIEffect';
import IValueEffect from './interface/IValueEffect';
import IWorkspace from './interface/IWorkspace';
import IWorkspaceProperties from './interface/IWorkspaceProperties';
import {IAbsolutePerformanceTableEntry} from './interface/Problem/IAbsolutePerformanceTableEntry';
import IEmptyPerformance from './interface/Problem/IEmptyPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance
} from './interface/Problem/IPerformance';
import IProblem from './interface/Problem/IProblem';
import IProblemCriterion from './interface/Problem/IProblemCriterion';
import IProblemDataSource from './interface/Problem/IProblemDataSource';
import {IProblemRelativePerformance} from './interface/Problem/IProblemRelativePerformance';
import IRangeEffectPerformance from './interface/Problem/IRangeEffectPerformance';
import ITextPerformance from './interface/Problem/ITextPerformance';
import IValueCIPerformance from './interface/Problem/IValueCIPerformance';
import IValuePerformance from './interface/Problem/IValuePerformance';
import {TDistributionPerformance} from './interface/Problem/TDistributionPerformance';
import {TPerformanceTableEntry} from './interface/Problem/TPerformanceTableEntry';
import {generateUuid} from './util';
import {applyOrdering} from './workspaceServiceUtil';

export function buildWorkspace(
  workspace: IOldWorkspace,
  workspaceId: string,
  ordering?: IOrdering
): IWorkspace {
  const idMapper = _.identity;
  const title = workspace.problem.title;
  return buildNewStyleCopy(workspace, idMapper, title, workspaceId, ordering);
}

export function buildInProgressCopy(workspace: IOldWorkspace): IWorkspace {
  const idMapper = buildInProgressIdMapper(workspace);
  const title = `Copy of ${workspace.problem.title}`;
  const workspaceWithoutStudentsT = {
    ...workspace,
    problem: getProblemWithoutStudentsT(workspace.problem)
  };
  return buildNewStyleCopy(workspaceWithoutStudentsT, idMapper, title);
}

function getProblemWithoutStudentsT(problem: IProblem): IProblem {
  return {
    ...problem,
    performanceTable: getPerformanceTableWithoutStudentsT(
      problem.performanceTable
    )
  };
}

function getPerformanceTableWithoutStudentsT(
  table: TPerformanceTableEntry[]
): TPerformanceTableEntry[] {
  return _(table).map(getEntryWithoutStudentsT).filter().value();
}

function getEntryWithoutStudentsT(
  entry: TPerformanceTableEntry
): TPerformanceTableEntry {
  if (
    isAbsoluteEntry(entry) &&
    'distribution' in entry.performance &&
    entry.performance.distribution.type === 'dt'
  ) {
    if ('effect' in entry.performance) {
      return {
        ...entry,
        performance: {effect: entry.performance.effect}
      };
    } else {
      return undefined;
    }
  } else {
    return entry;
  }
}

export function isAbsoluteEntry(
  entry: TPerformanceTableEntry
): entry is IAbsolutePerformanceTableEntry {
  return entry.hasOwnProperty('alternative');
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

export function buildNewStyleCopy(
  workspace: IOldWorkspace,
  idMapper: (id: string) => string,
  title: string,
  workspaceId?: string,
  ordering?: IOrdering
): IWorkspace {
  const unitTypesByDataSource = buildUnitTypeMap(workspace.problem.criteria);

  return {
    properties: buildWorkspaceProperties(workspace, title, workspaceId),
    criteria: buildWorkspaceCriteria(
      workspace.problem.criteria,
      idMapper,
      ordering
    ),
    alternatives: buildWorkspaceAlternatives(
      workspace.problem.alternatives,
      idMapper,
      ordering ? ordering.alternatives : undefined
    ),
    effects: buildWorkspaceEffects(
      workspace.problem.performanceTable,
      idMapper,
      unitTypesByDataSource
    ),
    distributions: buildWorkspaceDistributions(
      workspace.problem.performanceTable,
      idMapper,
      unitTypesByDataSource
    ),
    relativePerformances: buildWorkspaceRelativePerformances(
      workspace.problem.performanceTable,
      idMapper,
      unitTypesByDataSource
    )
  };
}

export function buildUnitTypeMap(
  criteria: Record<string, IProblemCriterion>
): Record<string, UnitOfMeasurementType> {
  const values = _.flatMap(criteria, (criterion: IProblemCriterion): [
    string,
    UnitOfMeasurementType
  ][] => {
    return buildDataSourceIdMeasurementTypePairs(criterion);
  });
  return _.fromPairs(values);
}

function buildDataSourceIdMeasurementTypePairs(
  criterion: IProblemCriterion
): [string, UnitOfMeasurementType][] {
  return _.map(criterion.dataSources, (dataSource: IProblemDataSource): [
    string,
    UnitOfMeasurementType
  ] => {
    return [dataSource.id, dataSource.unitOfMeasurement.type];
  });
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
  const values = _.map(items, (item: T, oldId: string): [string, string] => {
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
  title: string,
  workspaceId?: string
): IWorkspaceProperties {
  return {
    title: title,
    id: workspaceId ? Number.parseInt(workspaceId) : undefined,
    therapeuticContext: workspace.problem.description
      ? workspace.problem.description
      : '',
    useFavourability: hasFavourability(workspace.problem.criteria)
  };
}

function hasFavourability(
  criteria: Record<string, IProblemCriterion>
): boolean {
  return _.some(
    criteria,
    (criterion: IProblemCriterion): boolean => 'isFavorable' in criterion
  );
}

export function buildWorkspaceCriteria(
  criteria: Record<string, IProblemCriterion>,
  idMapper: (id: string) => string,
  ordering?: IOrdering
): ICriterion[] {
  const criteriaOrdering = ordering ? ordering.criteria : undefined;
  const dataSourceOrdering = ordering ? ordering.dataSources : undefined;
  const newCriteria = _.map(
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
          idMapper,
          dataSourceOrdering
        )
      };
    }
  );
  return applyOrdering(criteriaOrdering, newCriteria);
}

export function buildWorkspaceDataSources(
  criterion: IProblemCriterion,
  criterionId: string,
  idMapper: (id: string) => string,
  ordering?: string[]
): IDataSource[] {
  const newDataSources = _.map(
    criterion.dataSources,
    (dataSource: IProblemDataSource): IDataSource => {
      return {
        id: idMapper(dataSource.id),
        reference: dataSource.source,
        referenceLink: dataSource.sourceLink,
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
  return applyOrdering(ordering, newDataSources);
}

export function buildWorkspaceAlternatives(
  alternatives: Record<string, IAlternative>,
  idMapper: (id: string) => string,
  ordering?: string[]
): IAlternative[] {
  const newAlternatives = _.map(
    alternatives,
    (alternative: IAlternative): IAlternative => {
      return {
        id: idMapper(alternative.id),
        title: alternative.title
      };
    }
  );
  return applyOrdering(ordering, newAlternatives);
}

export function buildWorkspaceEffects(
  performanceTable: TPerformanceTableEntry[],
  idMapper: (id: string) => string,
  unitTypesByDataSource: Record<string, UnitOfMeasurementType>
): Effect[] {
  return _(performanceTable)
    .filter((entry: TPerformanceTableEntry): boolean => {
      return isAbsoluteEntry(entry) && 'effect' in entry.performance;
    })
    .map(_.partial(buildEffect, idMapper, unitTypesByDataSource))
    .value();
}

export function hasAlternativeId(entry: IAbsolutePerformanceTableEntry) {
  return 'alternative' in entry;
}

export function buildEffect(
  idMapper: (id: string) => string,
  unitTypesByDataSource: Record<string, UnitOfMeasurementType>,
  entry: IAbsolutePerformanceTableEntry
): Effect {
  const performance = entry.performance as IEffectPerformance;
  const effectPerformance = performance.effect;
  const effectBase: IEffect = {
    alternativeId: idMapper(entry.alternative),
    dataSourceId: idMapper(entry.dataSource),
    criterionId: idMapper(entry.criterion),
    unitOfMeasurementType: unitTypesByDataSource[entry.dataSource]
  };
  if (effectPerformance.type === 'empty') {
    return createEmptyOrTextEffect(effectPerformance, effectBase);
  } else if (effectPerformance.type === 'exact') {
    return createExactEffect(effectPerformance, effectBase);
  } else {
    throw 'unknown effect type';
  }
}

export function createEmptyOrTextEffect(
  effectPerformance: IEmptyPerformance | ITextPerformance,
  effectBase: IEffect
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
  effectBase: IEffect
): IValueEffect | IValueCIEffect | IRangeEffect {
  if ('input' in performance && 'lowerBound' in performance.input) {
    const input = performance.input;
    return createBoundEffect(input, effectBase);
  } else {
    return {
      ...effectBase,
      type: 'value',
      value: performance.value
    };
  }
}

export function createBoundEffect(
  input: {
    value?: number;
    lowerBound: number | 'NE';
    upperBound: number | 'NE';
  },
  effectBase: IEffect
): IValueCIEffect | IRangeEffect {
  const lowerBound = input.lowerBound !== 'NE' ? input.lowerBound : undefined;
  const upperBound = input.upperBound !== 'NE' ? input.upperBound : undefined;
  const unitType = effectBase.unitOfMeasurementType;
  if ('value' in input) {
    return {
      ...effectBase,
      type: 'valueCI',
      value: input.value,
      lowerBound: lowerBound,
      upperBound: upperBound,
      isNotEstimableUpperBound: input.lowerBound === 'NE',
      isNotEstimableLowerBound: input.upperBound === 'NE'
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
  performanceTable: TPerformanceTableEntry[],
  idMapper: (id: string) => string,
  unitTypesByDataSource: Record<string, UnitOfMeasurementType>
): Distribution[] {
  return _(performanceTable)
    .filter(
      (entry: TPerformanceTableEntry): boolean =>
        isAbsoluteEntry(entry) && 'distribution' in entry.performance
    )
    .map(_.partial(buildDistribution, idMapper, unitTypesByDataSource))
    .value();
}

export function buildDistribution(
  idMapper: (id: string) => string,
  unitTypesByDataSource: Record<string, UnitOfMeasurementType>,
  entry: IAbsolutePerformanceTableEntry
): Distribution {
  const performance = entry.performance as IDistributionPerformance;
  const distributionBase = {
    alternativeId: idMapper(entry.alternative),
    dataSourceId: idMapper(entry.dataSource),
    criterionId: idMapper(entry.criterion),
    unitOfMeasurementType: unitTypesByDataSource[entry.dataSource]
  };
  return finishDistributionCreation(performance.distribution, distributionBase);
}

export function finishDistributionCreation(
  performance: TDistributionPerformance,
  distributionBase: IDistribution
): Distribution {
  switch (performance.type) {
    case 'exact':
      return {
        ...distributionBase,
        type: 'value',
        value: performance.value
      };
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
        mean: performance.parameters.mu,
        standardError: performance.parameters.sigma
      };
    case 'range':
      return {
        ...distributionBase,
        type: 'range',
        lowerBound: performance.parameters.lowerBound,
        upperBound: performance.parameters.upperBound
      };
    case 'empty':
      return createEmptyOrTextEffect(performance, distributionBase);
    case 'dt':
      return {
        ...distributionBase,
        type: 'dt',
        dof: performance.parameters.dof,
        standardError: performance.parameters.stdErr,
        mean: performance.parameters.mu
      };
  }
}

function buildWorkspaceRelativePerformances(
  performanceTable: TPerformanceTableEntry[],
  idMapper: (id: string) => string,
  unitTypeMap: Record<string, UnitOfMeasurementType>
): IRelativePerformance[] {
  return _(performanceTable)
    .filter(isRelativeEntry)
    .map(_.partial(buildRelative, idMapper, unitTypeMap))
    .value();
}

function isRelativeEntry(entry: TPerformanceTableEntry): boolean {
  return !isAbsoluteEntry(entry);
}

function buildRelative(
  idMapper: (id: string) => string,
  unitTypeMap: Record<string, UnitOfMeasurementType>,
  entry: IAbsolutePerformanceTableEntry
): IRelativePerformance {
  const performance = entry.performance as IProblemRelativePerformance;
  const base = {
    dataSourceId: idMapper(entry.dataSource),
    criterionId: idMapper(entry.criterion),
    unitOfMeasurementType: unitTypeMap[idMapper(entry.dataSource)]
  };
  const distribution = performance.distribution;
  const parameters = distribution.parameters;
  return {
    ...base,
    type: distribution.type,
    baseline: {
      ..._.omit(parameters.baseline, 'name'),
      id: parameters.baseline.name
    },
    relative: parameters.relative
  };
}
