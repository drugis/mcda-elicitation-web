import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect} from 'react';
import {EffectCellContext} from '../../../EffectCellContext/EffectCellContext';

export default function TextInput() {
  const {value, setValue, setIsEditDisabled} = useContext(EffectCellContext);

  useEffect(validateInput, [value]);

  function validateInput() {
    setIsEditDisabled(false);
  }

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
