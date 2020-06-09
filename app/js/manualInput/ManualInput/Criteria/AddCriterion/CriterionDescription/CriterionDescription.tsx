import {Grid, TextField} from '@material-ui/core';
import React from 'react';
import IEvent from '../../../../../interface/IEvent';

export default function CriterionDescription({
  description,
  setDescription
}: {
  description: string;
  setDescription: (x: string) => void;
}) {
  function handleChange(event: IEvent) {
    setDescription(event.target.value);
  }

  return (
    <Grid item xs={12}>
      <TextField
        id="criterion-description"
        label="Description (optional)"
        value={description}
        variant="outlined"
        onChange={handleChange}
        fullWidth
        multiline
        rows={5}
      />
    </Grid>
  );
}
