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
    _.zip(
      _.map(alternatives, 'id'),
      _.map(_.range(65, 65 + alternatives.length), (value: number) =>
        String.fromCharCode(value)
      )
    )
  );
}
