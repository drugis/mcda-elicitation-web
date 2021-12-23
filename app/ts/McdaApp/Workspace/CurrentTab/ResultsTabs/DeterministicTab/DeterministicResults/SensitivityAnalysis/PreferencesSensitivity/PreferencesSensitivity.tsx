import {Grid, Typography} from '@material-ui/core';
import PlotButtons from 'app/ts/PlotButtons/PlotButtons';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import {useContext} from 'react';
import {PreferencesSensitivityContext} from './PreferencesSensitivityContext';
import PreferencesSensitivitySelector from './PreferencesSensitivitySelector/PreferencesSensitivitySelector';
import PreferencesSensitivityPlot from './PreferencesSensitivtyPlot/PreferencesSensitivityPlot';

export default function PreferencesSensitivity(): JSX.Element {
  const {results} = useContext(PreferencesSensitivityContext);
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
        <LoadingSpinner showSpinnerCondition={!results}>
          <PlotButtons plotId="preferences-sensitivity-plot">
            <PreferencesSensitivityPlot />
          </PlotButtons>
        </LoadingSpinner>
      </Grid>
    </Grid>
  );
}
