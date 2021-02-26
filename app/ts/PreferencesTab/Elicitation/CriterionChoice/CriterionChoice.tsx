import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import ICriterion from '@shared/interface/ICriterion';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';
import {
  getBest,
  getWorst
} from '../../Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from '../../PreferencesContext';

export default function CriterionChoice({criterion}: {criterion: ICriterion}) {
  const {getUsePercentage} = useContext(SettingsContext);
  const {pvfs} = useContext(PreferencesContext);

  const pvf = pvfs[criterion.id];
  const usePercentage = getUsePercentage(criterion);

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
