import {Grid, TextField, Typography} from '@material-ui/core';
import {getSampleSizeError} from 'app/ts/McdaApp/ManualInput/CellValidityService/CellValidityService';
import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {InputCellContext} from '../../../../InputCellContext/InputCellContext';

export default function SampleSizeInput(): JSX.Element {
  const {sampleSize, events, setSampleSize, setIsValidSampleSize} =
    useContext(InputCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [sampleSize, events]);

  function SampleSizeChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSampleSize(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(sampleSize);
    const parsedEvents = Number.parseFloat(events);
    const errorMessage = getSampleSizeError(parsedValue, parsedEvents);
    setInputError(errorMessage);
    setIsValidSampleSize(!errorMessage);
  }

  return (
    <>
      <Grid item xs={6}>
        <Typography>Sample size</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="sample-size-input"
          value={sampleSize}
          onChange={SampleSizeChanged}
          type="number"
          inputProps={{
            min: 1
          }}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
          autoFocus
        />
      </Grid>
    </>
  );
}
