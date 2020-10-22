import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import IWorkspace from '@shared/interface/IWorkspace';
import _ from 'lodash';

export function getMissingValueWarnings(
  dataSourceInclusions: Record<string, boolean>,
  alternativeInclusions: Record<string, boolean>,
  scales: Record<string, Record<string, IScale>>,
  workspace: IWorkspace
): string[] {
  var warnings: string[] = [];
  var includedDataSourcesIds = _.keys(_.pickBy(dataSourceInclusions));
  var includedAlternativeIds = _.keys(_.pickBy(alternativeInclusions));
  // if (
  //   areDeterministicValuesMissing(
  //     includedDataSourcesIds,
  //     includedAlternativeIds,
  //     scales,
  //     workspace.effects
  //   )
  // ) {
  //   warnings.push(
  //     'Some cell(s) are missing deterministic values. SMAA values will be used for these cell(s).'
  //   );
  // }
  // if (
  //   areSmaaValuesMissing(
  //     includedDataSourcesIds,
  //     includedAlternativeIds,
  //     scales,
  //     performanceTable
  //   )
  // ) {
  //   warnings.push(
  //     'Some cell(s) are missing SMAA values. Deterministic values will be used for these cell(s).'
  //   );
  // }
  return warnings;
}

// function areDeterministicValuesMissing(
//   includedDataSourcesIds: string[],
//   includedAlternativeIds: string[],
//   scales: Record<string, Record<string, IScale>>,
//   effects: Effect[]
// ) {
//   return _.some(includedDataSourcesIds, function (dataSourceId) {
//     return _.some(includedAlternativeIds, function (alternativeId) {
//       return (
//         !isNullNaNorUndefined(scales[dataSourceId][alternativeId]['50%']) &&
//         missesEffectValue(performanceTable, dataSourceId, alternativeId)
//       );
//     });
//   });
// }

export function getScaleBlockingWarnings(
  criterionInclusions: Record<string, boolean>,
  dataSourceInclusions: Record<string, boolean>,
  alternativeInclusions: Record<string, boolean>,
  workspace: IWorkspace
): string[] {
  let warnings: string[] = [];
  if (
    areValuesMissingInEffectsTable(
      workspace,
      criterionInclusions,
      dataSourceInclusions,
      alternativeInclusions
    )
  ) {
    warnings.push('Effects table contains missing values');
  }
  if (
    areTooManyDataSourcesSelected(
      _.keyBy(workspace.criteria, 'id'),
      criterionInclusions,
      dataSourceInclusions
    )
  ) {
    warnings.push('Effects table contains multiple data sources per criterion');
  }
  return warnings;
}

function areValuesMissingInEffectsTable(
  workspace: IWorkspace,
  criterionInclusions: Record<string, boolean>,
  dataSourceInclusions: Record<string, boolean>,
  alternativeInclusions: Record<string, boolean>
): boolean {
  const includedCriteria = _.filter(workspace.criteria, (criterion) => {
    return criterionInclusions[criterion.id];
  });
  const includedDataSources: IDataSource[] = _.flatMap(
    includedCriteria,
    (criterion) => {
      return _.filter(criterion.dataSources, (dataSource) => {
        return dataSourceInclusions[dataSource.id];
      });
    }
  );
  return _.some(includedDataSources, (dataSource) => {
    return _.some(workspace.alternatives, (alternative) => {
      const effectForCoordinates = _.find(workspace.effects, (effect) => {
        return (
          effect.dataSourceId === dataSource.id &&
          effect.alternativeId === alternative.id
        );
      });
      const distributionForCoordinates = _.find(
        workspace.distributions,
        (distribution) => {
          return (
            distribution.dataSourceId === dataSource.id &&
            distribution.alternativeId === alternative.id
          );
        }
      );
      return (
        alternativeInclusions[alternative.id] &&
        hasEmptyEffect(effectForCoordinates) &&
        hasEmptyDistribution(distributionForCoordinates)
      );
    });
  });
}

function hasEmptyEffect(effect: Effect): boolean {
  return !effect || effect.type === 'empty' || effect.type === 'text';
}
function hasEmptyDistribution(distribution: Distribution): boolean {
  return (
    !distribution ||
    distribution.type === 'empty' ||
    distribution.type === 'text'
  );
}

function areTooManyDataSourcesSelected(
  criteria: Record<string, ICriterion>,
  criterionInclusions: Record<string, boolean>,
  dataSourceInclusions: Record<string, boolean>
): boolean {
  return _.some(criterionInclusions, (criterionInclusion, criterionId) => {
    const criterion = criteria[criterionId];
    const numberOfSelectedDataSources = _.countBy(
      criterion.dataSources,
      (dataSource) => {
        return dataSourceInclusions[dataSource.id];
      }
    ).true;
    return criterionInclusion && numberOfSelectedDataSources > 1;
  });
}
