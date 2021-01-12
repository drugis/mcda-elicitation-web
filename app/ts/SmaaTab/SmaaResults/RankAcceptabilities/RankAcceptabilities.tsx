import {Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import LegendWrapper from 'app/ts/Legend/LegendWrapper/LegendWrapper';
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
      <Grid container item xs={6}>
        <LegendWrapper>
          <RankAcceptabilitiesPlot />
        </LegendWrapper>
      </Grid>
      <Grid item xs={6}>
        <RankAcceptabilitiesTable />
      </Grid>
    </Grid>
  );
}
