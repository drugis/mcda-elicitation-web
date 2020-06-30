import {Grid} from '@material-ui/core';
import React, {KeyboardEvent, useContext} from 'react';
import {InputCellContext} from '../../InputCellContext/InputCellContext';
import RangeInput from './RangeInput/RangeInput';
import TextInput from './TextInput/TextInput';
import ValueCIInput from './ValueCIInput/ValueCIInput';
import ValueInput from './ValueInput/ValueInput';

export default function EffectInputFields({
  editButtonCallback,
  isInputInvalid
}: {
  editButtonCallback: () => void;
  isInputInvalid: () => boolean;
}) {
  const {inputType} = useContext(InputCellContext);

  function createInputFields(): JSX.Element {
    switch (inputType) {
      case 'value':
        return <ValueInput />;
      case 'valueCI':
        return <ValueCIInput />;
      case 'range':
        return <RangeInput />;
      case 'text':
        return <TextInput />;
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
