import Tooltip from '@material-ui/core/Tooltip';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import React from 'react';

export default function CriterionSituation({
  criterion,
  displayValue
}: {
  criterion: IPreferencesCriterion;
  displayValue: number;
}) {
  return (
    <ul key={criterion.id}>
      <li>
        <Tooltip
          disableHoverListener={!criterion.description}
          title={criterion.description ? criterion.description : ''}
        >
          <span className="criterion-title">{criterion.title}</span>
        </Tooltip>
        : {displayValue} {criterion.unitOfMeasurement.label}
      </li>
    </ul>
  );
}
