import {CircularProgress, Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import PlotButtons from 'app/ts/PlotButtons/PlotButtons';
import {InlineHelp} from 'help-popup';
import React from 'react';
import RankAcceptabilitiesPlot from './RankAcceptabilitiesPlot/RankAcceptabilitiesPlot';
import RankAcceptabilitiesTable from './RankAcceptabilitiesTable/RankAcceptabilitiesTable';

export default function RankAcceptabilities({
  ranks
}: {
  ranks: Record<string, number[]>;
}): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="rank-acceptabilities">
            Rank acceptabilities
          </InlineHelp>
        </Typography>
      </Grid>
      {ranks ? (
        <>
          <Grid container item xs={12} md={6}>
            <PlotButtons plotId="rank-acceptabilities-plot">
              <RankAcceptabilitiesPlot ranks={ranks} />
            </PlotButtons>
          </Grid>
          <Grid container item xs={12} md={6}>
            <Grid container item xs={12} justify="flex-end">
              <ClipboardButton targetId="#rank-acceptabilities-table" />
            </Grid>
            <Grid item xs={12}>
              <RankAcceptabilitiesTable ranks={ranks} />
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
