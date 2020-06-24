import {Grid, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';
import {getLowerBoundError} from '../../../../../../../../CellValidityService/CellValidityService';

export default function LowerBoundInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    value,
    upperBound,
    lowerBound,
    setLowerBound,
    setIsValidLowerBound,
    inputType
  } = useContext(InputCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [value, lowerBound, upperBound]);

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setLowerBound(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(lowerBound);
    const highestPossibleValue =
      inputType === 'valueCI'
        ? Number.parseFloat(value)
        : Number.parseFloat(upperBound);

    const errorMessage = getLowerBoundError(
      parsedValue,
      highestPossibleValue,
      dataSource.unitOfMeasurement
    );
    setInputError(errorMessage);
    setIsValidLowerBound(!errorMessage);
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
          type="number"
          inputProps={{
            min: dataSource.unitOfMeasurement.lowerBound,
            max:
              inputType === 'valueCI'
                ? value
                : dataSource.unitOfMeasurement.upperBound
          }}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
        />
      </Grid>
    </>
  );
}
