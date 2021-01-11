import {Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';
import CentralWeightsTable from './CentralWeightsTable/CentralWeightsTable';

export default function CentralWeights(): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Central Weights <InlineHelp helpId="central-weights" />
        </Typography>
      </Grid>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <CentralWeightsTable />
      </Grid>
    </Grid>
  );
}
