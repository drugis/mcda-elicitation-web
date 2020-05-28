import {Grid, TextField} from '@material-ui/core';
import React from 'react';
import IEvent from '../../../../../interface/IEvent';

export default function CriterionTitle({
  title,
  setTitle
}: {
  title: string;
  setTitle: (x: string) => void;
}) {
  function handleChange(event: IEvent) {
    setTitle(event.target.value);
  }

  return (
    <Grid item xs={12}>
      <TextField
        id="criterion-title"
        label="Title"
        variant="outlined"
        onChange={handleChange}
        value={title}
        fullWidth
        autoFocus
        error={!title}
        helperText={!title ? 'Please provide a title!' : ''}
      />
    </Grid>
  );
}
