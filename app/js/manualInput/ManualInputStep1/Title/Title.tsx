import {Grid, TextField} from '@material-ui/core';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function Title() {
  const {title, setTitle} = useContext(ManualInputContext);

  function handleTitleChange(event: {target: {value: string}}) {
    setTitle(event.target.value);
  }

  return (
    <Grid item sm={12}>
      <TextField
        id="workspace-title"
        label="Title"
        variant="outlined"
        onChange={handleTitleChange}
        value={title}
        fullWidth
      />
    </Grid>
  );
}
