import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import ICriterion from '@shared/interface/ICriterion';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import {ElicitationContext} from 'app/ts/PreferencesTab/Elicitation/ElicitationContext';
import ImpreciseSwingSlider from 'app/ts/PreferencesTab/Elicitation/ImpreciseSwingElicitation/ImpreciseSwingSlider/ImpreciseSwingSlider';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {useContext} from 'react';
import PreciseSwingSlider from '../../../PreciseSwingElicitation/PreciseSwingSlider/PreciseSwingSlider';

export default function CriterionOverview({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {showPercentages} = useContext(SettingsContext);
  const {elicitationMethod} = useContext(ElicitationContext);
  const {pvfs} = useContext(PreferencesContext);
  const unitType = criterion.dataSources[0].unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unitType);

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
      <TableCell>
        {getUnitLabel(
          criterion.dataSources[0].unitOfMeasurement,
          showPercentages
        )}
      </TableCell>
      <TableCell align="center">
        {getWorst(pvfs[criterion.id], usePercentage)}
      </TableCell>
      <TableCell align="center">
        {getBest(pvfs[criterion.id], usePercentage)}
      </TableCell>
      <TableCell align="center">{renderSwingSlider()}</TableCell>
    </TableRow>
  );
}
