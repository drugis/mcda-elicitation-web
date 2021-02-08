import {CircularProgress, Grid, Typography} from '@material-ui/core';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import LegendWrapper from 'app/ts/Legend/LegendWrapper/LegendWrapper';
import React, {useContext} from 'react';
import {SmaaResultsContext} from '../../SmaaResultsContext/SmaaResultsContext';
import RankAcceptabilitiesPlot from './RankAcceptabilitiesPlot/RankAcceptabilitiesPlot';
import RankAcceptabilitiesTable from './RankAcceptabilitiesTable/RankAcceptabilitiesTable';

export default function RankAcceptabilities(): JSX.Element {
  const {ranks} = useContext(SmaaResultsContext);
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Rank acceptabilities <InlineHelp helpId="rank-acceptabilities" />
        </Typography>
      </Grid>
      {ranks ? (
        <>
          <Grid container item xs={12} md={6}>
            <LegendWrapper buttonId={'rank-acceptabilities-plot-legend'}>
              <RankAcceptabilitiesPlot />
            </LegendWrapper>
          </Grid>
          <Grid container item xs={12} md={6}>
            <Grid container item xs={12} justify="flex-end">
              <ClipboardButton targetId="#rank-acceptabilities-table" />
            </Grid>
            <Grid item xs={12}>
              <RankAcceptabilitiesTable />
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
