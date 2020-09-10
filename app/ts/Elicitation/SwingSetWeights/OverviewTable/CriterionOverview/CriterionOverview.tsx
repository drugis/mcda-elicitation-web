import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import ImpreciseSwingSlider from 'app/ts/Elicitation/ImpreciseSwingElicitation/ImpreciseSwingSlider/ImpreciseSwingSlider';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import React, {useContext} from 'react';
import PreciseSwingSlider from '../../../PreciseSwingElicitation/PreciseSwingSlider/PreciseSwingSlider';

export default function CriterionOverview({
  criterion
}: {
  criterion: IElicitationCriterion;
}) {
  const {elicitationMethod} = useContext(ElicitationContext);

  function renderSwingSlider(): JSX.Element {
    if (elicitationMethod === 'precise') {
      return <PreciseSwingSlider criterion={criterion} />;
    } else if (elicitationMethod === 'imprecise') {
      return <ImpreciseSwingSlider criterion={criterion} />;
    }
  }

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
      <TableCell align="center">{renderSwingSlider()}</TableCell>
    </TableRow>
  );
}
