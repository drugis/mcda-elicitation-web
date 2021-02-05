import {Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';
import MeasurementSensitivityPlot from './MeasurementSensitivityPlot/MeasurementSensitivityPlot';
import MeasurementSensitivitySelectors from './MeasurementSensitivitySelectors/MeasurementSensitivitySelectors';

export default function MeasurementSensitivity(): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Measurements <InlineHelp helpId="sensitivity-measurements" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <MeasurementSensitivitySelectors />
      </Grid>
      <Grid item xs={12}>
        <MeasurementSensitivityPlot />
      </Grid>
    </Grid>
  );
}
