import {Grid, Typography} from '@material-ui/core';
import {InlineHelp} from 'help-popup';
import React from 'react';
import MeasurementSensitivityPlot from './MeasurementSensitivityPlot/MeasurementSensitivityPlot';
import MeasurementSensitivitySelectors from './MeasurementSensitivitySelectors/MeasurementSensitivitySelectors';

export default function MeasurementSensitivity(): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="sensitivity-measurements">
            Measurements
          </InlineHelp>
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
