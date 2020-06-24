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
import IValueCellQueryResult from '../app/ts/interface/IValueCellQueryResult';
import IWorkspaceQueryResult from '../app/ts/interface/IWorkspaceQueryResult';

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
          lowerBound: queryDataSource.unitlowerbound,
          upperBound: queryDataSource.unitupperbound
        }
      };
    })
    .value();
}

export function mapCellValues(
  cellValues: IValueCellQueryResult[]
): [
  Record<string, Record<string, Effect>>,
  Record<string, Record<string, Distribution>>
] {
  const [effectCellValues, distributionCellValues] = _.partition(cellValues, [
    'cellType',
    'effect'
  ]);
  return [
    createEffectRecords(effectCellValues),
    createDistributionRecords(distributionCellValues)
  ];
}

function createEffectRecords(
  effectQueryResults: IValueCellQueryResult[]
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

function mapEffect(effectQueryResult: IValueCellQueryResult): Effect {
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
  distributionQueryResults: IValueCellQueryResult[]
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
  distributionQueryResult: IValueCellQueryResult
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
