import _ from 'lodash';
import IAlternative from '../app/ts/interface/IAlternative';
import IAlternativeQueryResult from '../app/ts/interface/IAlternativeQueryResult';
import ICriterion from '../app/ts/interface/ICriterion';
import ICriterionQueryResult from '../app/ts/interface/ICriterionQueryResult';
import IDataSource from '../app/ts/interface/IDataSource';
import IDataSourceQueryResult from '../app/ts/interface/IDataSourceQueryResult';
import {Distribution} from '../app/ts/interface/IDistribution';
import {Effect} from '../app/ts/interface/IEffect';
import IInProgressMessage from '../app/ts/interface/IInProgressMessage';
import IInProgressWorkspace from '../app/ts/interface/IInProgressWorkspace';
import IInputCellQueryResult from '../app/ts/interface/IInputCellQueryResult';
import {UnitOfMeasurementType} from '../app/ts/interface/IUnitOfMeasurement';
import IWorkspaceQueryResult from '../app/ts/interface/IWorkspaceQueryResult';
import IBetaPerformance from '../app/ts/interface/Problem/IBetaPerformance';
import {DistributionPerformance} from '../app/ts/interface/Problem/IDistributionPerformance';
import {EffectPerformance} from '../app/ts/interface/Problem/IEffectPerformance';
import IEmptyPerformance from '../app/ts/interface/Problem/IEmptyPerformance';
import IGammaPerformance from '../app/ts/interface/Problem/IGammaPerformance';
import INormalPerformance from '../app/ts/interface/Problem/INormalPerformance';
import IPerformance from '../app/ts/interface/Problem/IPerformance';
import {IPerformanceTableEntry} from '../app/ts/interface/Problem/IPerformanceTableEntry';
import IProblem from '../app/ts/interface/Problem/IProblem';
import IProblemCriterion from '../app/ts/interface/Problem/IProblemCriterion';
import IProblemDataSource from '../app/ts/interface/Problem/IProblemDataSource';
import IRangeDistributionPerformance from '../app/ts/interface/Problem/IRangeDistributionPerformance';
import IRangeEffectPerformance from '../app/ts/interface/Problem/IRangeEffectPerformance';
import ITextPerformance from '../app/ts/interface/Problem/ITextPerformance';
import IValueCIPerformance from '../app/ts/interface/Problem/IValueCIPerformance';
import IValuePerformance from '../app/ts/interface/Problem/IValuePerformance';
import {CURRENT_SCHEMA_VERSION} from '../app/ts/ManualInput/constants';
import {generateDistribution} from '../app/ts/ManualInput/ManualInputService/ManualInputService';
import significantDigits from '../app/ts/ManualInput/Util/significantDigits';

export function mapWorkspace(queryResult: IWorkspaceQueryResult) {
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
    .map((queryCriterion) => {
      return {
        id: queryCriterion.id,
        title: queryCriterion.title,
        description: queryCriterion.description,
        isFavourable: queryCriterion.isfavourable,
        dataSources: []
      };
    })
    .value();
}

export function mapAlternatives(
  alternatives: IAlternativeQueryResult[]
): IAlternative[] {
  return _(alternatives)
    .sortBy('orderindex')
    .map((queryAlternative) => {
      return {
        id: queryAlternative.id,
        title: queryAlternative.title
      };
    })
    .value();
}

export function mapDataSources(
  dataSources: IDataSourceQueryResult[]
): IDataSource[] {
  return _(dataSources)
    .sortBy('orderindex')
    .map((queryDataSource) => {
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
    })
    .value();
}

export function mapCellValues(
  cellValues: IInputCellQueryResult[]
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
  effectQueryResults: IInputCellQueryResult[]
): Record<string, Record<string, Effect>> {
  return _.reduce(
    effectQueryResults,
    (accum, effectQueryResult) => {
      if (!accum[effectQueryResult.datasourceid]) {
        accum[effectQueryResult.datasourceid] = {};
      }
      accum[effectQueryResult.datasourceid][
        effectQueryResult.alternativeid
      ] = mapEffect(effectQueryResult);
      return accum;
    },
    {} as Record<string, Record<string, Effect>>
  );
}

function mapEffect(effectQueryResult: IInputCellQueryResult): Effect {
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
  distributionQueryResults: IInputCellQueryResult[]
): Record<string, Record<string, Distribution>> {
  return _.reduce(
    distributionQueryResults,
    (accum, distributionQueryResult) => {
      if (!accum[distributionQueryResult.datasourceid]) {
        accum[distributionQueryResult.datasourceid] = {};
      }
      accum[distributionQueryResult.datasourceid][
        distributionQueryResult.alternativeid
      ] = mapDistribution(distributionQueryResult);
      return accum;
    },
    {} as Record<string, Record<string, Distribution>>
  );
}

