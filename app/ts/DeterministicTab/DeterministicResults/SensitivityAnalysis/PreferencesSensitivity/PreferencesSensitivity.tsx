import {Grid, Typography} from '@material-ui/core';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React from 'react';
import PreferencesSensitivitySelector from './PreferencesSensitivitySelector/PreferencesSensitivitySelector';
import PreferencesSensitivityPlot from './PreferencesSensitivtyPlot/PreferencesSensitivityPlot';

export default function PreferencesSensitivity(): JSX.Element {
  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">
          Preferences <InlineHelp helpId="sensitivity-preferences" />
        </Typography>
      </Grid>
      <Grid item xs={12} style={{minHeight: '64px'}}>
        <PreferencesSensitivitySelector />
      </Grid>
      <Grid item xs={12}>
        <PreferencesSensitivityPlot />
      </Grid>
    </Grid>
  );
}
