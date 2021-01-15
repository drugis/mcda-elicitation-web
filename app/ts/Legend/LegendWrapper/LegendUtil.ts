import IAlternative from '@shared/interface/IAlternative';
import _ from 'lodash';

export function initLegend(
  legend: Record<string, string>,
  alternatives: IAlternative[]
): Record<string, string> {
  return legend
    ? legend
    : _(alternatives).keyBy('id').mapValues('title').value();
}

export function generateSingleLetterLegend(
  alternatives: IAlternative[]
): Record<string, string> {
  return _.fromPairs(
    _.map(alternatives, (alternative, index) => [
      alternative.id,
      String.fromCharCode(65 + index)
    ])
  );
}
