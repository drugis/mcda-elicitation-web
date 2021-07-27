import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IWeights from '@shared/interface/IWeights';
import {TPvf} from '@shared/interface/Problem/IPvf';
import {TPreferences} from '@shared/types/Preferences';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import _ from 'lodash';
import {getEquivalentValue} from '../../../../Preferences/EquivalentChange/equivalentChangeUtil';
import {buildImportances} from '../../../../Preferences/PreferencesWeights/PreferencesWeightsTable/PreferencesWeightsTableUtil';

export function getDetermisticImportances(
  criteria: ICriterion[],
  preferences: TPreferences
): Record<string, IChangeableValue> {
  return _.mapValues(
    buildImportances(criteria, preferences),
    (importance: number): IChangeableValue => {
      return {originalValue: importance, currentValue: importance};
    }
  );
}

export function getDeterministicEquivalentChanges(
  getUsePercentage: (dataSource: IDataSource) => boolean,
  criteria: ICriterion[],
  weights: IWeights,
  pvfs: Record<string, TPvf>,
  partOfInterval: number,
  referenceWeight: number
) {
  return _(criteria)
    .map((criterion: ICriterion): IChangeableValue => {
      return {
        originalValue: getEquivalentValue(
          getUsePercentage(criterion.dataSources[0]),
          weights.mean[criterion.id],
          pvfs[criterion.id],
          partOfInterval,
          referenceWeight
        ),
        currentValue: 1
      };
    })
    .keyBy('id')
    .value();
}
