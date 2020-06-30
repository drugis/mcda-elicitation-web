import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

export default function BetaValueInput({
  getBetaError
}: {
  getBetaError: (beta: number) => string;
}) {
  const {beta, setBeta, setIsValidBeta} = useContext(InputCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [beta]);

  function betaChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setBeta(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(beta);
    const errorMessage = getBetaError(parsedValue);
    setInputError(errorMessage);
    setIsValidBeta(!errorMessage);
  }

  return (
    <>
      <Grid item xs={6}>
        Beta
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={beta}
          onChange={betaChanged}
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
