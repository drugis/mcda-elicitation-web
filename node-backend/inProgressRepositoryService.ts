import IAlternative from '@shared/interface/IAlternative';
import IAlternativeQueryResult from '@shared/interface/IAlternativeQueryResult';
import ICellCommand from '@shared/interface/ICellCommand';
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
import IRangeEffect from '@shared/interface/IRangeEffect';
import ITextEffect from '@shared/interface/ITextEffect';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceQueryResult from '@shared/interface/IWorkspaceQueryResult';
import IBetaPerformance from '@shared/interface/Problem/IBetaPerformance';
import {DistributionPerformance} from '@shared/interface/Problem/IDistributionPerformance';
import {EffectPerformance} from '@shared/interface/Problem/IEffectPerformance';
import IEmptyPerformance from '@shared/interface/Problem/IEmptyPerformance';
import IGammaPerformance from '@shared/interface/Problem/IGammaPerformance';
import INormalPerformance from '@shared/interface/Problem/INormalPerformance';
import {
  IDistributionPerformance,
  IEffectPerformance,
  Performance
} from '@shared/interface/Problem/IPerformance';
import {IPerformanceTableEntry} from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import IRangeDistributionPerformance from '@shared/interface/Problem/IRangeDistributionPerformance';
import IRangeEffectPerformance from '@shared/interface/Problem/IRangeEffectPerformance';
import ITextPerformance from '@shared/interface/Problem/ITextPerformance';
import IValueCIPerformance from '@shared/interface/Problem/IValueCIPerformance';
import IValuePerformance from '@shared/interface/Problem/IValuePerformance';
import {generateUuid} from '@shared/util';
import {TableInputMode} from 'app/ts/type/TableInputMode';
import _ from 'lodash';
import {CURRENT_SCHEMA_VERSION} from '../app/ts/ManualInput/constants';
import significantDigits from '../app/ts/ManualInput/Util/significantDigits';
import {stringify} from 'querystring';

export function mapWorkspace(
  queryResult: IWorkspaceQueryResult
): IInProgressWorkspace {
  return {
    id: queryResult.id,
    title: queryResult.title,
    therapeuticContext: queryResult.therapeuticcontext,
    useFavourability: queryResult.usefavourability
  };
}

export function mapCriteria(criteria: ICriterionQueryResult[]): ICriterion[] {
  return _(criteria)
    .sortBy('orderindex')
    .map(
      (queryCriterion): ICriterion => {
        return {
          id: queryCriterion.id,
          title: queryCriterion.title,
          description: queryCriterion.description,
          isFavourable: queryCriterion.isfavourable,
          dataSources: []
        };
      }
    )
    .value();
}

export function mapAlternatives(
  alternatives: IAlternativeQueryResult[]
): IAlternative[] {
  return _(alternatives)
    .sortBy('orderindex')
    .map(
      (queryAlternative): IAlternative => {
        return {
          id: queryAlternative.id,
          title: queryAlternative.title
        };
      }
    )
    .value();
}

export function mapDataSources(
  dataSources: IDataSourceQueryResult[]
): IDataSource[] {
  return _(dataSources)
    .sortBy('orderindex')
    .map(
      (queryDataSource): IDataSource => {
        return {
          id: queryDataSource.id,
          criterionId: queryDataSource.criterionid,
          reference: queryDataSource.reference,
          uncertainty: queryDataSource.uncertainty,
          strengthOfEvidence: queryDataSource.strengthofevidence,
          unitOfMeasurement: {
            label: queryDataSource.unitlabel,
            type: queryDataSource.unittype,
            lowerBound:
              queryDataSource.unitlowerbound === null
                ? undefined
                : queryDataSource.unitlowerbound,
            upperBound:
              queryDataSource.unitupperbound === null
                ? undefined
                : queryDataSource.unitupperbound
          }
        };
      }
    )
    .value();
}

export function mapCellValues(
  cellValues: IDatabaseInputCell[]
): [
  Record<string, Record<string, Effect>>,
  Record<string, Record<string, Distribution>>
] {
  const [effectCellValues, distributionCellValues] = _.partition(cellValues, [
    'celltype',
    'effect'
  ]);
  return [
    createEffectRecords(effectCellValues),
    createDistributionRecords(distributionCellValues)
  ];
}

