import TableCell from '@material-ui/core/TableCell';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';

export default function UnitsHeader() {
  const {
    toggledColumns: {units}
  } = useContext(SettingsContext);

  if (units) {
    return (
      <TableCell id="units-header" align="center">
        <InlineHelp helpId="unit-of-measurement">Units</InlineHelp>
      </TableCell>
    );
  } else {
    return <></>;
  }
}
