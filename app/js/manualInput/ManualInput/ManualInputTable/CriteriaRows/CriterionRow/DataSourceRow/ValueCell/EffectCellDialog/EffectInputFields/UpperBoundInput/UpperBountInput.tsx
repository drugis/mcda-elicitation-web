import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';

export default function UpperBoundInput({context}: {context: any}) {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    value,
    upperBound,
    lowerBound,
    setUpperBound,
    setIsValidUpperBound,
    inputType
  } = useContext(context);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [value, lowerBound, upperBound]);

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setUpperBound(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(upperBound);
    const lowestPossibleValue =
      inputType === 'valueCI'
        ? Number.parseFloat(value)
        : Number.parseFloat(lowerBound);

    if (isNaN(parsedValue)) {
      setInputError('Please provide a numeric input');
      setIsValidUpperBound(false);
    } else if (
      parsedValue < lowestPossibleValue ||
      parsedValue > dataSource.unitOfMeasurement.upperBound
    ) {
      setInputError(
        `Input out of bounds [${lowestPossibleValue}, ${dataSource.unitOfMeasurement.upperBound}]`
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
          type="number"
          inputProps={{
            min:
              inputType === 'valueCI'
                ? value
                : dataSource.unitOfMeasurement.lowerBound,
            max: dataSource.unitOfMeasurement.upperBound
          }}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
        />
      </Grid>
    </>
  );
}