function createEffectRecords(
  effectQueryResults: IDatabaseInputCell[]
): Record<string, Record<string, Effect>> {
  return _.reduce(
    effectQueryResults,
    (
      accum: Record<string, Record<string, Effect>>,
      effectQueryResult
    ): Record<string, Record<string, Effect>> => {
      if (!accum[effectQueryResult.datasourceid]) {
        accum[effectQueryResult.datasourceid] = {};
      }
      accum[effectQueryResult.datasourceid][
        effectQueryResult.alternativeid
      ] = mapEffect(effectQueryResult);
      return accum;
    },
    {}
  );
}

function mapEffect(effectQueryResult: IDatabaseInputCell): Effect {
  const sharedProperties = {
    alternativeId: effectQueryResult.alternativeid,
    dataSourceId: effectQueryResult.datasourceid,
    criterionId: effectQueryResult.criterionid
  };
  switch (effectQueryResult.inputtype) {
    case 'value':
      return {
        value: effectQueryResult.val,
        type: effectQueryResult.inputtype,
        ...sharedProperties
      };
    case 'valueCI':
      return {
        value: effectQueryResult.val,
        lowerBound: effectQueryResult.lowerbound,
        upperBound: effectQueryResult.upperbound,
        type: effectQueryResult.inputtype,
        isNotEstimableLowerBound: effectQueryResult.isnotestimablelowerbound,
        isNotEstimableUpperBound: effectQueryResult.isnotestimableupperbound,
        ...sharedProperties
      };
    case 'range':
      return {
        lowerBound: effectQueryResult.lowerbound,
        upperBound: effectQueryResult.upperbound,
        type: effectQueryResult.inputtype,
        ...sharedProperties
      };
    case 'empty':
      return {
        type: effectQueryResult.inputtype,
        ...sharedProperties
      };
    case 'text':
      return {
        text: effectQueryResult.txt,
        type: effectQueryResult.inputtype,
        ...sharedProperties
      };
  }
}

function createDistributionRecords(
  distributionQueryResults: IDatabaseInputCell[]
): Record<string, Record<string, Distribution>> {
  return _.reduce(
    distributionQueryResults,
    (
      accum: Record<string, Record<string, Distribution>>,
      distributionQueryResult
    ): Record<string, Record<string, Distribution>> => {
      if (!accum[distributionQueryResult.datasourceid]) {
        accum[distributionQueryResult.datasourceid] = {};
      }
      accum[distributionQueryResult.datasourceid][
        distributionQueryResult.alternativeid
      ] = mapDistribution(distributionQueryResult);
      return accum;
    },
    {}
  );
}

function mapDistribution(
  distributionQueryResult: IDatabaseInputCell
): Distribution {
  const sharedProperties = {
    alternativeId: distributionQueryResult.alternativeid,
    dataSourceId: distributionQueryResult.datasourceid,
    criterionId: distributionQueryResult.criterionid
  };
  switch (distributionQueryResult.inputtype) {
    case 'value':
      return {
        value: distributionQueryResult.val,
        type: distributionQueryResult.inputtype,
        ...sharedProperties
      };
    case 'range':
      return {
        lowerBound: distributionQueryResult.lowerbound,
        upperBound: distributionQueryResult.upperbound,
        type: distributionQueryResult.inputtype,
        ...sharedProperties
      };
    case 'empty':
      return {
        type: distributionQueryResult.inputtype,
        ...sharedProperties
      };
    case 'text':
      return {
        text: distributionQueryResult.txt,
        type: distributionQueryResult.inputtype,
        ...sharedProperties
      };
    case 'normal':
      return {
        mean: distributionQueryResult.mean,
        standardError: distributionQueryResult.standarderror,
        type: distributionQueryResult.inputtype,
        ...sharedProperties
      };
    case 'beta':
      return {
        alpha: distributionQueryResult.alpha,
        beta: distributionQueryResult.beta,
        type: distributionQueryResult.inputtype,
        ...sharedProperties
      };
    case 'gamma':
      return {
        alpha: distributionQueryResult.alpha,
        beta: distributionQueryResult.beta,
        type: distributionQueryResult.inputtype,
        ...sharedProperties
      };
  }
}

