import TableCell from '@material-ui/core/TableCell';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function DescriptionHeader() {
  const {showDescriptions} = useContext(SettingsContext);

  if (showDescriptions) {
    return (
      <TableCell id="description-header" align="center">
        Description
      </TableCell>
    );
  } else {
    return <></>;
  }
}
