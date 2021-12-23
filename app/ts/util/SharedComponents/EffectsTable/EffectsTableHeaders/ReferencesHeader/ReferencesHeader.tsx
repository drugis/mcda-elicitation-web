import TableCell from '@material-ui/core/TableCell';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {InlineHelp} from 'help-popup';
import {useContext} from 'react';

export default function ReferencesHeader() {
  const {
    toggledColumns: {references}
  } = useContext(SettingsContext);

  if (references) {
    return (
      <TableCell id="references-header" align="center">
        <InlineHelp helpId="reference">Reference</InlineHelp>
      </TableCell>
    );
  } else {
    return <></>;
  }
}
