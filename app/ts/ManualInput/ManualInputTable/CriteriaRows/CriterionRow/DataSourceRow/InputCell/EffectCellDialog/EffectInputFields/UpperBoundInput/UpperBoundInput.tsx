import {Grid, TextField, FormControlLabel, Checkbox} from '@material-ui/core';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';
import {getUpperBoundError} from '../../../../../../../../CellValidityService/CellValidityService';

export default function UpperBoundInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    value,
    upperBound,
    lowerBound,
    isNotEstimableUpperBound,
    setIsNotEstimableUpperBound,
    setUpperBound,
    setIsValidUpperBound,
    inputType
  } = useContext(InputCellContext);
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

    const errorMessage = getUpperBoundError(
      parsedValue,
      lowestPossibleValue,
      dataSource.unitOfMeasurement
    );
    setInputError(errorMessage);
    setIsValidUpperBound(!errorMessage);
  }

  function handleIsNotEstimableChanged() {
    setIsNotEstimableUpperBound(!isNotEstimableUpperBound);
  }
  return (
    <>
      <Grid item xs={6}>
        Upper bound (
        <FormControlLabel
          style={{marginLeft: '0px'}}
          value="isNotEstimable"
          control={
            <Checkbox
              id="not-estimable-checkbox"
              checked={isNotEstimableUpperBound}
              onChange={handleIsNotEstimableChanged}
              color="primary"
            />
          }
          label="not estimable"
          labelPlacement="start"
        />
        )
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
          disabled={isNotEstimableUpperBound}
        />
      </Grid>
    </>
  );
}