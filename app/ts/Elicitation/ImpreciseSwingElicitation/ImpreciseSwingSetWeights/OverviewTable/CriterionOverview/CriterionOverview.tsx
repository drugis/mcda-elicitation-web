import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import React from 'react';
import ImpreciseSwingSlider from './ImpreciseSwingSlider/ImpreciseSwingSlider';

export default function CriterionOverview({
  criterion
}: {
  criterion: IElicitationCriterion;
}) {
  return (
    <TableRow key={criterion.id}>
      <TableCell>
        <Tooltip
          disableHoverListener={!criterion.description}
          title={criterion.description ? criterion.description : ''}
        >
          <span className="criterion-title">{criterion.title}</span>
        </Tooltip>
      </TableCell>
      <TableCell>{criterion.unitOfMeasurement.label}</TableCell>
      <TableCell align="center">{getWorst(criterion)}</TableCell>
      <TableCell align="center">{getBest(criterion)}</TableCell>
      <TableCell align="center">
        <ImpreciseSwingSlider criterion={criterion} />
      </TableCell>
    </TableRow>
  );
}
