import {Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';
import CentralWeightsPlot from './CentralWeightsPlot/CentralWeightsPlot';
import CentralWeightsTable from './CentralWeightsTable/CentralWeightsTable';

export default function CentralWeights(): JSX.Element {
  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Central Weights <InlineHelp helpId="central-weights" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <CentralWeightsPlot />
      </Grid>
      <Grid container item xs={12} justify="flex-end">
        <ClipboardButton targetId="#central-weights-table" />
      </Grid>
      <Grid item xs={12}>
        <CentralWeightsTable />
      </Grid>
    </Grid>
  );
}
