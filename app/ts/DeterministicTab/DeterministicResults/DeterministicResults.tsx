import {Grid} from '@material-ui/core';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import DeterministicWeightsTable from './DeterministicWeightsTable/DeterministicWeightsTable';
import SensitivityMeasurementsTable from './SensitivityMeasurementsTable/SensitivityMeasurementsTable';
import ValueProfiles from './ValueProfiles/ValueProfiles';

export default function DeterministicResults(): JSX.Element {
  const {currentScenario, scenariosWithPvfs} = useContext(PreferencesContext);
  return (
    <Grid container spacing={2}>
      <ScenarioSelection
        scenarios={scenariosWithPvfs}
        currentScenario={currentScenario}
      />
      <SensitivityMeasurementsTable />
      <DeterministicWeightsTable />
      <ValueProfiles />
    </Grid>
  );
}
