import {CircularProgress, Grid, Typography} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';
import ScalesTable from './ScalesTable/ScalesTable';

export default function ScaleRanges({
  problem,
  scales
}: {
  problem: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
}) {
  return scales && problem ? (
    <Grid container>
      <Grid item xs={9} id="effects-table-header">
        <Typography variant={'h5'}>
          Scale ranges <InlineHelp helpId="scale-ranges" />
        </Typography>
      </Grid>
      <Grid item container xs={3} justify="flex-end">
        <ClipboardButton targetId="#scales-table" />
      </Grid>
      <Grid item xs={12}>
        <ScalesTable oldWorkspace={problem} scales={scales} />
      </Grid>
    </Grid>
  ) : (
    <CircularProgress />
  );
}
