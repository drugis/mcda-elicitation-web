import IAlternative from '@shared/interface/IAlternative';
import IAlternativeQueryResult from '@shared/interface/IAlternativeQueryResult';
import ICellCommand from '@shared/interface/ICellCommand';
import ICriterion from '@shared/interface/ICriterion';
import ICriterionQueryResult from '@shared/interface/ICriterionQueryResult';
import IDatabaseInputCell from '@shared/interface/IDatabaseInputCell';
import IDataSource from '@shared/interface/IDataSource';
import IDataSourceQueryResult from '@shared/interface/IDataSourceQueryResult';
import { Distribution } from '@shared/interface/IDistribution';
import { Effect } from '@shared/interface/IEffect';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IOrdering from '@shared/interface/IOrdering';
import { UnitOfMeasurementType } from '@shared/interface/IUnitOfMeasurement';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceProperties from '@shared/interface/IWorkspaceProperties';
import IWorkspaceQueryResult from '@shared/interface/IWorkspaceQueryResult';
import IBetaPerformance from '@shared/interface/Problem/IBetaPerformance';
import { DistributionPerformance } from '@shared/interface/Problem/IDistributionPerformance';
import { EffectPerformance } from '@shared/interface/Problem/IEffectPerformance';
import IEmptyPerformance from '@shared/interface/Problem/IEmptyPerformance';
import IGammaPerformance from '@shared/interface/Problem/IGammaPerformance';
import INormalPerformance from '@shared/interface/Problem/INormalPerformance';
import { Performance } from '@shared/interface/Problem/IPerformance';
import { IPerformanceTableEntry } from '@shared/interface/Problem/IPerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import IRangeDistributionPerformance from '@shared/interface/Problem/IRangeDistributionPerformance';
import IRangeEffectPerformance from '@shared/interface/Problem/IRangeEffectPerformance';
import ITextPerformance from '@shared/interface/Problem/ITextPerformance';
import IValueCIPerformance from '@shared/interface/Problem/IValueCIPerformance';
import IValuePerformance from '@shared/interface/Problem/IValuePerformance';
import { generateUuid } from '@shared/util';
import { TableInputMode } from 'app/ts/type/TableInputMode';
import _ from 'lodash';
import { CURRENT_SCHEMA_VERSION } from '../app/ts/ManualInput/constants';
import significantDigits from '../app/ts/ManualInput/Util/significantDigits';

export function mapWorkspace(
  queryResult: IWorkspaceQueryResult
): IWorkspaceProperties {
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
      (queryCriterion: ICriterionQueryResult): ICriterion => {
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
      (queryAlternative: IAlternativeQueryResult): IAlternative => {
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
      (queryDataSource: IDataSourceQueryResult): IDataSource => {
        return {
          id: queryDataSource.id,
          criterionId: queryDataSource.criterionid,
          reference: queryDataSource.reference,
          referenceLink: queryDataSource.referencelink,
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
      effectQueryResult: IDatabaseInputCell
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
      distributionQueryResult: IDatabaseInputCell
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
  IWorkspaceProperties,
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
  const newCriteria = _.map(criteria, (criterion: ICriterion) => {
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
    sourceLink: dataSource.referenceLink,
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
    .mapValues((alternative) => {
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
  return _.map(criterion.dataSources, (dataSource: IDataSource) => {
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
  return _.map(alternatives, (alternative: IAlternative) => {
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
      (accum: string[], criterion: IProblemCriterion) => {
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
    properties: {
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
        referenceLink: '',
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

export function mapToCriteriaQueryResult(
  criteria: ICriterion[],
  inProgressId: string
): ICriterionQueryResult[] {
  return _.map(
    criteria,
    (criterion: ICriterion, index: number): ICriterionQueryResult => {
      return {
        id: criterion.id,
        title: criterion.title,
        description: criterion.description || '',
        isfavourable: criterion.isFavourable,
        orderindex: index,
        inprogressworkspaceid: Number.parseInt(inProgressId)
      };
    }
  );
}

export function mapToDataSourceQueryResult(
  dataSources: IDataSource[],
  inprogresId: string
): IDataSourceQueryResult[] {
  return _.map(
    dataSources,
    (item: IDataSource, index: number): IDataSourceQueryResult => {
      return {
        id: item.id,
        orderindex: index,
        criterionid: item.criterionId,
        inprogressworkspaceid: Number.parseInt(inprogresId),
        unitlabel: item.unitOfMeasurement.label,
        unittype: item.unitOfMeasurement.type,
        unitlowerbound: item.unitOfMeasurement.lowerBound,
        unitupperbound: item.unitOfMeasurement.upperBound,
        reference: item.reference || '',
        referencelink: item.referenceLink || '',
        strengthofevidence: item.strengthOfEvidence || '',
        uncertainty: item.uncertainty || ''
      };
    }
  );
}

export function mapToAlternativeQueryResult(
  alternatives: IAlternative[],
  inprogressId: string
): IAlternativeQueryResult[] {
  return _.map(
    alternatives,
    (alternative: IAlternative, index: number): IAlternativeQueryResult => {
      return {
        id: alternative.id,
        orderindex: index,
        inprogressworkspaceid: Number.parseInt(inprogressId),
        title: alternative.title
      };
    }
  );
}
