import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext} from 'react';
import {EffectCellContext} from '../../../EffectCellContext/EffectCellContext';

export default function TextInput() {
  const {value, setValue} = useContext(EffectCellContext);

  function handleTextChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValue(event.target.value);
  }

  return (
    <>
      <Grid item xs={6}>
        Text
      </Grid>
      <Grid item xs={6}>
        <TextField value={value} onChange={handleTextChanged} />
      </Grid>
    </>
  );
}
