import TableCell from '@material-ui/core/TableCell';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function ReferencesHeader() {
  const {
    toggledColumns: {references}
  } = useContext(SettingsContext);

  if (references) {
    return (
      <TableCell id="references-header" align="center">
        Reference <InlineHelp helpId="reference" />
      </TableCell>
    );
  } else {
    return <></>;
  }
}
