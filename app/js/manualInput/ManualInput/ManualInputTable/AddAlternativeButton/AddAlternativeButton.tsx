import {IconButton, Tooltip} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';

export default function AddAlternativeButton() {
  const {addAlternative} = useContext(ManualInputContext);

  return (
    <Tooltip title="Add an alternative">
      <IconButton onClick={addAlternative}>
        <AddBox color="primary"></AddBox>
      </IconButton>
    </Tooltip>
  );
}
