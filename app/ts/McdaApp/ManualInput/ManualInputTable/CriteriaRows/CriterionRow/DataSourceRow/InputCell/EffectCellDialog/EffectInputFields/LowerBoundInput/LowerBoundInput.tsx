import {Typography} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {getLowerBoundError} from '../../../../../../../../CellValidityService/CellValidityService';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

export default function LowerBoundInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    value,
    upperBound,
    lowerBound,
    setLowerBound,
    setIsValidLowerBound,
    setIsNotEstimableLowerBound,
    isNotEstimableLowerBound,
    inputType
  } = useContext(InputCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [
    value,
    lowerBound,
    upperBound,
    isNotEstimableLowerBound
  ]);

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setLowerBound(event.target.value);
  }

  function validateInput() {
    if (isNotEstimableLowerBound) {
      setInputError('');
      setIsValidLowerBound(true);
    } else {
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
  }

  function handleIsNotEstimableChanged() {
    setIsNotEstimableLowerBound(!isNotEstimableLowerBound);
  }

  return (
    <>
      <Grid item xs={6}>
        <Typography>
          Lower bound (
          <FormControlLabel
            style={{marginLeft: '0px'}}
            value="isNotEstimable"
            control={
              <Checkbox
                id="not-estimable-checkbox"
                checked={isNotEstimableLowerBound}
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
          id="lower-bound-input"
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
          disabled={isNotEstimableLowerBound}
        />
      </Grid>
    </>
  );
}
