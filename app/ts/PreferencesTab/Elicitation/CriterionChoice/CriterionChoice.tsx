import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import {
  getBest,
  getWorst
} from '../../Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from '../../PreferencesContext';

export default function CriterionChoice({
  criterion
}: {
  criterion: IPreferencesCriterion;
}) {
  const {showPercentages} = useContext(SettingsContext);
  const {pvfs} = useContext(PreferencesContext);

  const pvf = pvfs[criterion.id];
  const usePercentage =
    showPercentages && canBePercentage(criterion.unitOfMeasurement.type);

  return (
    <label id={`ranking-choice-${criterion.id}`}>
      <Radio value={criterion.id} />
      {`${pvf.direction} `}
      <Tooltip
        disableHoverListener={!criterion.description}
        title={criterion.description ? criterion.description : ''}
      >
        <span
          id={`criterion-option-${criterion.id}`}
          className="criterion-title"
        >
          {criterion.title}
        </span>
      </Tooltip>
      {` from ${getWorst(pvf, usePercentage)} to ${getBest(
        pvf,
        usePercentage
      )}`}
    </label>
  );
}
