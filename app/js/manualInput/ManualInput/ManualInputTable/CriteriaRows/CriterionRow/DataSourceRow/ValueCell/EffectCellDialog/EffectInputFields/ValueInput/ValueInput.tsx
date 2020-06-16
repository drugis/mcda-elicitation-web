import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {EffectCellContext} from '../../../EffectCellContext/EffectCellContext';

export default function ValueInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {value, setValue, setIsEditDisabled} = useContext(EffectCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [value]);

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValue(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(value);
    if (isNaN(parsedValue)) {
      setInputError('Please provide a numeric input');
      setIsEditDisabled(true);
    } else if (
      parsedValue < dataSource.unitOfMeasurement.lowerBound ||
      parsedValue > dataSource.unitOfMeasurement.upperBound
    ) {
      setInputError(
        `Input out of bounds (${dataSource.unitOfMeasurement.lowerBound}, ${dataSource.unitOfMeasurement.upperBound})`
      );
      setIsEditDisabled(true);
    } else {
      setInputError('');
      setIsEditDisabled(false);
    }
  }

  return (
    <>
      <Grid item xs={6}>
        Effect value
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={value}
          onChange={valueChanged}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
        />
      </Grid>
    </>
  );
}
