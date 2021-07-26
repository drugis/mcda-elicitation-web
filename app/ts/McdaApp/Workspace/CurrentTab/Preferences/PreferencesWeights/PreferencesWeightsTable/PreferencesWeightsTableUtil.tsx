import ICriterion from '@shared/interface/ICriterion';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {TPreferences} from '@shared/types/Preferences';
import _ from 'lodash';

export function buildImportances(
  criteria: ICriterion[],
  preferences: TPreferences
): Record<string, string> {
  return _(criteria)
    .keyBy('id')
    .mapValues((criterion): string => {
      if (_.isEmpty(preferences)) {
        return '?';
      } else if (preferences[0].type === 'ordinal') {
        return determineRank(preferences as IRanking[], criterion.id);
      } else {
        return buildCriterionImportance(
          preferences as IExactSwingRatio[] | IRatioBoundConstraint[],
          criterion.id
        );
      }
    })
    .value();
}

function determineRank(preferences: IRanking[], criterionId: string) {
  const preference = _.findIndex(
    preferences,
    (preference) => preference.criteria[1] === criterionId
  );
  return preference !== undefined ? `${preference + 2}` : '1';
}

function buildCriterionImportance(
  preferences: IExactSwingRatio[] | IRatioBoundConstraint[],
  criterionId: string
): string {
  const preference = _.find(
    preferences,
    (preference: IExactSwingRatio | IRatioBoundConstraint) =>
      preference.criteria[1] === criterionId
  );
  if (!preference) {
    return '100%';
  } else if (preference.type === 'exact swing') {
    return getExactValue(preference);
  } else if (preference.type === 'ratio bound') {
    return getImpreciseValue(preference);
  }
}

function getImpreciseValue(preference: IRatioBoundConstraint) {
  return (
    Math.round((1 / preference.bounds[1]) * 100) +
    '-' +
    Math.round((1 / preference.bounds[0]) * 100) +
    '%'
  );
}

function getExactValue(preference: IExactSwingRatio) {
  return Math.round((1 / preference.ratio) * 100) + '%';
}
