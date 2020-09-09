import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IProblem from '@shared/interface/Problem/IProblem';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IOrdinalRanking from '@shared/interface/Scenario/IOrdinalRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {TPreferences} from '@shared/types/Preferences';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';

export function buildImportance(
  criteria: Record<string, IPreferencesCriterion>,
  preferences: TPreferences
): Record<string, string> {
  return _.mapValues(criteria, (criterion) => {
    if (_.isEmpty(preferences)) {
      return '?';
    } else if (preferences[0].type === 'ordinal') {
      return determineRank(preferences as IOrdinalRanking[], criterion.id);
    } else {
      return buildCriterionImportance(
        preferences as IExactSwingRatio[] | IRatioBoundConstraint[],
        criterion.id
      );
    }
  });
}

function determineRank(preferences: IOrdinalRanking[], criterionId: string) {
  const preference = _.findIndex(preferences, (preference) => {
    return preference.criteria[1] === criterionId;
  });
  return preference !== undefined ? `${preference + 2}` : '1';
}

function buildCriterionImportance(
  preferences: IExactSwingRatio[] | IRatioBoundConstraint[],
  criterionId: string
) {
  const preference = _.find(
    preferences,
    (preference: IExactSwingRatio | IRatioBoundConstraint) => {
      return preference.criteria[1] === criterionId;
    }
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
