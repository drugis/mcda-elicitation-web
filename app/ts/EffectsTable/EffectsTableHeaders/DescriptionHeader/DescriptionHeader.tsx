import TableCell from '@material-ui/core/TableCell';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext} from 'react';

export default function DescriptionHeader() {
  const {
    toggledColumns: {description}
  } = useContext(SettingsContext);

  if (description) {
    return (
      <TableCell id="description-header" align="center">
        Description
      </TableCell>
    );
  } else {
    return <></>;
  }
}
