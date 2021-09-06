import {Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {ChangeEvent, useContext} from 'react';
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
        <Typography>Text</Typography>
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
