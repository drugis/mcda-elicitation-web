import {Grid, TextField, Typography} from '@material-ui/core';
import {getEventsError} from 'app/ts/McdaApp/ManualInput/CellValidityService/CellValidityService';
import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {InputCellContext} from '../../../../InputCellContext/InputCellContext';

export default function EventsInput(): JSX.Element {
  const {events, sampleSize, setEvents, setIsValidEvents} =
    useContext(InputCellContext);
  const [inputError, setInputError] = useState<string>('');

  useEffect(validateInput, [events, sampleSize]);

  function EventsChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setEvents(event.target.value);
  }

  function validateInput() {
    const parsedValue = Number.parseFloat(events);
    const parsedSampleSize = Number.parseFloat(sampleSize);
    const errorMessage = getEventsError(parsedValue, parsedSampleSize);
    setInputError(errorMessage);
    setIsValidEvents(!errorMessage);
  }

  return (
    <>
      <Grid item xs={6}>
        <Typography>Events</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="events-input"
          value={events}
          onChange={EventsChanged}
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
