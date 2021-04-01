import {CircularProgress, Grid, Typography} from '@material-ui/core';
import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import {InlineHelp} from 'help-popup';
import React from 'react';
import CentralWeightsPlot from './CentralWeightsPlot/CentralWeightsPlot';
import CentralWeightsTable from './CentralWeightsTable/CentralWeightsTable';

export default function CentralWeights({
  centralWeights
}: {
  centralWeights: Record<string, ICentralWeight>;
}): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="central-weights">Central Weights</InlineHelp>
        </Typography>
      </Grid>
      {centralWeights ? (
        <>
          <Grid item xs={12}>
            <CentralWeightsPlot centralWeights={centralWeights} />
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid container item xs={12} justify="flex-end">
              <ClipboardButton targetId="#central-weights-table" />
            </Grid>
            <Grid item xs={12}>
              <CentralWeightsTable centralWeights={centralWeights} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
}
