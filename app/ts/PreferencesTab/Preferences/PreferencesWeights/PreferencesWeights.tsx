import React from 'react';
import Grid from '@material-ui/core/Grid';
import PreferencesWeightsTable from './PreferencesWeightsTable/PreferencesWeightsTable';
import PreferencesWeightsButtons from './PreferencesWeightsButtons/PreferencesWeightsButtons';

export default function PreferencesWeights() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <h4>Weights</h4>
      </Grid>
      <Grid item xs={12}>
        <PreferencesWeightsTable />
      </Grid>
      <Grid item xs={12}>
        <PreferencesWeightsButtons />
      </Grid>
    </Grid>
  );
}
