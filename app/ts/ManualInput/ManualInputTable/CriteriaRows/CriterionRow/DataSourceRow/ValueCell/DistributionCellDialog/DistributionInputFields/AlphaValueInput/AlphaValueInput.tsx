import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

export default function AlphaValueInput({
  isAlphaInvalid,
  invalidAlphaError
}: {
  isAlphaInvalid: (alpha: number) => boolean;
  invalidAlphaError: string;
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
    if (isNaN(parsedValue)) {
      setInputError('Please provide a numeric input');
      setIsValidAlpha(false);
    } else if (isAlphaInvalid(parsedValue)) {
      setInputError(invalidAlphaError);
      setIsValidAlpha(false);
    } else {
      setInputError('');
      setIsValidAlpha(true);
    }
  }

  return (
    <>
      <Grid item xs={6}>
        Alpha
      </Grid>
      <Grid item xs={6}>
        <TextField
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
