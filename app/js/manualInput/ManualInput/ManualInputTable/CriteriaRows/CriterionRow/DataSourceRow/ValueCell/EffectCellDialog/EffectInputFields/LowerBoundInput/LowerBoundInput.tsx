import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {EffectCellContext} from '../../../EffectCellContext/EffectCellContext';

export default function LowerBoundInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    value,
    upperBound,
    lowerBound,
    setLowerBound,
    setIsValidLowerBound,
    inputType
  } = useContext(EffectCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [value, lowerBound]);

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setLowerBound(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(lowerBound);
    if (isNaN(parsedValue)) {
      setInputError('Please provide a numeric input');
      setIsValidLowerBound(false);
    } else if (
      inputType === 'valueCI' &&
      (parsedValue > Number.parseFloat(value) ||
        parsedValue < dataSource.unitOfMeasurement.lowerBound)
    ) {
      setInputError(
        `Input out of bounds (${dataSource.unitOfMeasurement.lowerBound}, ${value})`
      );
      setIsValidLowerBound(false);
    } else if (
      inputType === 'range' &&
      (parsedValue > Number.parseFloat(upperBound) ||
        parsedValue < dataSource.unitOfMeasurement.lowerBound)
    ) {
      setInputError(
        `Input out of bounds (${dataSource.unitOfMeasurement.lowerBound}, ${upperBound})`
      );
      setIsValidLowerBound(false);
    } else {
      setInputError('');
      setIsValidLowerBound(true);
    }
  }

  return (
    <>
      <Grid item xs={6}>
        Lower bound
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={lowerBound}
          onChange={valueChanged}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
        />
      </Grid>
    </>
  );
}
