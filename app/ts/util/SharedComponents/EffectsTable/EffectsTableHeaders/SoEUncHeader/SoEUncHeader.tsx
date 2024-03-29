import TableCell from '@material-ui/core/TableCell';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {InlineHelp} from 'help-popup';
import {useContext} from 'react';

export default function SoEUncHeader() {
  const {
    toggledColumns: {strength}
  } = useContext(SettingsContext);

  if (strength) {
    return (
      <TableCell id="soe-unc-header" align="center">
        <InlineHelp helpId="strength-of-evidence">
          Strength of evidence
        </InlineHelp>{' '}
        and <InlineHelp helpId="uncertainties">Uncertainties</InlineHelp>
      </TableCell>
    );
  } else {
    return <></>;
  }
}
