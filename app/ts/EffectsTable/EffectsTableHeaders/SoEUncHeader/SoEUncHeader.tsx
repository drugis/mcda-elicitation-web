import TableCell from '@material-ui/core/TableCell';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function SoEUncHeader() {
  const {showStrengthsAndUncertainties} = useContext(SettingsContext);
  if (showStrengthsAndUncertainties) {
    return (
      <TableCell id="soe-unc-header" align="center">
        Strength of evidence <InlineHelp helpId="strength-of-evidence" /> and
        Uncertainties <InlineHelp helpId="uncertainties" />
      </TableCell>
    );
  } else {
    return <></>;
  }
}
