import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';
import {Grid, TextField} from '@material-ui/core';

export default function TherapeuticContext() {
  const {therapeuticContext, setTherapeuticContext} = useContext(
    ManualInputContext
  );

  function handleContextChange(event: {target: {value: string}}) {
    setTherapeuticContext(event.target.value);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={6}>
        <TextField
          id="therapeutic-context"
          label="Therapeutic Context"
          value={therapeuticContext}
          variant="outlined"
          onChange={handleContextChange}
          fullWidth
          multiline
          rows={5}
        />
      </Grid>
    </Grid>
  );
}