export function mapCombinedResults([
  workspace,
  criteria,
  alternatives,
  dataSources,
  [effects, distributions]
]: [
  IInProgressWorkspace,
  ICriterion[],
  IAlternative[],
  IDataSource[],
  [
    Record<string, Record<string, Effect>>,
    Record<string, Record<string, Distribution>>
  ]
]): IInProgressMessage {
  return {
    workspace: workspace,
    criteria: mapDataSourcesOntoCriteria(criteria, dataSources),
    alternatives: alternatives,
    effects: effects,
    distributions: distributions
  };
}

function mapDataSourcesOntoCriteria(
  criteria: ICriterion[],
  dataSources: IDataSource[]
): ICriterion[] {
  const dataSourcesGroupedByCriterion = _.groupBy(dataSources, 'criterionId');
  return _.map(
    criteria,
    (criterion): ICriterion => {
      return {
        ...criterion,
        dataSources: dataSourcesGroupedByCriterion[criterion.id]
          ? dataSourcesGroupedByCriterion[criterion.id]
          : []
      };
    }
  );
}

export function mapCellCommands(
  cellCommands: ICellCommand[]
): IDatabaseInputCell[] {
  return _.map(
    cellCommands,
    (command): IDatabaseInputCell => {
      return {
        inprogressworkspaceid: command.inProgressWorkspaceId,
        alternativeid: command.alternativeId,
        datasourceid: command.dataSourceId,
        criterionid: command.criterionId,
        val: command.value,
        lowerbound: command.lowerBound,
        upperbound: command.upperBound,
        isnotestimablelowerbound: command.isNotEstimableLowerBound,
        isnotestimableupperbound: command.isNotEstimableUpperBound,
        txt: command.text,
        mean: command.mean,
        standarderror: command.standardError,
        alpha: command.alpha,
        beta: command.beta,
        celltype: command.cellType,
        inputtype: command.type
      };
    }
  );
}

export function buildProblem(inProgressMessage: IInProgressMessage): IProblem {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    title: inProgressMessage.workspace.title,
    description: inProgressMessage.workspace.therapeuticContext,
    criteria: buildCriteria(
      inProgressMessage.criteria,
      inProgressMessage.workspace.useFavourability
    ),
    alternatives: buildAlternatives(inProgressMessage.alternatives),
    performanceTable: buildPerformanceTable(inProgressMessage)
  };
}

function buildCriteria(
  criteria: ICriterion[],
  useFavourability: boolean
): Record<string, IProblemCriterion> {
  const newCriteria = _.map(criteria, function (criterion) {
    const newCriterion = {
      title: criterion.title,
      description: criterion.description,
      dataSources: _.map(criterion.dataSources, buildDataSource)
    };
    if (useFavourability) {
      return [
        criterion.id,
        {...newCriterion, isFavorable: criterion.isFavourable}
      ];
    } else {
      return [criterion.id, newCriterion];
    }
  });
  return _.fromPairs(newCriteria);
}

function buildDataSource(dataSource: IDataSource): IProblemDataSource {
  return {
    id: dataSource.id,
    source: dataSource.reference,
    uncertainties: dataSource.uncertainty,
    strengthOfEvidence: dataSource.strengthOfEvidence,
    unitOfMeasurement: {
      type: dataSource.unitOfMeasurement.type,
      label: dataSource.unitOfMeasurement.label
    },
    scale: [
      dataSource.unitOfMeasurement.lowerBound === undefined
        ? null
        : dataSource.unitOfMeasurement.lowerBound,
      dataSource.unitOfMeasurement.upperBound === undefined
        ? null
        : dataSource.unitOfMeasurement.upperBound
    ]
  };
}

