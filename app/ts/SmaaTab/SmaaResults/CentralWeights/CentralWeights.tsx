import {CircularProgress, Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';
import {SmaaResultsContext} from '../../SmaaResultsContext/SmaaResultsContext';
import CentralWeightsPlot from './CentralWeightsPlot/CentralWeightsPlot';
import CentralWeightsTable from './CentralWeightsTable/CentralWeightsTable';

export default function CentralWeights(): JSX.Element {
  const {centralWeights} = useContext(SmaaResultsContext);

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
            <CentralWeightsPlot />
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid container item xs={12} justify="flex-end">
              <ClipboardButton targetId="#central-weights-table" />
            </Grid>
            <Grid item xs={12}>
              <CentralWeightsTable />
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
