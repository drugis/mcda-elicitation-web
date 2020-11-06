import IOldSubproblem from '@shared/interface/IOldSubproblem';
import ISubproblemRange from '@shared/interface/ISubproblemRange';
import _ from 'lodash';

export function formatSubproblem(subproblem: any): IOldSubproblem {
  const excludedCriteria = subproblem.definition.excludedCriteria
    ? subproblem.definition.excludedCriteria
    : [];
  const excludedDataSources = subproblem.definition.excludedDataSources
    ? subproblem.definition.excludedDataSources
    : [];
  const excludedAlternatives = subproblem.definition.excludedAlternatives
    ? subproblem.definition.excludedAlternatives
    : [];
  const ranges = formatRanges(subproblem.definition.ranges);
  return {
    ...subproblem,
    definition: {
      excludedCriteria: excludedCriteria,
      excludedDataSources: excludedDataSources,
      excludedAlternatives: excludedAlternatives,
      ranges: ranges
    }
  };
}

function formatRanges(
  ranges: Record<string, ISubproblemRange> | Record<string, [number, number]>
): Record<string, [number, number]> {
  return _.mapValues(ranges, (range: any) => {
    return range.pvf ? range.pvf.range : range;
  });
}
