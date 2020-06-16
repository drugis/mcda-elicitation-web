import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {EffectCellContext} from '../../../EffectCellContext/EffectCellContext';

export default function UpperBoundInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    value,
    upperBound,
    lowerBound,
    setUpperBound,
    setIsValidUpperBound,
    inputType
  } = useContext(EffectCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [value, upperBound]);

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setUpperBound(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(upperBound);
    if (isNaN(parsedValue)) {
      setInputError('Please provide a numeric input');
      setIsValidUpperBound(false);
    } else if (
      inputType === 'valueCI' &&
      (parsedValue < Number.parseFloat(value) ||
        parsedValue > dataSource.unitOfMeasurement.upperBound)
    ) {
      setInputError(
        `Input out of bounds [${value}, ${dataSource.unitOfMeasurement.upperBound}]`
      );
      setIsValidUpperBound(false);
    } else if (
      inputType === 'range' &&
      (parsedValue < Number.parseFloat(lowerBound) ||
        parsedValue > dataSource.unitOfMeasurement.upperBound)
    ) {
      setInputError(
        `Input out of bounds [${lowerBound}, ${dataSource.unitOfMeasurement.upperBound}]`
      );
      setIsValidUpperBound(false);
    } else {
      setInputError('');
      setIsValidUpperBound(true);
    }
  }

  return (
    <>
      <Grid item xs={6}>
        Upper bound
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={upperBound}
          onChange={valueChanged}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
        />
      </Grid>
    </>
  );
}