function buildAlternatives(
  alternatives: IAlternative[]
): Record<string, {title: string}> {
  return _(alternatives)
    .keyBy('id')
    .mapValues(function (alternative) {
      return _.pick(alternative, ['title']);
    })
    .value();
}

function buildPerformanceTable(
  inProgressMessage: IInProgressMessage
): IPerformanceTableEntry[] {
  return _(inProgressMessage.criteria)
    .map(
      _.partial(
        buildEntriesForCriterion,
        inProgressMessage.alternatives,
        inProgressMessage.effects,
        inProgressMessage.distributions
      )
    )
    .flatten()
    .flatten()
    .value();
}

function buildEntriesForCriterion(
  alternatives: IAlternative[],
  effects: Record<string, Record<string, Effect>>,
  distributions: Record<string, Record<string, Distribution>>,
  criterion: ICriterion
): IPerformanceTableEntry[][] {
  return _.map(criterion.dataSources, function (dataSource) {
    return buildPerformanceEntries(
      effects,
      distributions,
      criterion.id,
      dataSource,
      alternatives
    );
  });
}

function buildPerformanceEntries(
  effects: Record<string, Record<string, Effect>>,
  distributions: Record<string, Record<string, Distribution>>,
  criterionId: string,
  dataSource: IDataSource,
  alternatives: IAlternative[]
): IPerformanceTableEntry[] {
  return _.map(alternatives, function (alternative) {
    const effectCell = effects[dataSource.id][alternative.id];
    const distributionCell = distributions[dataSource.id]
      ? distributions[dataSource.id][alternative.id]
      : undefined;

    return {
      alternative: alternative.id,
      criterion: criterionId,
      dataSource: dataSource.id,
      performance: buildPerformance(
        effectCell,
        distributionCell,
        dataSource.unitOfMeasurement.type
      )
    };
  });
}

function buildPerformance(
  effectCell: Effect,
  distributionCell: Distribution,
  unitOfMeasurementType: UnitOfMeasurementType
): Performance {
  const isPercentage = unitOfMeasurementType === 'percentage';
  let performance;
  if (effectCell) {
    performance = {effect: buildEffectPerformance(effectCell, isPercentage)};
  }
  if (distributionCell) {
    performance = {
      ...performance,
      distribution: buildDistributionPerformance(distributionCell, isPercentage)
    };
  }
  if (!performance) {
    throw 'Cell without effect and distribution found';
  } else {
    return performance;
  }
}

function buildEffectPerformance(
  cell: Effect,
  isPercentage: boolean
): EffectPerformance {
  const percentageModifier = isPercentage ? 100 : 1;
  switch (cell.type) {
    case 'value':
      const valuePerformance: IValuePerformance = {
        type: 'exact',
        value: significantDigits(cell.value / percentageModifier)
      };
      return valuePerformance;
    case 'valueCI':
      const valueCIPerformance: IValueCIPerformance = {
        type: 'exact',
        value: significantDigits(cell.value / percentageModifier),
        input: {
          value: cell.value,
          lowerBound: cell.lowerBound,
          upperBound: cell.upperBound
        }
      };
      return valueCIPerformance;
    case 'range':
      const rangePerformance: IRangeEffectPerformance = {
        type: 'exact',
        value: significantDigits(
          (cell.lowerBound + cell.upperBound) / (2 * percentageModifier)
        ),
        input: {
          lowerBound: cell.lowerBound,
          upperBound: cell.upperBound
        }
      };
      return rangePerformance;
    case 'text':
      const textPerformance: ITextPerformance = {
        type: 'empty',
        value: cell.text
      };
      return textPerformance;
    case 'empty':
      const emptyPermormace: IEmptyPerformance = {
        type: 'empty'
      };
      return emptyPermormace;
  }
}

