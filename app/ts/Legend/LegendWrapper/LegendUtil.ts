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
