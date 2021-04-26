import {Grid} from '@material-ui/core';
import React from 'react';
import ExportButton from './ExportButton/ExportButton';
import LegendButton from './Legend/LegendButton/LegendButton';

export default function PlotButtons({
  children,
  plotId
}: {
  children: any;
  plotId: string;
}): JSX.Element {
  return (
    <Grid container spacing={1}>
      <Grid item xs="auto">
        {children}
      </Grid>
      <Grid
        container
        item
        xs={12}
        md={5}
        alignContent="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        <Grid item xs={12} style={{marginTop: '1em'}}>
          <ExportButton plotId={plotId} />
        </Grid>
        <Grid item xs={12}>
          <LegendButton buttonId={`${plotId}-legend`} />
        </Grid>
      </Grid>
    </Grid>
  );
}
