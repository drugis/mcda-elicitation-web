import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import {getBest, getWorst} from '../ElicitationUtil';
import IElicitationCriterion from '../Interface/IElicitationCriterion';

export default function CriterionChoice({
  criterion,
  index
}: {
  criterion: IElicitationCriterion;
  index: number;
}) {
  return (
    <label key={criterion.id}>
      <Radio key={criterion.id} value={criterion.id} />
      {`${criterion.pvfDirection} `}
      <Tooltip
        disableHoverListener={!criterion.description}
        title={criterion.description ? criterion.description : ''}
      >
        <span id={`criterion-option-${index}`} className="criterion-title">
          {criterion.title}
        </span>
      </Tooltip>
      {` from ${getWorst(criterion)} to ${getBest(criterion)}`}
    </label>
  );
}
