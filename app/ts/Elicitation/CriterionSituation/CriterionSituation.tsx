import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import IElicitationCriterion from '../Interface/IElicitationCriterion';

export default function CriterionSituation({
  criterion,
  displayValue
}: {
  criterion: IElicitationCriterion;
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
