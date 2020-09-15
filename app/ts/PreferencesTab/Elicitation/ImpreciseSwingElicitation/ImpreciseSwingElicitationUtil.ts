import _ from 'lodash';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IRatioBound from '../Interface/IRatioBound';

export function setInitialImprecisePreferences(
  criteria: Record<string, IElicitationCriterion>,
  mostImportantCriterionId: string
): Record<string, IRatioBound> {
  return _(criteria)
    .reject(['id', mostImportantCriterionId])
    .map((criterion) => {
      const preference: IRatioBound = {
        criteria: [mostImportantCriterionId, criterion.id],
        elicitationMethod: 'imprecise',
        type: 'ratio bound',
        bounds: [1, 100]
      };
      return [criterion.id, preference];
    })
    .fromPairs()
    .value();
}
