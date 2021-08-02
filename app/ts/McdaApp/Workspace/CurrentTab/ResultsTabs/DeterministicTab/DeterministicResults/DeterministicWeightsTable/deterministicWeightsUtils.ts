import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/IWeights';
import {TPvf} from '@shared/interface/Problem/IPvf';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import _ from 'lodash';
import {getEquivalentChange} from '../../../../Preferences/EquivalentChange/equivalentChangeUtil';
import {buildImportances} from '../../../../Preferences/PreferencesWeights/PreferencesWeightsTable/PreferencesWeightsTableUtil';

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
  criteria: ICriterion[],
  weights: IWeights,
  pvfs: Record<string, TPvf>,
  partOfInterval: number,
  referenceWeight: number
) {
  return _(criteria)
    .keyBy('id')
    .mapValues((criterion: ICriterion): IChangeableValue => {
      const equivalentChange = getEquivalentChange(
        weights.mean[criterion.id],
        pvfs[criterion.id],
        partOfInterval,
        referenceWeight
      );
      return {
        originalValue: equivalentChange,
        currentValue: equivalentChange
      };
    })
    .value();
}
