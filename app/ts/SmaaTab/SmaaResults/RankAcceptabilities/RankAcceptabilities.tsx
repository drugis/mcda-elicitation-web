import React from 'react';
import _ from 'lodash';
import {Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import RankAcceptabilitiesTable from './RankAcceptabilitiesTable/RankAcceptabilitiesTable';

export default function RankAcceptabilities(): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Rank acceptabilities <InlineHelp helpId="rank-acceptabilities" />
        </Typography>
      </Grid>
      <Grid item xs={6}></Grid>
      <Grid item xs={6}>
        <RankAcceptabilitiesTable />
      </Grid>
    </Grid>
  );
}
