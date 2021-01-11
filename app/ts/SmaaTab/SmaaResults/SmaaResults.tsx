import Grid from '@material-ui/core/Grid';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {SmaaResultsContext} from '../SmaaResultsContext/SmaaResultsContext';
import UncertaintyOptions from './UncertaintyOptions/UncertaintyOptions';

export default function SmaaResults() {
  const {currentScenario, scenarios} = useContext(PreferencesContext);
  const {results} = useContext(SmaaResultsContext);

  return (
    <Grid container spacing={3}>
      <ScenarioSelection
        scenarios={scenarios}
        currentScenario={currentScenario}
      />
      <UncertaintyOptions />
    </Grid>
  );
}
