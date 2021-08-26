import {Typography} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {getUpperBoundError} from '../../../../../../../../CellValidityService/CellValidityService';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

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
        <Typography>
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
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="upper-bound-input"
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
