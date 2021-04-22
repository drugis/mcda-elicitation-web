import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';
import {CurrentScenarioContext} from '../../CurrentScenarioContext/CurrentScenarioContext';
import PreferencesWeightsButtons from './PreferencesWeightsButtons/PreferencesWeightsButtons';
import PreferencesWeightsTable from './PreferencesWeightsTable/PreferencesWeightsTable';

export default function PreferencesWeights() {
  const {elicitationMethod, areAllPvfsSet} = useContext(CurrentScenarioContext);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5">
          <InlineHelp helpId="weights">Weights</InlineHelp>
        </Typography>
      </Grid>
      {areAllPvfsSet ? (
        <>
          <Grid item xs={12}>
            <Typography id="elicitation-method">
              Elicitation method: {elicitationMethod}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <PreferencesWeightsTable />
          </Grid>
          <Grid item xs={12}>
            <PreferencesWeightsButtons />
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Typography>Partial value functions are not set</Typography>
        </Grid>
      )}
    </Grid>
  );
}