function mapDistribution(
  distributionQueryResult: IInputCellQueryResult
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

export function mapCombinedResults(
  results: [
    IInProgressWorkspace,
    ICriterion[],
    IAlternative[],
    IDataSource[],
    [
      Record<string, Record<string, Effect>>,
      Record<string, Record<string, Distribution>>
    ]
  ]
): IInProgressMessage {
  return {
    workspace: results[0],
    criteria: mapDataSourcesOntoCriteria(results[1], results[3]),
    alternatives: results[2],
    effects: results[4][0],
    distributions: results[4][1]
  };
}

function mapDataSourcesOntoCriteria(
  criteria: ICriterion[],
  dataSources: IDataSource[]
): ICriterion[] {
  const dataSourcesGroupedByCriterion = _.groupBy(dataSources, 'criterionId');
  return _.map(criteria, (criterion) => {
    return {
      ...criterion,
      dataSources: dataSourcesGroupedByCriterion[criterion.id]
        ? dataSourcesGroupedByCriterion[criterion.id]
        : []
    };
  });
}

export function createProblem(inProgressMessage: IInProgressMessage): IProblem {
  const newDistributions = createMissingDistributions(
    inProgressMessage.effects,
    inProgressMessage.distributions
  );
  inProgressMessage.distributions = newDistributions;
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    title: inProgressMessage.workspace.title,
    description: inProgressMessage.workspace.therapeuticContext,
    criteria: buildCriteria(inProgressMessage.criteria),
    alternatives: buildAlternatives(inProgressMessage.alternatives),
    performanceTable: buildPerformanceTable(inProgressMessage)
  };
}

function createMissingDistributions(
  effects: Record<string, Record<string, Effect>>,
  distributions: Record<string, Record<string, Distribution>>
): Record<string, Record<string, Distribution>> {
  let distributionsCopy = _.cloneDeep(distributions);
  _.forEach(effects, (row: Record<string, Effect>, dataSourceId: string) => {
    _.forEach(row, (effect: Effect, alternativeId: string) => {
      if (!distributionsCopy[dataSourceId]) {
        distributionsCopy[dataSourceId] = {};
      }
      if (!distributionsCopy[dataSourceId][alternativeId]) {
        const newDistribution = generateDistribution(effect);
        distributionsCopy[dataSourceId][alternativeId] = newDistribution;
      } else {
        distributionsCopy[dataSourceId][alternativeId] =
          distributions[dataSourceId][alternativeId];
      }
    });
  });
  return distributionsCopy;
}

function buildCriteria(
  criteria: ICriterion[]
): Record<string, IProblemCriterion> {
  const newCriteria = _.map(criteria, function (criterion) {
    const newCriterion = {
      title: criterion.title,
      description: criterion.description,
      isFavorable: criterion.isFavourable,
      dataSources: _.map(criterion.dataSources, buildDataSource)
    };
    return [criterion.id, newCriterion];
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
    const distributionCell = distributions[dataSource.id][alternative.id];

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
): IPerformance {
  const isPercentage = unitOfMeasurementType === 'percentage';
  return {
    effect: buildEffectPerformance(effectCell, isPercentage),
    distribution: buildDistributionPerformance(distributionCell, isPercentage)
  };
}

function buildEffectPerformance(
  cell: Effect,
  isPercentage: boolean
): EffectPerformance {
  switch (cell.type) {
    case 'value':
      const valuePerformance: IValuePerformance = {
        type: 'exact',
        value: cell.value
      };
      return valuePerformance;
    case 'valueCI':
      const valueCIPerformance: IValueCIPerformance = {
        type: 'exact',
        value: cell.value,
        input: {
          value: cell.value,
          lowerBound: cell.lowerBound,
          upperBound: cell.upperBound
        }
      };
      return valueCIPerformance;
    case 'range':
      const percentageModifier = isPercentage ? 100 : 1;
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
  switch (cell.type) {
    case 'value':
      const valuePerformance: IValuePerformance = {
        type: 'exact',
        value: cell.value
      };
      return valuePerformance;
    case 'range':
      const percentageModifier = isPercentage ? 100 : 1;
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
          mu: cell.mean,
          sigma: cell.standardError
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
