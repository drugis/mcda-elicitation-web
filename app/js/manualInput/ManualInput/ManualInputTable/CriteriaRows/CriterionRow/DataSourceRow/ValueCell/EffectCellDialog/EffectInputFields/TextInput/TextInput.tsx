import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext} from 'react';

export default function TextInput({context}: {context: any}) {
  const {text, setText} = useContext(context);

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
        <TextField value={text} onChange={handleTextChanged} autoFocus />
      </Grid>
    </>
  );
}
