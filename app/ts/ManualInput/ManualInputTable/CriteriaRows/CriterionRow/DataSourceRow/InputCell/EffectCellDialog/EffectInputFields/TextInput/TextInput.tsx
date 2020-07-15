import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext} from 'react';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

export default function TextInput() {
  const {text, setText} = useContext(InputCellContext);

  function handleTextChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setText(event.target.value);
  }

  return (
    <>
      <Grid item xs={6}>
        Text
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="text-input"
          value={text}
          onChange={handleTextChanged}
          autoFocus
        />
      </Grid>
    </>
  );
}
