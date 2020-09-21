import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {getNormalError} from '../../../../../../../../CellValidityService/CellValidityService';
import {DataSourceRowContext} from '../../../../../DataSourceRowContext/DataSourceRowContext';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';

export default function NormalInput() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    mean,
    setMean,
    setIsValidMean,
    standardError,
    setStandardError,
    setIsValidStandardError
  } = useContext(InputCellContext);
  const [meanInputError, setMeanInputError] = useState<string>('');
  const [standardErrorInputError, setStandardErrorInputError] = useState<
    string
  >('');

  useEffect(() => {
    validateInput(mean, setIsValidMean, setMeanInputError);
    validateStandardError();
  }, [mean, standardError]);

  function validateStandardError() {
    validateInput(
      standardError,
      setIsValidStandardError,
      setStandardErrorInputError
    );
    const parsedValue = Number.parseFloat(standardError);
    if (parsedValue <= 0) {
      setIsValidStandardError(false);
      setStandardErrorInputError('Standard error must be above 0');
    }
  }

  function meanChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setMean(event.target.value);
  }

  function standardErrorChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setStandardError(event.target.value);
  }

  function validateInput(
    value: string,
    setIsValid: (validity: boolean) => void,
    setValueInputError: (error: string) => void
  ) {
    const parsedValue = Number.parseFloat(value);
    const errorMessage = getNormalError(
      parsedValue,
      dataSource.unitOfMeasurement
    );
    setValueInputError(errorMessage);
    setIsValid(!errorMessage);
  }

  return (
    <>
      <Grid item xs={6}>
        Mean
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="mean-input"
          value={mean}
          onChange={meanChanged}
          type="number"
          error={!!meanInputError}
          helperText={meanInputError ? meanInputError : ''}
          autoFocus
        />
      </Grid>
      <Grid item xs={6}>
        Standard error
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="standard-error-input"
          value={standardError}
          onChange={standardErrorChanged}
          type="number"
          inputProps={{
            min: dataSource.unitOfMeasurement.lowerBound,
            max: dataSource.unitOfMeasurement.upperBound
          }}
          error={!!standardErrorInputError}
          helperText={standardErrorInputError ? standardErrorInputError : ''}
          autoFocus
        />
      </Grid>
    </>
  );
}
