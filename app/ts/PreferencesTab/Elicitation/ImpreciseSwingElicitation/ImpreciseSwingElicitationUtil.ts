import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import _ from 'lodash';
import IRatioBound from '../Interface/IRatioBound';

export function buildInitialImprecisePreferences(
  criteria: Record<string, IPreferencesCriterion>,
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
