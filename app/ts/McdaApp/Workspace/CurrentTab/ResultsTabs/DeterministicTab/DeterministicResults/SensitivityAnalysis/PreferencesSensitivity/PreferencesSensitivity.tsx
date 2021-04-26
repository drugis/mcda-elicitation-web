import {Grid, Typography} from '@material-ui/core';
import PlotWithButtons from 'app/ts/PlotWithButtons/PlotWithButtons';
import {InlineHelp} from 'help-popup';
import React from 'react';
import PreferencesSensitivitySelector from './PreferencesSensitivitySelector/PreferencesSensitivitySelector';
import PreferencesSensitivityPlot from './PreferencesSensitivtyPlot/PreferencesSensitivityPlot';

export default function PreferencesSensitivity(): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="sensitivity-preferences">Preferences</InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={12} style={{minHeight: '64px'}}>
        <PreferencesSensitivitySelector />
      </Grid>
      <Grid item xs={12}>
        <PlotWithButtons plotId="preferences-sensitivity-plot">
          <PreferencesSensitivityPlot />
        </PlotWithButtons>
      </Grid>
    </Grid>
  );
}
