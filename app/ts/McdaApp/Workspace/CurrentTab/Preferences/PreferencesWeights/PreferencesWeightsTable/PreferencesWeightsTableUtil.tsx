import ICriterion from '@shared/interface/ICriterion';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {TPreferences} from '@shared/types/Preferences';
import _ from 'lodash';

export function buildImportances(
  criteria: ICriterion[],
  preferences: TPreferences
): Record<string, number> {
  // | [number, number]
  return _(criteria)
    .keyBy('id')
    .mapValues((criterion): number => {
      if (_.isEmpty(preferences)) {
        return null;
      } else {
        return buildCriterionImportance(
          preferences as IExactSwingRatio[] | IRatioBoundConstraint[],
          criterion.id
        );
      }
    })
    .value();
}

function buildCriterionImportance(
  preferences: IExactSwingRatio[] | IRatioBoundConstraint[],
  criterionId: string
): number {
  const preference = _.find(
    preferences,
    (preference: IExactSwingRatio | IRatioBoundConstraint) =>
      preference.criteria[1] === criterionId
  );
  if (!preference) {
    return 100;
  } else if (preference.type === 'exact swing') {
    return getExactValue(preference);
  }
  // } else if (preference.type === 'ratio bound') {
  //   return getImpreciseValue(preference);
  // }
}

function getImpreciseValue(
  preference: IRatioBoundConstraint
): [number, number] {
  return [
    Math.round((1 / preference.bounds[1]) * 100),
    Math.round((1 / preference.bounds[0]) * 100)
  ];
}

function getExactValue(preference: IExactSwingRatio): number {
  return Math.round((1 / preference.ratio) * 100);
}
