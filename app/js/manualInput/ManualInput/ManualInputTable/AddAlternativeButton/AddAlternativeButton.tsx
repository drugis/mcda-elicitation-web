import {IconButton, Tooltip} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';
import {generateUuid} from '../../ManualInputService/ManualInputService';

export default function AddAlternativeButton() {
  const {addAlternative} = useContext(ManualInputContext);

  function handleClick() {
    addAlternative({id: generateUuid(), title: 'new alternative'});
  }

  return (
    <Tooltip title="Add an alternative">
      <IconButton onClick={handleClick}>
        <AddBox color="primary"></AddBox>
      </IconButton>
    </Tooltip>
  );
}
