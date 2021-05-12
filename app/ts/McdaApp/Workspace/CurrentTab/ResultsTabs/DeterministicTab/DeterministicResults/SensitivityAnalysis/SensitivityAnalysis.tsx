import {Grid, Typography} from '@material-ui/core';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import MeasurementSensitivity from './MeasurementSensitivity/MeasurementSensitivity';
import PreferencesSensitivity from './PreferencesSensitivity/PreferencesSensitivity';

export default function SensitivityAnalysis(): JSX.Element {
  const {
    measurementsSensitivityResults,
    preferencesSensitivityResults
  } = useContext(DeterministicResultsContext);
  return (
    <Grid container item xs={12} spacing={1}>
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
        <LoadingSpinner showSpinnerCondition={!preferencesSensitivityResults}>
          <PreferencesSensitivity />
        </LoadingSpinner>
      </Grid>
    </Grid>
  );
}
