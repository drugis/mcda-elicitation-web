import Tooltip from '@material-ui/core/Tooltip';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {useContext} from 'react';

export default function CriterionSituation({
  criterion,
  displayValue
}: {
  criterion: IPreferencesCriterion;
  displayValue: number;
}) {
  const {showPercentages} = useContext(SettingsContext);

  return (
    <ul key={criterion.id}>
      <li>
        <Tooltip
          disableHoverListener={!criterion.description}
          title={criterion.description ? criterion.description : ''}
        >
          <span className="criterion-title">{criterion.title}</span>
        </Tooltip>
        : {displayValue}{' '}
        {getUnitLabel(criterion.unitOfMeasurement, showPercentages)}
      </li>
    </ul>
  );
}
