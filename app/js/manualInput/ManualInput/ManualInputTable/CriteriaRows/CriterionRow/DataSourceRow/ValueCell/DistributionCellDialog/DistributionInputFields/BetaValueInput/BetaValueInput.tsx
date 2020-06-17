import React, {useContext, ChangeEvent, useState, useEffect} from 'react';
import {Grid, TextField} from '@material-ui/core';
import {DistributionCellContext} from '../../../DistributionCellContext/DistributionCellContext';

export default function BetaValueInput({
  isBetaInvalid,
  invalidBetaError
}: {
  isBetaInvalid: (beta: number) => boolean;
  invalidBetaError: string;
}) {
  const {beta, setBeta, setIsValidBeta} = useContext(DistributionCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [beta]);

  function betaChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setBeta(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(beta);
    if (isNaN(parsedValue)) {
      setInputError('Please provide a numeric input');
      setIsValidBeta(false);
    } else if (isBetaInvalid(parsedValue)) {
      setInputError(invalidBetaError);
      setIsValidBeta(false);
    } else {
      setInputError('');
      setIsValidBeta(true);
    }
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
