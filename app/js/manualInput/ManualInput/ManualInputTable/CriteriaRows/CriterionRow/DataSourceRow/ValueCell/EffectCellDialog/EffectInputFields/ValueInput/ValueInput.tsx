import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';

export default function ValueInput({context}: {context: any}) {
  const {dataSource} = useContext(DataSourceRowContext);
  const {value, setValue, setIsValidValue} = useContext(context);
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
      setIsValidValue(false);
    } else if (
      parsedValue < dataSource.unitOfMeasurement.lowerBound ||
      parsedValue > dataSource.unitOfMeasurement.upperBound
    ) {
      setInputError(
        `Input out of bounds [${dataSource.unitOfMeasurement.lowerBound}, ${dataSource.unitOfMeasurement.upperBound}]`
      );
      setIsValidValue(false);
    } else {
      setInputError('');
      setIsValidValue(true);
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
          type="number"
          inputProps={{
            min: dataSource.unitOfMeasurement.lowerBound,
            max: dataSource.unitOfMeasurement.upperBound
          }}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
          autoFocus
        />
      </Grid>
    </>
  );
}
