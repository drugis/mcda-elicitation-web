import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, {useContext, useEffect, useState} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import PreferencesWeightsButtons from './PreferencesWeightsButtons/PreferencesWeightsButtons';
import PreferencesWeightsTable from './PreferencesWeightsTable/PreferencesWeightsTable';

export default function PreferencesWeights() {
  const {determineElicitationMethod, pvfs, areAllPvfsSet} = useContext(
    PreferencesContext
  );
  const [displayPvfWarning, setDisplayPvfWarning] = useState(
    !areAllPvfsSet(pvfs)
  );

  useEffect(checkForPvfs, [pvfs]);

  function checkForPvfs(): void {
    setDisplayPvfWarning(!areAllPvfsSet(pvfs));
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h4">Weights</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography id="elicitation-method">
          Elicitation method: {determineElicitationMethod()}
        </Typography>
      </Grid>
      {displayPvfWarning ? (
        <Grid item xs={12}>
          <Typography id="not-all-pvfs-set-warning">
            Not all partial value functions are defined
          </Typography>
        </Grid>
      ) : (
        <span></span>
      )}
      <Grid item xs={12}>
        <PreferencesWeightsTable />
      </Grid>
      <Grid item xs={12}>
        <PreferencesWeightsButtons />
      </Grid>
    </Grid>
  );
}
