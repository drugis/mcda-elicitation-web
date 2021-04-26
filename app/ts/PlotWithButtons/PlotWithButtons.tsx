import {Grid} from '@material-ui/core';
import React from 'react';
import ExportButton from './ExportButton/ExportButton';
import LegendButton from './Legend/LegendButton/LegendButton';

export default function PlotWithButtons({
  children,
  plotId
}: {
  children: any;
  plotId: string;
}): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={12} md={7}>
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
        <Grid item xs={6} md={12}>
          <ExportButton plotId={plotId} />
        </Grid>
        <Grid item xs={6} md={12}>
          <LegendButton buttonId={`${plotId}-legend`} />
        </Grid>
      </Grid>
    </Grid>
  );
}
