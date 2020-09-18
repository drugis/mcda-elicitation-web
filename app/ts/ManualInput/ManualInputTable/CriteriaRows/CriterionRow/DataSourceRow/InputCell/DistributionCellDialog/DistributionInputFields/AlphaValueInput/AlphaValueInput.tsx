import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

export default function AlphaValueInput({
  getAlphaError
}: {
  getAlphaError: (alpha: number) => string;
}) {
  const {alpha, setAlpha, setIsValidAlpha} = useContext(InputCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [alpha]);

  function alphaChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setAlpha(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(alpha);
    const errorMessage = getAlphaError(parsedValue);
    setInputError(errorMessage);
    setIsValidAlpha(!errorMessage);
  }

  return (
    <>
      <Grid item xs={6}>
        Alpha
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="alpha-input"
          value={alpha}
          onChange={alphaChanged}
          type="number"
          inputProps={{
            min: 1
          }}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
          autoFocus
        />
      </Grid>
    </>
  );
}
