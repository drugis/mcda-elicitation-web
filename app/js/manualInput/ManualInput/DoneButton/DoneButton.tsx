import {Button} from '@material-ui/core';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function DoneButton() {
  const {isDoneDisabled} = useContext(ManualInputContext);
  function handleDoneClick() {}

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={handleDoneClick}
      disabled={isDoneDisabled}
    >
      Done
    </Button>
  );
}
