import {Grid} from '@material-ui/core';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContext} from 'app/ts/McdaApp/Workspace/ScenariosContext/ScenariosContext';
import ScenarioSelection from 'app/ts/McdaApp/Workspace/CurrentTab/ScenarioSelection/ScenarioSelection';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import React, {useContext} from 'react';
import {DeterministicResultsContextProviderComponent} from '../DeterministicResultsContext/DeterministicResultsContext';
import DeterministicWeightsTable from './DeterministicWeightsTable/DeterministicWeightsTable';
import SensitivityAnalysis from './SensitivityAnalysis/SensitivityAnalysis';
import SensitivityMeasurementsTable from './SensitivityMeasurementsTable/SensitivityMeasurementsTable';
import ValueProfiles from './ValueProfiles/ValueProfiles';

export default function DeterministicResults(): JSX.Element {
  const {scenariosWithPvfs} = useContext(ScenariosContext);
  const {currentScenario} = useContext(CurrentScenarioContext);
  const {
    workspace: {
      properties: {title}
    }
  } = useContext(WorkspaceContext);

  document.title = `${title}'s deterministic results`;

  return (
    <DeterministicResultsContextProviderComponent>
      <Grid container spacing={2}>
        <Grid container item xs={12}>
          <ScenarioSelection
            scenarios={scenariosWithPvfs}
            currentScenario={currentScenario}
          />
        </Grid>
        <SensitivityMeasurementsTable />
        <DeterministicWeightsTable />
        <ValueProfiles />
        <SensitivityAnalysis />
      </Grid>
    </DeterministicResultsContextProviderComponent>
  );
}
