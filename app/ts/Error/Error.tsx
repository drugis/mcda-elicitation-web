import {Grid, IconButton, Paper, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, {CSSProperties, useContext} from 'react';
import {ErrorContext} from './ErrorContext';

const errorStyle: CSSProperties = {
  backgroundColor: '#e66464',
  minHeight: '5em',
  alignItems: 'center',
  display: 'flex',
  padding: '1em 1em 1em 1em',
  marginTop: '1em'
};

export default function Error() {
  const {error, setErrorMessage} = useContext(ErrorContext);

  function onClose() {
    setErrorMessage('');
  }

  return (
    <Grid
      container
      item
      xs={12}
      id="error"
      component={Paper}
      style={errorStyle}
    >
      <Grid item xs={11}>
        <Typography variant="h6">Error</Typography>
      </Grid>
      <Grid container item xs={1} justify="flex-end">
        <IconButton
          id="close-modal-button"
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
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
