import {Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';
import RankAcceptabilitiesPlot from './RankAcceptabilitiesPlot/RankAcceptabilitiesPlot';
import RankAcceptabilitiesTable from './RankAcceptabilitiesTable/RankAcceptabilitiesTable';

export default function RankAcceptabilities(): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Rank acceptabilities <InlineHelp helpId="rank-acceptabilities" />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <RankAcceptabilitiesPlot />
      </Grid>
      <Grid container item xs={6}>
        <Grid container item xs={12} justify="flex-end">
          <ClipboardButton targetId="#rank-acceptabilities-table" />
        </Grid>
        <Grid item xs={12}>
          <RankAcceptabilitiesTable />
        </Grid>
      </Grid>
    </Grid>
  );
}
