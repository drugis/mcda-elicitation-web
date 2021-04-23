import {Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {getValueError} from '../../../../../../../../CellValidityService/CellValidityService';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

export default function ValueInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {value, setValue, setIsValidValue} = useContext(InputCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [value]);

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValue(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(value);
    const errorMessage = getValueError(
      parsedValue,
      dataSource.unitOfMeasurement
    );
    setInputError(errorMessage);
    setIsValidValue(!errorMessage);
  }

  return (
    <>
      <Grid item xs={6}>
        <Typography>Effect value</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="value-input"
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
