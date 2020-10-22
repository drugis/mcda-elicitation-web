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