function buildDistributionPerformance(
  cell: Distribution,
  isPercentage: boolean
): DistributionPerformance {
  const percentageModifier = isPercentage ? 100 : 1;
  switch (cell.type) {
    case 'value':
      const valuePerformance: IValuePerformance = {
        type: 'exact',
        value: significantDigits(cell.value / percentageModifier)
      };
      return valuePerformance;
    case 'range':
      const rangePerformance: IRangeDistributionPerformance = {
        type: 'range',
        parameters: {
          lowerBound: significantDigits(cell.lowerBound / percentageModifier),
          upperBound: significantDigits(cell.upperBound / percentageModifier)
        }
      };
      return rangePerformance;
    case 'normal':
      const normalPerformace: INormalPerformance = {
        type: 'dnorm',
        parameters: {
          mu: significantDigits(cell.mean / percentageModifier),
          sigma: significantDigits(cell.standardError / percentageModifier)
        }
      };
      return normalPerformace;
    case 'beta':
      const betaPerformace: IBetaPerformance = {
        type: 'dbeta',
        parameters: {
          alpha: cell.alpha,
          beta: cell.beta
        }
      };
      return betaPerformace;
    case 'gamma':
      const gammaPerformance: IGammaPerformance = {
        type: 'dgamma',
        parameters: {
          alpha: cell.alpha,
          beta: cell.beta
        }
      };
      return gammaPerformance;
    case 'text':
      const textPerformance: ITextPerformance = {
        type: 'empty',
        value: cell.text
      };
      return textPerformance;
    case 'empty':
      const emptyPermormace: IEmptyPerformance = {
        type: 'empty'
      };
      return emptyPermormace;
  }
}

export function createOrdering(
  criteria: Record<string, IProblemCriterion>,
  alternatives: Record<string, {title: string}>
): IOrdering {
  return {
    criteria: _.keys(criteria),
    alternatives: _.keys(alternatives),
    dataSources: _.reduce(
      criteria,
      function (accum, criterion) {
        return accum.concat(_.map(criterion.dataSources, 'id'));
      },
      []
    )
  };
}

export function buildEmptyInProgress(): IWorkspace {
  const criterionIds = [generateUuid(), generateUuid()];
  const criteria: ICriterion[] = _.map(criterionIds, buildInprogressCriterion);

  const alternatives: IAlternative[] = [
    {
      id: generateUuid(),
      title: 'alternative 1'
    },
    {
      id: generateUuid(),
      title: 'alternative 2'
    }
  ];
  return {
    workspace: {
      title: 'new workspace',
      therapeuticContext: '',
      useFavourability: true
    },
    criteria: criteria,
    alternatives: alternatives,
    effects: [],
    distributions: []
  };
}

function buildInprogressCriterion(criterionId: string, index: number) {
  return {
    id: criterionId,
    isFavourable: true,
    title: `criterion ${index + 1}`,
    description: '',
    dataSources: [
      {
        id: generateUuid(),
        criterionId: criterionId,
        reference: '',
        uncertainty: '',
        strengthOfEvidence: '',
        unitOfMeasurement: {
          label: '',
          type: UnitOfMeasurementType.custom
        }
      }
    ]
  };
}

export function buildInProgressCopy(workspace: IOldWorkspace): IWorkspace {
  const idMap = buildIdMap(
    workspace.problem.criteria,
    workspace.problem.alternatives
  );
  const isPercentageMap = buildPercentageMap(workspace.problem.criteria);

  return {
    workspace: buildInProgressWorkspace(workspace),
    criteria: buildInProgressCriteria(workspace.problem.criteria, idMap),
    alternatives: buildInProgressAlternatives(
      workspace.problem.alternatives,
      idMap
    ),
    effects: buildInProgressEffects(
      workspace.problem.performanceTable,
      idMap,
      isPercentageMap
    ),
    distributions: buildInProgressDistributions(
      workspace.problem.performanceTable,
      idMap,
      isPercentageMap
    )
  };
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
  const values = _.flatMap(criteria, (criterion): [string, string][] => {
    return _.map(criterion.dataSources, (dataSource): [string, string] => {
      return [dataSource.id, generateUuid()];
    });
  });
  return _.fromPairs(values);
}

export function buildInProgressWorkspace(
  workspace: IOldWorkspace
): IInProgressWorkspace {
  return {
    title: `Copy of ${workspace.problem.title}`,
    therapeuticContext: workspace.problem.description,
    useFavourability: _.some(
      workspace.problem.criteria,
      (criterion): boolean => {
        return criterion.hasOwnProperty('isFavorable');
      }
    )
  };
}

