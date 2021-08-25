import {TPvf} from '@shared/interface/Problem/IPvf';
import {getPercentifiedValueLabel} from 'app/ts/DisplayUtil/DisplayUtil';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import IDeterministicChangeableWeights from 'app/ts/interface/IDeterministicChangeableWeights';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import {getEquivalentChangeValue} from '../../../../Preferences/EquivalentChange/equivalentChangeUtil';
import {buildImportances} from '../../../../Preferences/PreferencesWeights/PreferencesWeightsTable/preferencesWeightsTableUtil';

export function buildDeterministicWeights(
  weights: Record<string, number>,
  pvfs: Record<string, TPvf>,
  partOfInterval: number,
  referenceWeight: number
): IDeterministicChangeableWeights {
  const importances = getDetermisticImportances(weights);
  const equivalentChanges = getDeterministicEquivalentChanges(
    weights,
    pvfs,
    partOfInterval,
    referenceWeight
  );

  return {
    importances,
    weights,
    equivalentChanges,
    partOfInterval
  };
}

export function getDetermisticImportances(
  weights: Record<string, number>
): Record<string, IChangeableValue> {
  return _.mapValues(
    buildImportances(weights),
    (importance: number): IChangeableValue => {
      return {originalValue: importance, currentValue: importance};
    }
  );
}

export function getDeterministicEquivalentChanges(
  weights: Record<string, number>,
  pvfs: Record<string, TPvf>,
  partOfInterval: number,
  referenceWeight: number
) {
  return _.mapValues(weights, (weight, criterionId): IChangeableValue => {
    const equivalentChange = getEquivalentChangeValue(
      weight,
      pvfs[criterionId],
      partOfInterval,
      referenceWeight
    );
    return {
      originalValue: equivalentChange,
      currentValue: equivalentChange
    };
  });
}

export function getDeterministicEquivalentChangeLabel(
  equivalentChange: IChangeableValue,
  usePercentage: boolean
): string {
  if (!equivalentChange) return '';
  if (
    significantDigits(equivalentChange.currentValue) !==
    significantDigits(equivalentChange.originalValue)
  ) {
    return `${getPercentifiedValueLabel(
      equivalentChange.currentValue,
      usePercentage
    )} (${getPercentifiedValueLabel(
      equivalentChange.originalValue,
      usePercentage
    )})`;
  } else {
    return getPercentifiedValueLabel(
      equivalentChange.currentValue,
      usePercentage
    );
  }
}

export function calculateNewDeterministicEquivalentChanges(
  importances: Record<string, IChangeableValue>,
  equivalentChanges: Record<string, IChangeableValue>
): Record<string, IChangeableValue> {
  return _.mapValues(importances, (importance, criterionId: string) => {
    const equivalentChange = equivalentChanges[criterionId];
    const newValue =
      (importance.originalValue / importance.currentValue) *
      equivalentChange.originalValue;
    return {...equivalentChange, currentValue: significantDigits(newValue)};
  });
}

export function calculateWeightsFromImportances(
  importances: Record<string, IChangeableValue>
): Record<string, number> {
  const totalImportance = _.reduce(
    importances,
    (accum, importance) => accum + importance.currentValue,
    0
  );
  return _.mapValues(importances, (importance) => {
    return importance.currentValue / totalImportance;
  });
}
