import {Grid, Typography} from '@material-ui/core';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import {useContext} from 'react';
import MeasurementSensitivity from './MeasurementSensitivity/MeasurementSensitivity';
import PreferencesSensitivity from './PreferencesSensitivity/PreferencesSensitivity';
import {PreferencesSensitivityContextProviderComponent} from './PreferencesSensitivity/PreferencesSensitivityContext';
import {SensitivityAnalysisContext} from './SensitivityAnalysisContext';

export default function SensitivityAnalysis(): JSX.Element {
  const {measurementsSensitivityResults} = useContext(
    SensitivityAnalysisContext
  );
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="one-way-sensitivity-analysis">
            One-way sensitivity analysis
          </InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <LoadingSpinner showSpinnerCondition={!measurementsSensitivityResults}>
          <MeasurementSensitivity />
        </LoadingSpinner>
      </Grid>
      <Grid item xs={6}>
        <PreferencesSensitivityContextProviderComponent>
          <PreferencesSensitivity />
        </PreferencesSensitivityContextProviderComponent>
      </Grid>
    </Grid>
  );
}
