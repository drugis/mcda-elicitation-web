import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import {ElicitationContext} from 'app/ts/PreferencesTab/Elicitation/ElicitationContext';
import ImpreciseSwingSlider from 'app/ts/PreferencesTab/Elicitation/ImpreciseSwingElicitation/ImpreciseSwingSlider/ImpreciseSwingSlider';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import React, {useContext} from 'react';
import PreciseSwingSlider from '../../../PreciseSwingElicitation/PreciseSwingSlider/PreciseSwingSlider';

export default function CriterionOverview({
  criterion
}: {
  criterion: IPreferencesCriterion;
}) {
  const {elicitationMethod} = useContext(ElicitationContext);
  const {pvfs} = useContext(PreferencesContext);

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
      <TableCell align="center">{getWorst(pvfs[criterion.id])}</TableCell>
      <TableCell align="center">{getBest(pvfs[criterion.id])}</TableCell>
      <TableCell align="center">{renderSwingSlider()}</TableCell>
    </TableRow>
  );
}
