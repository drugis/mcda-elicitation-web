import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
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
  const {pvfs} = useContext(PreferencesContext);
  const pvf = pvfs[criterion.id];
  return (
    <label key={criterion.id}>
      <Radio key={criterion.id} value={criterion.id} />
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
      {` from ${getWorst(pvf)} to ${getBest(pvf)}`}
    </label>
  );
}
