import {Grid, Paper, Typography} from '@material-ui/core';
import React, {CSSProperties, useContext} from 'react';
import {ErrorContext} from './ErrorContext';

export default function Error() {
  const {error} = useContext(ErrorContext);

  const errorStyle: CSSProperties = {
    backgroundColor: '#e66464',
    minHeight: '5em',
    alignItems: 'center',
    display: 'flex',
    padding: '1em 1em 1em 1em'
  };

  return (
    <Grid
      container
      item
      xs={12}
      id="error"
      component={Paper}
      style={errorStyle}
    >
      <Grid item xs={12}>
        <Typography variant="h6">Error</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>Unfortunately an error has occurred:</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <b>{error}</b>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography style={{marginTop: '1em'}}>
          Please contact the developers at 'info@drugis.org' with a description
          of your actions up to this point and the error message above.
        </Typography>
      </Grid>
    </Grid>
  );
}
