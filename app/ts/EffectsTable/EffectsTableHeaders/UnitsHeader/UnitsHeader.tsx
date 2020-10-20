import {TableCell} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function UnitsHeader() {
  const {showUnitsOfMeasurement} = useContext(SettingsContext);
  if (showUnitsOfMeasurement) {
    return (
      <TableCell id="units-header" align="center">
        Units <InlineHelp helpId="unit-of-measurement" />
      </TableCell>
    );
  } else {
    return <></>;
  }
}
