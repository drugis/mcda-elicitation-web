import {Grid} from '@material-ui/core';
import React, {KeyboardEvent, useContext} from 'react';
import {DistributionCellContext} from '../../DistributionCellContext/DistributionCellContext';

export default function DistributionInputFields({
  editButtonCallback,
  isInputInvalid
}: {
  editButtonCallback: () => void;
  isInputInvalid: () => boolean;
}) {
  const {inputType} = useContext(DistributionCellContext);

  function createInputFields(): JSX.Element {
    switch (inputType) {
      case 'value':
        return <></>;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.keyCode === 13 && !isInputInvalid()) {
      editButtonCallback();
    }
  }

  return (
    <Grid item container xs={12} onKeyDown={handleKeyDown}>
      {createInputFields()}
    </Grid>
  );
}
