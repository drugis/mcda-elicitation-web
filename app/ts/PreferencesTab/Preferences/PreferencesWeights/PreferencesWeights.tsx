import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import PreferencesWeightsButtons from './PreferencesWeightsButtons/PreferencesWeightsButtons';
import PreferencesWeightsTable from './PreferencesWeightsTable/PreferencesWeightsTable';

export default function PreferencesWeights() {
  const {elicitationMethod, areAllPvfsSet} = useContext(PreferencesContext);

  return (
    <Grid item container>
      <Grid item xs={12}>
        <Typography variant="h5">
          Weights <InlineHelp helpId="weights" />
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
          Partial value functions are not set
        </Grid>
      )}
    </Grid>
  );
}
