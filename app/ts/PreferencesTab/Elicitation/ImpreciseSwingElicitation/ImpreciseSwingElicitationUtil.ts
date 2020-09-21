import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import _ from 'lodash';

export function buildInitialImprecisePreferences(
  criteria: Record<string, IPreferencesCriterion>,
  mostImportantCriterionId: string
): Record<string, IRatioBoundConstraint> {
  return _(criteria)
    .reject(['id', mostImportantCriterionId])
    .map((criterion) => {
      const preference: IRatioBoundConstraint = {
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