export function buildInProgressCriteria(
  criteria: Record<string, IProblemCriterion>,
  idMap: Record<string, string>
): ICriterion[] {
  return _.map(
    criteria,
    (criterion: IProblemCriterion, oldId: string): ICriterion => {
      return {
        id: idMap[oldId],
        title: criterion.title,
        description: criterion.description,
        isFavourable: !!criterion.isFavorable,
        dataSources: buildInProgressDataSources(criterion, idMap[oldId], idMap)
      };
    }
  );
}

export function buildInProgressDataSources(
  criterion: IProblemCriterion,
  criterionId: string,
  idMap: Record<string, string>
): IDataSource[] {
  return _.map(
    criterion.dataSources,
    (dataSource): IDataSource => {
      return {
        id: idMap[dataSource.id],
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

export function buildInProgressAlternatives(
  alternatives: Record<string, {title: string}>,
  idMap: Record<string, string>
): IAlternative[] {
  return _.map(
    alternatives,
    (alternative: {title: string}, oldId: string): IAlternative => {
      return {
        id: idMap[oldId],
        title: alternative.title
      };
    }
  );
}

export function buildInProgressEffects(
  performanceTable: IPerformanceTableEntry[],
  idMap: Record<string, string>,
  isPercentageMap: Record<string, boolean>
): Effect[] {
  return _(performanceTable)
    .filter((entry: IPerformanceTableEntry): boolean => {
      return isNotNMAEntry(entry) && 'effect' in entry.performance;
    })
    .map(_.partial(buildEffect, idMap, isPercentageMap))
    .value();
}

export function isNotNMAEntry(entry: IPerformanceTableEntry) {
  return 'alternative' in entry;
}

export function buildEffect(
  idMap: Record<string, string>,
  isPercentageMap: Record<string, boolean>,
  entry: IPerformanceTableEntry
): Effect {
  const performance = entry.performance as IEffectPerformance;
  const effectPerformance = performance.effect;
  const modifier = isPercentageMap[entry.dataSource] ? 100 : 1;
  const effectBase = {
    alternativeId: idMap[entry.alternative],
    dataSourceId: idMap[entry.dataSource],
    criterionId: idMap[entry.criterion]
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

export function buildInProgressDistributions(
  performanceTable: IPerformanceTableEntry[],
  idMap: Record<string, string>,
  isPercentageMap: Record<string, boolean>
): Distribution[] {
  return _(performanceTable)
    .filter((entry: IPerformanceTableEntry): boolean => {
      return isNotNMAEntry(entry) && 'distribution' in entry.performance;
    })
    .map(_.partial(buildDistribution, idMap, isPercentageMap))
    .value();
}

export function buildDistribution(
  idMap: Record<string, string>,
  isPercentageMap: Record<string, boolean>,
  entry: IPerformanceTableEntry
): Distribution {
  const performance = entry.performance as IDistributionPerformance;
  const modifier = isPercentageMap[entry.dataSource] ? 100 : 1;
  const distributionBase = {
    alternativeId: idMap[entry.alternative],
    dataSourceId: idMap[entry.dataSource],
    criterionId: idMap[entry.criterion]
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

export function mapToCellCommands(
  tableCells: (Effect | Distribution)[],
  inProgressId: number,
  cellType: TableInputMode
): ICellCommand[] {
  return _.map(
    tableCells,
    (cell): ICellCommand => {
      return {
        ...cell,
        cellType: cellType,
        inProgressWorkspaceId: inProgressId
      };
    }
  );
}

export function buildPercentageMap(
  criteria: Record<string, IProblemCriterion>
): Record<string, boolean> {
  const values = _.flatMap(criteria, (criterion): [string, boolean][] => {
    return _.map(criterion.dataSources, (dataSource): [string, boolean] => {
      return [
        dataSource.id,
        dataSource.unitOfMeasurement.type === 'percentage'
      ];
    });
  });
  return _.fromPairs(values);
}
